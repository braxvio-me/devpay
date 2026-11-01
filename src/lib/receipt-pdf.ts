/** Renders a receipt as a PDF and opens the share sheet (Save to Files, WhatsApp, email…). */
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Ionicons } from '@expo/vector-icons';
import type { Receipt, ReceiptKind } from '@/contexts/ReceiptsContext';
import { SUPPORT_EMAIL } from '@/constants/app';

export const cedis = (n: number) => `GH₵ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const RECEIPT_ICON: Record<ReceiptKind, keyof typeof Ionicons.glyphMap> = {
  escrow_funding: 'lock-closed',
  release: 'arrow-up',
  payout: 'arrow-down',
  verification: 'shield-checkmark',
  subscription: 'star',
  earning: 'cash',
};

export const receiptDate = (ms: number) =>
  new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function receiptHtml(r: Receipt) {
  const rows: [string, string][] = [
    ['Reference', r.ref],
    ['Date', receiptDate(r.createdAt)],
    ['Paid by', r.from],
    ['Paid to', r.to],
    ['Method', r.method],
    ['Status', r.status],
  ];
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Roboto, Arial, sans-serif; color: #15181B; margin: 0; padding: 48px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #15181B; padding-bottom: 20px; }
  .brand { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .brand span { color: #13C3A3; }
  .muted { color: #5F6B73; font-size: 12px; line-height: 1.6; }
  h1 { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px; text-align: right; }
  .amount { margin: 32px 0 8px; font-size: 40px; font-weight: 800; letter-spacing: -1px; }
  .title { font-size: 16px; margin-bottom: 28px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 12px 0; border-bottom: 1px solid #E3E8EB; }
  td:last-child { text-align: right; font-weight: 600; }
  .total td { border-bottom: none; border-top: 2px solid #15181B; font-size: 16px; font-weight: 800; }
  .stamp { display: inline-block; margin-top: 28px; padding: 6px 14px; border: 2px solid #178A60; color: #178A60; border-radius: 6px; font-weight: 800; letter-spacing: 2px; font-size: 12px; text-transform: uppercase; }
  .foot { margin-top: 48px; }
</style></head><body>
  <div class="head">
    <div><div class="brand">Dev<span>Pay</span></div><div class="muted">Escrow payments for Ghana’s freelancers<br>Accra, Ghana · ${esc(SUPPORT_EMAIL)}</div></div>
    <div><h1>Receipt</h1><div class="muted" style="text-align:right">${esc(r.ref)}</div></div>
  </div>
  <div class="amount">${esc(cedis(r.amount))}</div>
  <div class="title">${esc(r.title)}</div>
  <table>
    ${rows.map(([k, v]) => `<tr><td class="muted">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}
    <tr><td class="muted">Amount</td><td>${esc(cedis(r.amount))}</td></tr>
    <tr><td class="muted">Fees</td><td>${r.fee ? esc(cedis(r.fee)) : 'Free'}</td></tr>
    <tr class="total"><td>Total</td><td>${esc(cedis(r.amount + r.fee))}</td></tr>
  </table>
  <div class="stamp">${esc(r.status)}</div>
  <div class="foot muted">Keep this receipt for your records. Questions about this payment? Email ${esc(SUPPORT_EMAIL)} and quote ${esc(r.ref)}.<br>Funds held in escrow are released only when the client approves the work or the 7-day review window ends.</div>
</body></html>`;
}

/** Returns an error message, or null when the PDF was shared or printed. */
export async function downloadReceipt(r: Receipt): Promise<string | null> {
  const html = receiptHtml(r);
  try {
    if (Platform.OS === 'web') {
      // The browser's print dialog has "Save as PDF".
      await Print.printAsync({ html });
      return null;
    }
    const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
    if (!(await Sharing.isAvailableAsync())) return 'Sharing isn’t available on this device.';
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: `DevPay receipt ${r.ref}` });
    return null;
  } catch {
    return 'We couldn’t create the PDF. Try again.';
  }
}

export async function printReceipt(r: Receipt): Promise<string | null> {
  try {
    await Print.printAsync({ html: receiptHtml(r) });
    return null;
  } catch {
    return null; // closing the print dialog without printing isn't an error worth showing
  }
}
