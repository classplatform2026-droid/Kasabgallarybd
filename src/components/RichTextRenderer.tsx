import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses inline formatting:
 * - **bold** or <b>bold</b> or <strong>bold</strong>
 * - *italic* or _italic_ or <i>italic</i> or <em>italic</em>
 * - <u>underline</u> or ~underline~
 * - `code`
 * - links: [text](url)
 */
export const renderInlineFormattedText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split tokens for markdown and simple HTML tags
  // We handle:
  // **bold**, *italic*, <u>underline</u>, <b>bold</b>, <i>italic</i>, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|<b>.*?<\/b>|<strong>.*?<\/strong>|\*.*?\*|<u>.*?<\/u>|<em>.*?<\/em>|<i>.*?<\/i>|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text** or <b>text</b> or <strong>text</strong>
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-neutral-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return (
        <strong key={index} className="font-bold text-neutral-950">
          {part.slice(3, -4)}
        </strong>
      );
    }
    if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
      return (
        <strong key={index} className="font-bold text-neutral-950">
          {part.slice(8, -9)}
        </strong>
      );
    }

    // Underline: <u>text</u>
    if (part.startsWith('<u>') && part.endsWith('</u>')) {
      const inner = part.slice(3, -4);
      return (
        <span key={index} className="underline underline-offset-4 decoration-[#2d5016]/60 decoration-1.5 font-medium text-neutral-900">
          {inner}
        </span>
      );
    }

    // Italic: *text* or <i>text</i> or <em>text</em>
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
      return (
        <em key={index} className="italic text-neutral-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('<i>') && part.endsWith('</i>')) {
      return (
        <em key={index} className="italic text-neutral-800">
          {part.slice(3, -4)}
        </em>
      );
    }
    if (part.startsWith('<em>') && part.endsWith('</em>')) {
      return (
        <em key={index} className="italic text-neutral-800">
          {part.slice(4, -5)}
        </em>
      );
    }

    // Inline code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-neutral-100 text-[#2d5016] text-xs font-mono font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Links: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2d5016] font-semibold underline underline-offset-2 hover:text-emerald-700 transition-colors"
        >
          {linkText}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

/**
 * RichTextRenderer:
 * Parses block structures:
 * - H1, H2, H3, H4 headings (#, ##, ###, ####)
 * - Bullet lists (- item or * item)
 * - Numbered lists (1. item or ১. item)
 * - Blockquotes (> quote)
 * - Horizontal rules (---)
 * - Callout boxes ([!NOTE], [!TIP])
 * - Standard paragraphs with inline bold, italic, underline, bullets
 */
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // If the content is an HTML string from the WYSIWYG rich text editor
  const isHtml = /<\/?(p|h[1-6]|ul|ol|li|blockquote|strong|b|em|i|u|span|div|a|br)[^>]*>/i.test(content);
  if (isHtml) {
    return (
      <div 
        className={`rich-article-content space-y-4 text-neutral-800 text-sm sm:text-base leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  // Split lines for Markdown fallback
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let currentBulletList: { key: string; items: string[] } | null = null;
  let currentNumberedList: { key: string; items: { num?: string; text: string }[] } | null = null;

  const flushLists = (idx: number) => {
    if (currentBulletList && currentBulletList.items.length > 0) {
      elements.push(
        <ul
          key={`bullet-list-${idx}`}
          className="space-y-2 my-4 pl-2 sm:pl-3 border-l-2 border-[#2d5016]/20 py-1"
        >
          {currentBulletList.items.map((item, bIdx) => (
            <li key={bIdx} className="flex items-start gap-2.5 text-neutral-800 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-[#2d5016] mt-2 shrink-0 shadow-2xs" />
              <div className="flex-1 min-w-0">
                {renderInlineFormattedText(item)}
              </div>
            </li>
          ))}
        </ul>
      );
      currentBulletList = null;
    }

    if (currentNumberedList && currentNumberedList.items.length > 0) {
      elements.push(
        <ol
          key={`numbered-list-${idx}`}
          className="space-y-2.5 my-4 pl-1 sm:pl-2"
        >
          {currentNumberedList.items.map((item, nIdx) => (
            <li key={nIdx} className="flex items-start gap-3 text-neutral-800 leading-relaxed">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-xs font-bold shrink-0 mt-0.5 border border-[#2d5016]/20">
                {item.num || `${nIdx + 1}.`}
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                {renderInlineFormattedText(item.text)}
              </div>
            </li>
          ))}
        </ol>
      );
      currentNumberedList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line
    if (!trimmed) {
      flushLists(i);
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      flushLists(i);
      elements.push(
        <h4 key={`h4-${i}`} className="font-serif-brand text-base sm:text-lg font-bold text-neutral-900 mt-6 mb-2">
          {renderInlineFormattedText(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushLists(i);
      elements.push(
        <h3 key={`h3-${i}`} className="font-serif-brand text-lg sm:text-xl font-bold text-neutral-900 mt-7 mb-3 border-b border-neutral-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-[#2d5016]" />
          <span>{renderInlineFormattedText(trimmed.replace(/^###\s+/, ''))}</span>
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushLists(i);
      elements.push(
        <h2 key={`h2-${i}`} className="font-serif-brand text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-4 border-b border-neutral-200 pb-2.5">
          {renderInlineFormattedText(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushLists(i);
      elements.push(
        <h1 key={`h1-${i}`} className="font-serif-brand text-2xl sm:text-3xl font-black text-neutral-900 mt-8 mb-4">
          {renderInlineFormattedText(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushLists(i);
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-neutral-200" />
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushLists(i);
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-l-4 border-[#d4af37] text-neutral-800 italic leading-relaxed text-sm sm:text-base shadow-2xs"
        >
          {renderInlineFormattedText(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      continue;
    }

    // Bullet points: "-", "*", "•"
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (currentNumberedList) flushLists(i);
      if (!currentBulletList) {
        currentBulletList = { key: `bullet-${i}`, items: [] };
      }
      currentBulletList.items.push(bulletMatch[1]);
      continue;
    }

    // Numbered list items: English digits (1., 2.) or Bengali digits (১., ২.)
    const numberedMatch = trimmed.match(/^([0-9]+|[০-৯]+)[.)]\s+(.*)$/);
    if (numberedMatch) {
      if (currentBulletList) flushLists(i);
      if (!currentNumberedList) {
        currentNumberedList = { key: `num-${i}`, items: [] };
      }
      currentNumberedList.items.push({ num: `${numberedMatch[1]}.`, text: numberedMatch[2] });
      continue;
    }

    // Callout box / highlight
    if (trimmed.startsWith('[!NOTE]') || trimmed.startsWith('[!TIP]')) {
      flushLists(i);
      const isTip = trimmed.startsWith('[!TIP]');
      const calloutText = trimmed.replace(/^\[!(NOTE|TIP)\]\s*/, '');
      elements.push(
        <div
          key={`callout-${i}`}
          className={`p-4 rounded-2xl my-4 text-xs sm:text-sm flex items-start gap-3 border ${
            isTip
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <span className="font-bold shrink-0 uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
            {isTip ? 'টিপস' : 'বিশেষ দ্রষ্টব্য'}
          </span>
          <div className="flex-1 leading-relaxed">
            {renderInlineFormattedText(calloutText)}
          </div>
        </div>
      );
      continue;
    }

    // Standard paragraph
    flushLists(i);
    elements.push(
      <p key={`p-${i}`} className="text-neutral-700 leading-relaxed text-sm sm:text-base">
        {renderInlineFormattedText(trimmed)}
      </p>
    );
  }

  // Flush remaining lists at end
  flushLists(lines.length);

  return <div className={`space-y-4 ${className}`}>{elements}</div>;
};
