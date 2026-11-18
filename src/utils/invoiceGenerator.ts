import { Order } from '../types';
import { BRAND_CONFIG } from '../data/mockData';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Generates an elegant, printable and downloadable HTML Cash Memo / Invoice
 */
export function generateInvoiceHtml(order: Order, brandConfig = BRAND_CONFIG): string {
  const formattedDate = new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentMethodLabel = {
    cod: 'ক্যাশ অন ডেলিভারি (COD)',
    bkash: 'বিকাশ (bKash)',
    nagad: 'নগদ (Nagad)',
    rocket: 'রকেট (Rocket)',
  }[order.paymentMethod || 'cod'] || 'ক্যাশ অন ডেলিভারি';

  const statusLabel = {
    pending: 'অপেক্ষমান (Pending)',
    confirmed: 'নিশ্চিত (Confirmed)',
    processing: 'প্রক্রিয়াধীন (Processing)',
    courier_assigned: 'কুরিয়ার অ্যাসাইনড (Courier Assigned)',
    shipped: 'ডেলিভারিতে আছে (Shipped)',
    delivered: 'ডেলিভারি সম্পন্ন (Delivered)',
    hold: 'হোল্ড (On Hold)',
    returned: 'রিটার্নড (Returned)',
    cancelled: 'বাতিলকৃত (Cancelled)',
  }[order.status || 'pending'] || 'অপেক্ষমান';

  const rows = order.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
          <strong style="color: #111827; display: block;">${item.banglaName || item.name}</strong>
          ${item.banglaName && item.name !== item.banglaName ? `<span style="font-size: 11px; color: #6b7280;">${item.name}</span>` : ''}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13px; font-weight: 600; color: #111827;">${item.quantity}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 13px; color: #374151;">৳${item.price.toLocaleString('en-US')}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 13px; font-weight: 700; color: #111827;">৳${(item.price * item.quantity).toLocaleString('en-US')}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order._id} | Kasab Gallery</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f4f4f5;
      color: #18181b;
      line-height: 1.5;
      padding: 24px 12px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px 40px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid #e4e4e7;
    }
    .no-print {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background: #2d5016;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
    }
    .no-print button {
      background: #d4af37;
      color: #1a1a1a;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .no-print button:hover {
      background: #e5bd3b;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .header-logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #2d5016;
      letter-spacing: -0.5px;
    }
    .header-logo span {
      color: #d4af37;
    }
    .header-tagline {
      font-size: 11px;
      color: #52525b;
      margin-top: 2px;
    }
    .invoice-badge {
      display: inline-block;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .info-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #71717a;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .info-name {
      font-size: 15px;
      font-weight: 700;
      color: #18181b;
      margin-bottom: 2px;
    }
    .info-text {
      font-size: 13px;
      color: #3f3f46;
      line-height: 1.4;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table th {
      background: #f4f4f5;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #3f3f46;
      border-top: 1px solid #e4e4e7;
      border-bottom: 2px solid #d4d4d8;
    }
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .summary-box {
      width: 320px;
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 14px 18px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #52525b;
      padding: 4px 0;
    }
    .summary-row.total {
      border-top: 2px dashed #d4d4d8;
      margin-top: 6px;
      padding-top: 10px;
      font-size: 16px;
      font-weight: 800;
      color: #2d5016;
    }
    .notes-box {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      color: #854d0e;
      margin-bottom: 24px;
    }
    .terms-box {
      border-top: 1px solid #e4e4e7;
      padding-top: 16px;
      font-size: 11px;
      color: #71717a;
      line-height: 1.6;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
      padding-top: 20px;
    }
    .signature-line {
      border-top: 1px dashed #a1a1aa;
      text-align: center;
      padding-top: 6px;
      font-size: 12px;
      color: #52525b;
      font-weight: 600;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .invoice-container {
        border: none !important;
        box-shadow: none !important;
        padding: 10px !important;
        max-width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Top Action Bar (hidden in print) -->
    <div class="no-print">
      <div>
        <strong style="font-size: 14px; display: block;">Kasab Gallery অফিসিয়াল ক্যাশ মেমো / ইনভয়েস</strong>
        <span style="font-size: 11px; opacity: 0.9;">অর্ডার আইডি: #${order._id}</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.print()">
          🖨️ প্রিন্ট করুন / PDF সেভ করুন
        </button>
      </div>
    </div>

    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; width: 60%;">
          <div class="header-logo">Kasab <span>Gallery</span></div>
          <p class="header-tagline">${brandConfig.tagline}</p>
          <p style="font-size: 12px; color: #52525b; margin-top: 6px;">
            ঠিকানা: ${brandConfig.banglaAddress}<br>
            হটলাইন: <strong>${brandConfig.displayPhone}</strong> | ইমেইল: ${brandConfig.email}
          </p>
        </td>
        <td style="vertical-align: top; text-align: right; width: 40%;">
          <span class="invoice-badge">ক্যাশ মেমো / ইনভয়েস</span>
          <h2 style="font-size: 18px; color: #18181b; font-weight: 800; font-family: monospace;">#${order._id}</h2>
          <p style="font-size: 12px; color: #71717a; margin-top: 4px;">তারিখ: ${formattedDate}</p>
          <p style="font-size: 12px; color: #2d5016; font-weight: 700; margin-top: 2px;">স্ট্যাটাস: ${statusLabel}</p>
        </td>
      </tr>
    </table>

    <!-- Customer & Payment Info Grid -->
    <div class="info-grid">
      <div>
        <div class="info-title">গ্রাহকের বিবরণ (Customer Details)</div>
        <div class="info-name">${order.customer.name}</div>
        <div class="info-text">
          মোবাইল: <strong>${order.customer.phone}</strong><br>
          ${order.customer.email ? `ইমেইল: ${order.customer.email}<br>` : ''}
          ঠিকানা: ${order.customer.address}<br>
          এলাকা: ${order.customer.district ? `${order.customer.district}, ` : ''}${order.customer.city === 'Dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}
        </div>
      </div>
      <div>
        <div class="info-title">পেমেন্ট ও ডেলিভারি বিবরণ</div>
        <div class="info-text">
          পেমেন্ট মাধ্যম: <strong>${paymentMethodLabel}</strong><br>
          ${order.paymentSenderNumber ? `প্রেরকের মোবাইল: <strong>${order.paymentSenderNumber}</strong><br>` : ''}
          ${order.paymentTrxId ? `ট্রানজেকশন আইডি (TrxID): <strong style="font-family: monospace;">${order.paymentTrxId}</strong><br>` : ''}
          অর্ডার চ্যানেল: ${order.channel === 'whatsapp' ? '📱 WhatsApp' : '🌐 Website COD'}<br>
          ডেলিভারি ধরন: হোম ডেলিভারি (কুরিয়ার সার্ভিস)${order.courierName ? `<br>কুরিয়ার পার্টনার: <strong>${order.courierName}</strong>` : ''}${order.trackingNumber ? `<br>ট্র্যাকিং কোড: <strong style="font-family: monospace;">${order.trackingNumber}</strong>` : ''}
        </div>
      </div>
    </div>

    <!-- Notes if any -->
    ${
      order.customer.notes
        ? `<div class="notes-box">
            <strong>বিশেষ নির্দেশনা / নোট:</strong> ${order.customer.notes}
          </div>`
        : ''
    }

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 40px; text-align: center;">#</th>
          <th style="text-align: left;">পণ্যের নাম</th>
          <th style="width: 70px; text-align: center;">পরিমাণ</th>
          <th style="width: 100px; text-align: right;">একক মূল্য</th>
          <th style="width: 110px; text-align: right;">মোট মূল্য</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <!-- Financial Summary Box -->
    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-row">
          <span>পণ্য উপমোট (Subtotal):</span>
          <span>৳${order.subtotal.toLocaleString('en-US')}</span>
        </div>
        ${
          order.discount && order.discount > 0
            ? `<div class="summary-row" style="color: #15803d; font-weight: 600;">
                <span>কুপন ডিসকাউন্ট ${order.couponCode ? `(${order.couponCode})` : ''}:</span>
                <span>- ৳${order.discount.toLocaleString('en-US')}</span>
              </div>`
            : ''
        }
        <div class="summary-row">
          <span>ডেলিভারি চার্জ (${order.customer.city === 'Dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'}):</span>
          <span>৳${order.delivery_charge.toLocaleString('en-US')}</span>
        </div>
        <div class="summary-row total">
          <span>সর্বমোট প্রদেয় মূল্য:</span>
          <span>৳${order.total.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>

    <!-- Terms & Sunnah Commitment -->
    <div class="terms-box">
      <strong style="color: #27272a; display: block; margin-bottom: 4px;">শর্তাবলী ও নির্দেশিকা:</strong>
      <ol style="padding-left: 18px; margin-bottom: 8px;">
        <li>ডেলিভারিম্যানের সামনে পার্সেলটি খুলে পণ্যের সঠিকতা যাচাই করে মূল্য পরিশোধ করুন।</li>
        <li>Kasab Gallery প্রতিটি পণ্যের ১০০% গুণমান, বিশুদ্ধতা ও সুন্নত সম্মত মানের নিশ্চয়তা প্রদান করে।</li>
        <li>যেকোনো ধরণের অভিযোগ বা সহায়তার জন্য আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নম্বরে (<strong>${brandConfig.displayPhone}</strong>) মেসেজ করুন।</li>
      </ol>
      <p style="text-align: center; color: #2d5016; font-weight: 600; margin-top: 10px;">
        🌿 Kasab Gallery-র সাথে থাকার জন্য আপনাকে ধন্যবাদ! জাযাকুমুল্লাহু খায়রান।
      </p>
    </div>

    <!-- Signatures -->
    <div class="signature-grid">
      <div class="signature-line">
        Kasab Gallery (অনুমোদিত স্বাক্ষর)
      </div>
      <div class="signature-line">
        গ্রাহকের স্বাক্ষর
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers clean, isolated iframe printing so no navbar or extra web elements are printed
 */
export function printInvoice(order: Order, brandConfig = BRAND_CONFIG): void {
  const html = generateInvoiceHtml(order, brandConfig);

  // Create a dedicated invisible iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '1000px';
  iframe.style.height = '1000px';
  iframe.style.border = 'none';
  iframe.id = 'invoice-print-frame';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback if iframe access fails
    window.print();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts and styling to render, then print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      // Clean up after small delay
      setTimeout(() => {
        try {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch {}
      }, 3000);
    }
  }, 400);
}

/**
 * Directly generates and downloads an A4 PDF invoice file (Invoice-Kasab-<id>.pdf)
 */
export async function downloadInvoice(order: Order, brandConfig = BRAND_CONFIG): Promise<void> {
  const html = generateInvoiceHtml(order, brandConfig);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '-10000px';
  iframe.style.width = '840px';
  iframe.style.height = '1200px';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.id = 'invoice-pdf-render-frame';

  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      throw new Error('Could not access iframe document for PDF rendering');
    }

    doc.open();
    doc.write(html);
    doc.close();

    // Hide interactive print bar & adjust container for clean PDF sheet
    const styleOverride = doc.createElement('style');
    styleOverride.textContent = `
      body { background: #ffffff !important; padding: 0 !important; margin: 0 !important; }
      .no-print { display: none !important; }
      .invoice-container {
        width: 800px !important;
        max-width: 800px !important;
        margin: 0 auto !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 28px 36px !important;
      }
    `;
    doc.head.appendChild(styleOverride);

    // Wait for fonts and layout to settle (capped so offline environments don't hang)
    await Promise.race([
      (doc as any).fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 150));

    const target = (doc.querySelector('.invoice-container') as HTMLElement) || doc.body;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: target.scrollWidth,
      height: target.scrollHeight,
      windowWidth: 840,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const imgHeightMm = (canvas.height * usableWidth) / canvas.width;

    if (imgHeightMm <= usableHeight) {
      pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, imgHeightMm, undefined, 'FAST');
    } else {
      // Multi-page pagination if order has many items
      let heightLeft = imgHeightMm;
      let positionY = margin;

      pdf.addImage(imgData, 'JPEG', margin, positionY, usableWidth, imgHeightMm, undefined, 'FAST');
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        positionY -= pageHeight - margin * 2;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, positionY, usableWidth, imgHeightMm, undefined, 'FAST');
        heightLeft -= usableHeight;
      }
    }

    pdf.save(`Invoice-Kasab-${order._id}.pdf`);
  } catch (err) {
    console.error('[PDF Invoice] Generation failed, falling back to print dialog:', err);
    printInvoice(order, brandConfig);
  } finally {
    setTimeout(() => {
      try {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      } catch {}
    }, 300);
  }
}
