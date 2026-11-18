import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
  Highlighter,
  Palette,
  Minus,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Check,
  ChevronDown,
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * Converts legacy markdown format to HTML so that existing blogs
 * display with real visual styling instead of raw asterisks.
 */
export function convertMarkdownToHtml(md: string): string {
  if (!md) return '';
  // If already contains HTML paragraph/heading/list/bold tags, return as is
  if (/<\/?(p|h[1-6]|ul|ol|li|strong|b|em|i|u|blockquote|mark|s|del|pre|hr)[^>]*>/i.test(md)) {
    return md;
  }

  let formatted = md
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    .replace(/~~(.*?)~~/g, '<s>$1</s>');

  const lines = formatted.split('\n');
  let result = '';
  let inUl = false;
  let inOl = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += '<hr />';
    } else if (trimmed.startsWith('#### ')) {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += `<h4>${trimmed.slice(5)}</h4>`;
    } else if (trimmed.startsWith('### ')) {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += `<h3>${trimmed.slice(4)}</h3>`;
    } else if (trimmed.startsWith('## ')) {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += `<h2>${trimmed.slice(3)}</h2>`;
    } else if (trimmed.startsWith('# ')) {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += `<h1>${trimmed.slice(2)}</h1>`;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      if (!inUl) {
        result += '<ul>';
        inUl = true;
      }
      result += `<li>${trimmed.replace(/^[-*•]\s+/, '')}</li>`;
    } else if (/^([0-9]+|[০-৯]+)[.)]\s+/.test(trimmed)) {
      if (!inOl) {
        result += '<ol>';
        inOl = true;
      }
      result += `<li>${trimmed.replace(/^([0-9]+|[০-৯]+)[.)]\s+/, '')}</li>`;
    } else if (trimmed.startsWith('> ')) {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += `<blockquote>${trimmed.slice(2)}</blockquote>`;
    } else {
      if (inUl) { result += '</ul>'; inUl = false; }
      if (inOl) { result += '</ol>'; inOl = false; }
      result += `<p>${trimmed}</p>`;
    }
  }

  if (inUl) result += '</ul>';
  if (inOl) result += '</ol>';

  return result || '<p><br></p>';
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'এখানে আপনার সম্পূর্ণ ব্লগের লেখা শুরু করুন... (লেখা সিলেক্ট করে ওপরে বোল্ড, হেডিং বা লিস্ট বাটনে চাপ দিন)',
  minHeight = 'min-h-[500px]',
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastEmittedValueRef = useRef<string>('');
  const [wordCount, setWordCount] = useState(0);

  // Active state trackers for styling buttons
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    heading: 'p',
  });

  const updateCounts = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  };

  // Inspect current document selection to update active style button highlights
  const checkActiveStyles = useCallback(() => {
    if (!document) return;
    try {
      const bold = document.queryCommandState('bold');
      const italic = document.queryCommandState('italic');
      const underline = document.queryCommandState('underline');
      const strikeThrough = document.queryCommandState('strikeThrough');
      const justifyLeft = document.queryCommandState('justifyLeft');
      const justifyCenter = document.queryCommandState('justifyCenter');
      const justifyRight = document.queryCommandState('justifyRight');
      const insertUnorderedList = document.queryCommandState('insertUnorderedList');
      const insertOrderedList = document.queryCommandState('insertOrderedList');

      // Check current block heading tag
      let heading = 'p';
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node: Node | null = selection.anchorNode;
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = (node as HTMLElement).tagName.toLowerCase();
            if (['h1', 'h2', 'h3', 'h4', 'blockquote', 'pre', 'p'].includes(tag)) {
              heading = tag;
              break;
            }
          }
          node = node.parentNode;
        }
      }

      setActiveStyles({
        bold,
        italic,
        underline,
        strikeThrough,
        justifyLeft,
        justifyCenter,
        justifyRight,
        insertUnorderedList,
        insertOrderedList,
        heading,
      });
    } catch {
      // ignore
    }
  }, []);

  // Listen for selection changes across the editor
  useEffect(() => {
    const handleSelectionChange = () => {
      if (
        document.activeElement === editorRef.current ||
        editorRef.current?.contains(document.activeElement)
      ) {
        checkActiveStyles();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [checkActiveStyles]);

  // Synchronize incoming value if changed externally (e.g., loaded a post or cleared)
  useEffect(() => {
    if (!editorRef.current) return;
    const converted = convertMarkdownToHtml(value);

    // Only update innerHTML if it didn't come from our own handleInput
    if (value !== lastEmittedValueRef.current) {
      editorRef.current.innerHTML = converted;
      lastEmittedValueRef.current = value;
      updateCounts(editorRef.current.innerText || '');
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || '';
    lastEmittedValueRef.current = html;
    updateCounts(text);
    onChange(html);
    checkActiveStyles();
  }, [onChange, checkActiveStyles]);

  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    handleInput();
    checkActiveStyles();
  };

  // Keyboard shortcut listener (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        execCmd('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        execCmd('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        execCmd('underline');
      } else if (e.key === 'z' || e.key === 'Z') {
        if (e.shiftKey) {
          e.preventDefault();
          execCmd('redo');
        } else {
          e.preventDefault();
          execCmd('undo');
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        execCmd('redo');
      }
    }
  };

  // Handle Link Insertion
  const handleInsertLink = () => {
    const url = prompt('লিংক ঠিকানা (URL) প্রবেশ করুন:', 'https://');
    if (url && url.trim() && url !== 'https://') {
      execCmd('createLink', url.trim());
    }
  };

  // Handle Heading / Block Change from Dropdown
  const handleHeadingChange = (tag: string) => {
    if (tag === 'p') {
      execCmd('formatBlock', '<p>');
    } else if (tag === 'blockquote') {
      execCmd('formatBlock', '<blockquote>');
    } else if (tag === 'pre') {
      execCmd('formatBlock', '<pre>');
    } else {
      execCmd('formatBlock', `<${tag}>`);
    }
  };

  // Toggle Highlight Background (Yellow Marker)
  const handleToggleHighlight = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    try {
      document.execCommand('hiliteColor', false, '#fef08a');
    } catch {
      document.execCommand('backColor', false, '#fef08a');
    }
    handleInput();
  };

  // Toggle Brand Color (Forest Green)
  const handleToggleColor = (color: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('foreColor', false, color);
    handleInput();
  };

  return (
    <div className="w-full flex flex-col rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-xs focus-within:border-[#2d5016] focus-within:ring-2 focus-within:ring-[#2d5016]/10 transition-all">
      {/* Sticky Rich Text Toolbar with Dropdown Heading & Style Buttons */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-1.5 p-2 sm:px-3 bg-[#faf9f5] border-b border-neutral-200/80 backdrop-blur-md">
        
        {/* Formatting Actions Bar */}
        <div className="flex flex-wrap items-center gap-1">
          
          {/* 1. HEADING DROPDOWN SELECTION (bedding selection) */}
          <div className="relative inline-flex items-center">
            <select
              value={activeStyles.heading}
              onChange={(e) => handleHeadingChange(e.target.value)}
              className="appearance-none bg-white border border-neutral-200/90 hover:border-[#2d5016] text-neutral-800 text-xs font-bold pl-2.5 pr-7 py-1.5 rounded-xl shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2d5016] transition-all"
              title="শিরোনাম ও প্যারাগ্রাফ নির্বাচন করুন"
            >
              <option value="p">¶ সাধারণ লেখা (Paragraph)</option>
              <option value="h1">H1 বড় শিরোনাম (Heading 1)</option>
              <option value="h2">H2 মূল সেকশন (Heading 2)</option>
              <option value="h3">H3 উপ-শিরোনাম (Heading 3)</option>
              <option value="h4">H4 ছোট সাবহেডিং (Heading 4)</option>
              <option value="blockquote">❝ উদ্ধৃতি ব্লক (Quote)</option>
              <option value="pre">⟨/⟩ কোড ব্লক (Code Block)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 pointer-events-none" />
          </div>

          <span className="w-px h-5 bg-neutral-300 mx-0.5" />

          {/* 2. CORE TEXT STYLES (BOLD, ITALIC, UNDERLINE, STRIKE) */}
          {/* Bold */}
          <button
            type="button"
            onClick={() => execCmd('bold')}
            title="বোল্ড (Bold - Ctrl+B)"
            className={`p-1.5 sm:px-2 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95 ${
              activeStyles.bold
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">বোল্ড</span>
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => execCmd('italic')}
            title="ইটালিক (Italic - Ctrl+I)"
            className={`p-1.5 sm:px-2 rounded-xl border text-xs italic transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95 ${
              activeStyles.italic
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">ইটালিক</span>
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => execCmd('underline')}
            title="আন্ডারলাইন (Underline - Ctrl+U)"
            className={`p-1.5 sm:px-2 rounded-xl border text-xs underline transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95 ${
              activeStyles.underline
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <Underline className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">আন্ডারলাইন</span>
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            title="স্ট্রাইকথ্রু / কাটা দাগ (Strikethrough)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.strikeThrough
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-neutral-300 mx-0.5" />

          {/* 3. ALIGNMENT (LEFT, CENTER, RIGHT, JUSTIFY) */}
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            title="বাম প্রান্ত (Align Left)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.justifyLeft
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            title="মাঝখানে (Align Center)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.justifyCenter
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            title="ডান প্রান্ত (Align Right)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.justifyRight
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            title="সমান প্রান্ত (Justify)"
            className="p-1.5 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-100 text-neutral-700 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-neutral-300 mx-0.5" />

          {/* 4. LISTS (BULLET & NUMBERED) */}
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            title="বুলেট তালিকা (Bullet Points)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.insertUnorderedList
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            title="নম্বর তালিকা (Numbered List)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.insertOrderedList
                ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016]'
                : 'bg-white border-neutral-200/80 hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Blockquote quick button */}
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<blockquote>')}
            title="উদ্ধৃতি বক্স (Blockquote)"
            className={`p-1.5 rounded-xl border text-xs transition-all shadow-2xs cursor-pointer active:scale-95 ${
              activeStyles.heading === 'blockquote'
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                : 'bg-white border-neutral-200/80 hover:bg-amber-50 text-neutral-700'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-neutral-300 mx-0.5" />

          {/* 5. COLOR & HIGHLIGHT */}
          {/* Yellow Marker Highlight */}
          <button
            type="button"
            onClick={handleToggleHighlight}
            title="হলুদ মার্কার হাইলাইট (Highlight Marker)"
            className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-600" />
          </button>

          {/* Green Brand Text Color */}
          <button
            type="button"
            onClick={() => handleToggleColor('#2d5016')}
            title="Kasab Gallery Green Color"
            className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Palette className="w-3.5 h-3.5 text-[#2d5016]" />
          </button>

          {/* Horizontal Line Divider */}
          <button
            type="button"
            onClick={() => execCmd('insertHorizontalRule')}
            title="ডিভাইডার লাইন (Divider Line)"
            className="p-1.5 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-100 text-neutral-700 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Insert Link */}
          <button
            type="button"
            onClick={handleInsertLink}
            title="লিংক যোগ করুন (Insert Link)"
            className="p-1.5 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-100 text-neutral-700 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {/* 6. UNDO / REDO & CLEAR */}
          <button
            type="button"
            onClick={() => execCmd('undo')}
            title="আগের অবস্থায় ফিরুন (Undo - Ctrl+Z)"
            className="p-1.5 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-100 text-neutral-600 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('redo')}
            title="পুনরায় করুন (Redo - Ctrl+Y)"
            className="p-1.5 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-100 text-neutral-600 text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('removeFormat')}
            title="ফরম্যাট মুছুন (Clear Formatting)"
            className="p-1.5 rounded-xl bg-white border border-neutral-200/80 hover:bg-rose-50 hover:text-rose-700 text-neutral-500 transition-all shadow-2xs cursor-pointer text-xs active:scale-95"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Word count & Live Status Badge on Far Right */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium ml-auto">
          <span className="hidden sm:inline bg-neutral-100 px-2.5 py-1 rounded-full text-[11px] font-mono">
            শব্দ: <strong className="text-neutral-900">{wordCount}</strong>
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
            <Check className="w-3 h-3" />
            <span className="hidden sm:inline">সরাসরি স্টাইল</span>
          </span>
        </div>

      </div>

      {/* WYSIWYG Editable Writing Area (No bottom buttons, clean spacious pad) */}
      <div className="p-4 sm:p-8 flex-1 bg-white">
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={checkActiveStyles}
          onMouseUp={checkActiveStyles}
          data-placeholder={placeholder}
          className={`rich-article-content focus:outline-none text-neutral-900 text-base sm:text-lg leading-relaxed ${minHeight} empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:pointer-events-none`}
        />
      </div>
    </div>
  );
};
