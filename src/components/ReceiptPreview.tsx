import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  ArrowRight, 
  Smartphone, 
  FileText, 
  Calendar, 
  User, 
  Fingerprint, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { ReceiptData, BANK_CONFIGS, BankEWallet } from '../types';

interface ReceiptPreviewProps {
  data: ReceiptData;
  receiptRef: React.RefObject<HTMLDivElement | null>;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data, receiptRef }) => {
  const config = BANK_CONFIGS[data.bank];

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  // Safe split name to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'TX';
  };

  // Helper to mask sensitive information elegantly
  const maskAccount = (account: string, isEWallet: boolean) => {
    if (!account) return '---';
    if (isEWallet && account.startsWith('09') && account.length >= 11) {
      return `${account.substring(0, 4)}***${account.substring(7)}`;
    }
    if (account.length > 8) {
      return `****-****-${account.substring(account.length - 4)}`;
    }
    return account;
  };

  // Format date elegantly
  const formatCustomDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }) + ' • ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  // Total calculation
  const totalAmount = Number(data.amount) + Number(data.fee);

  // Bank Specific Receipt Templates
  const renderGCashReceipt = () => (
    <div className="h-full flex flex-col justify-between bg-white text-[#111827]">
      {/* Wave Blue Header Section */}
      <div className="bg-[#005CE6] text-white px-6 pt-10 pb-12 rounded-b-[2rem] relative overflow-hidden shadow-md">
        {/* Abstract background circles for GCash vibe */}
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 rounded-full bg-blue-400/20 blur-xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#005CE6] p-1.5 rounded-full font-black text-sm tracking-tighter flex items-center justify-center w-8 h-8 font-sans">
              G)
            </div>
            <span className="font-sans font-extrabold tracking-tight text-lg">GCash</span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-1 font-mono">
            <ShieldCheck size={12} /> SECURE
          </span>
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-blue-100/50">
            <Check className="text-[#005CE6] stroke-[3]" size={28} />
          </div>
          <p className="text-sm text-blue-100 font-medium tracking-wide uppercase">Express Send</p>
          <h2 className="text-4xl font-extrabold tracking-tight mt-1 text-white">
            {formatCurrency(data.amount)}
          </h2>
          <p className="text-xs text-blue-100/90 mt-1.5 flex items-center gap-1">
            <Check size={12} className="text-emerald-300" /> Transaction Successful
          </p>
        </div>
      </div>

      {/* Details Box Card */}
      <div className="px-6 -mt-6 flex-1">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-5 space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-400 uppercase font-mono tracking-wider border-b border-gray-100 pb-2">
            <span>Transaction Details</span>
            <span>Receipt</span>
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-sm">Sent To</span>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">{data.recipientName.toUpperCase()}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{maskAccount(data.recipientAccount, true)}</p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-sm">Sent From</span>
              <div className="text-right">
                <p className="font-semibold text-gray-800 text-sm">{data.senderName || 'My GCash Wallet'}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{maskAccount(data.senderAccount || '09******1234', true)}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-100 my-2 pt-2"></div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Amount Sent</span>
              <span className="font-bold text-gray-800">{formatCurrency(data.amount)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Transaction Fee</span>
              <span className="font-semibold text-gray-800">
                {data.fee > 0 ? formatCurrency(data.fee) : 'FREE'}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-600 font-medium">Total Deducted</span>
              <span className="font-extrabold text-[#005CE6] text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3.5 space-y-2.5">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar size={12} /> Date & Time</span>
              <span className="font-mono text-gray-600 font-medium">{formatCustomDate(data.dateTime)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-1"><Fingerprint size={12} /> Reference No.</span>
              <span className="font-mono font-bold text-gray-700 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[11px]">
                {data.referenceId || '901234567'}
              </span>
            </div>
          </div>

          {data.notes && (
            <div className="mt-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50 text-xs text-blue-800">
              <span className="font-semibold block mb-0.5">Message Note:</span>
              <p className="italic text-gray-600">"{data.notes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding section */}
      <div className="p-6 text-center border-t border-gray-50 bg-gray-50/80 rounded-b-3xl">
        <p className="text-[11px] text-gray-400 font-medium">
          This serves as your official receipt for the transaction.
        </p>
        <p className="text-[10px] text-blue-500/80 font-bold mt-1 tracking-wider uppercase">
          Thank you for using GCash
        </p>
      </div>
    </div>
  );

  const renderMayaReceipt = () => (
    <div className="h-full flex flex-col justify-between bg-[#111315] text-white">
      {/* Deep dark backdrop with energetic Maya neon/lime accents */}
      <div className="px-6 pt-10 pb-8 relative overflow-hidden">
        {/* Cyber Neon Glow elements */}
        <div className="absolute top-[-30%] right-[-20%] w-60 h-60 rounded-full bg-[#00E676]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-black tracking-tighter text-2xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              maya
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#00E676] bg-[#00E676]/10 border border-[#00E676]/20 px-2 py-0.5 rounded-md uppercase">
            COMPLETED
          </span>
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-14 h-14 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center mb-4">
            <div className="w-9 h-9 rounded-full bg-[#00E676] flex items-center justify-center">
              <Check className="text-[#111315] stroke-[3]" size={18} />
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Sent via Bank Transfer</p>
          <h2 className="text-4xl font-black mt-2 tracking-tight text-white font-sans">
            {formatCurrency(data.amount)}
          </h2>
          <span className="text-xs text-emerald-400 mt-1 font-mono">No. {data.referenceId.slice(0, 8).toUpperCase() || 'TX-8902'}</span>
        </div>
      </div>

      {/* Main transaction details box */}
      <div className="px-5 flex-1">
        <div className="bg-[#181C1E] border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center text-xs text-[#00E676] font-mono tracking-widest uppercase border-b border-gray-800 pb-2">
            <span>Transfer Info</span>
            <span>Maya Bank</span>
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-medium">To Bank/Wallet</span>
              <div className="text-right">
                <p className="font-bold text-white text-sm">
                  {BANK_CONFIGS[data.bank].name}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-medium">Recipient Name</span>
              <div className="text-right">
                <p className="font-semibold text-white text-sm">{data.recipientName.toUpperCase()}</p>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">{maskAccount(data.recipientAccount, false)}</p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-medium">From Wallet</span>
              <div className="text-right">
                <p className="font-medium text-gray-300 text-sm">{data.senderName || 'My Maya Account'}</p>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">{maskAccount(data.senderAccount || '09******4321', true)}</p>
              </div>
            </div>

            <div className="border-t border-gray-800/80 my-1"></div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Transfer Amount</span>
              <span className="font-semibold text-gray-200">{formatCurrency(data.amount)}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Service Fee</span>
              <span className="font-semibold text-gray-200">
                {data.fee > 0 ? formatCurrency(data.fee) : '₱0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm bg-black/40 p-2.5 rounded-xl border border-gray-800/50">
              <span className="text-gray-300 font-medium">Total Amount</span>
              <span className="font-extrabold text-[#00E676]">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="border-t border-gray-800/80 pt-3 space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date Completed</span>
              <span className="font-mono text-gray-300">{formatCustomDate(data.dateTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Reference No.</span>
              <span className="font-mono text-[#00E676] bg-[#00E676]/5 border border-[#00E676]/20 px-1.5 py-0.5 rounded text-[10px]">
                {data.referenceId || 'REF-2026-0708'}
              </span>
            </div>
          </div>

          {data.notes && (
            <div className="bg-black/30 border border-gray-800 p-2.5 rounded-xl text-[11px] text-gray-400">
              <span className="text-[#00E676] text-[10px] tracking-wider font-mono block uppercase mb-0.5">Note</span>
              "{data.notes}"
            </div>
          )}
        </div>
      </div>

      {/* Corporate disclaimer/support */}
      <div className="p-6 text-center bg-[#0D0F10] border-t border-gray-800/30 rounded-b-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 rounded-full border border-gray-800 text-[10px] text-gray-400">
          <ShieldCheck size={12} className="text-[#00E676]" /> Instapay instant transfer
        </div>
        <p className="text-[10px] text-gray-500 mt-2.5">
          Maya Philippines, Inc. is regulated by the Bangko Sentral ng Pilipinas.
        </p>
      </div>
    </div>
  );

  const renderGoTymeReceipt = () => (
    <div className="h-full flex flex-col justify-between bg-gray-50 text-[#1F2937]">
      {/* Modern, clean white bank card layout with bright colors */}
      <div className="bg-white border-b border-gray-100 px-6 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm relative overflow-hidden">
        {/* Abstract blue-green gradient accents */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#00BAC6]/10 blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {/* GoTyme stylized icon */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00BAC6] to-teal-600 flex items-center justify-center">
              <span className="text-white text-xs font-black font-sans">go</span>
            </div>
            <span className="font-sans font-black text-lg tracking-tight text-[#111827]">
              GoTyme <span className="font-medium text-[#00BAC6]">Bank</span>
            </span>
          </div>
          <div className="text-[10px] text-[#00BAC6] bg-[#00BAC6]/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Transfer Success
          </div>
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 rounded-full bg-[#00BAC6]/10 border border-[#00BAC6]/30 flex items-center justify-center mb-3">
            <Check className="text-[#00BAC6] stroke-[3]" size={20} />
          </div>
          <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">Amount Transferred</p>
          <h2 className="text-4xl font-black text-[#111827] mt-1 tracking-tight">
            {formatCurrency(data.amount)}
          </h2>
          <p className="text-[11px] text-gray-400 font-medium mt-1 font-mono">Reference: {data.referenceId}</p>
        </div>
      </div>

      {/* Details list card */}
      <div className="px-5 flex-1 mt-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase border-b border-gray-50 pb-2">
            Transfer Details
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-semibold">Recipient</span>
              <div className="text-right">
                <p className="font-bold text-gray-800">{data.recipientName.toUpperCase()}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{maskAccount(data.recipientAccount, false)}</p>
              </div>
            </div>

            <div className="flex justify-between items-start border-t border-gray-50 pt-2.5">
              <span className="text-gray-400 text-xs font-semibold">Sender</span>
              <div className="text-right">
                <p className="font-bold text-gray-800">{data.senderName || 'GoTyme Account'}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{maskAccount(data.senderAccount || '1920-3849-5012', false)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
              <span className="text-gray-400 text-xs font-semibold">Transaction Fee</span>
              <span className="font-semibold text-gray-800">{formatCurrency(data.fee)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
              <span className="text-gray-400 text-xs font-semibold">Total Deducted</span>
              <span className="font-extrabold text-[#00BAC6] text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Transfer Date</span>
              <span className="font-mono text-gray-700 font-medium">{formatCustomDate(data.dateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Channel</span>
              <span className="font-semibold text-gray-700">InstaPay Real-time</span>
            </div>
          </div>

          {data.notes && (
            <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl text-xs text-purple-900">
              <span className="font-bold block text-purple-700 mb-0.5">Reference Memo</span>
              <p className="italic text-gray-600">"{data.notes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* GoTyme dynamic card look footer */}
      <div className="p-6 text-center border-t border-gray-100 bg-white rounded-b-3xl">
        <p className="text-[10px] text-gray-400 font-semibold tracking-wide">
          GoTyme Bank is regulated by the Bangko Sentral ng Pilipinas.
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Deposits are insured by PDIC up to ₱500,000 per depositor.
        </p>
      </div>
    </div>
  );

  const renderMariBankReceipt = () => (
    <div className="h-full flex flex-col justify-between bg-emerald-50/20 text-[#004D40]">
      {/* Light digital shoppee marine-teal inspired design */}
      <div className="bg-gradient-to-b from-teal-700 to-teal-800 text-white px-6 pt-10 pb-10 rounded-b-[2rem] shadow-sm relative overflow-hidden">
        {/* Subtle orange dot pattern as branding details */}
        <div className="absolute top-[-20%] left-[-10%] w-40 h-40 rounded-full bg-[#FF5722]/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-inner">
              <span className="text-teal-800 text-base font-sans font-black tracking-tighter">M</span>
            </div>
            <span className="font-sans font-extrabold text-lg tracking-tight">MariBank</span>
          </div>
          <span className="text-[10px] bg-emerald-600 border border-emerald-500 text-emerald-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            INSTAPAY TRANSFER
          </span>
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="text-white stroke-[3]" size={16} />
            </div>
          </div>
          <p className="text-xs text-emerald-200 font-medium tracking-wide">Transfer Successful</p>
          <h2 className="text-4xl font-extrabold mt-1 text-white tracking-tight font-sans">
            {formatCurrency(data.amount)}
          </h2>
          <span className="text-[10px] text-emerald-200/80 font-mono mt-1">ID: {data.referenceId || 'TX-MB-90123'}</span>
        </div>
      </div>

      {/* Main receipt body */}
      <div className="px-5 flex-1 -mt-4">
        <div className="bg-white border border-emerald-100/40 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex justify-between items-center text-xs text-teal-800 font-bold border-b border-emerald-50 pb-2 uppercase tracking-wide">
            <span>Transaction Info</span>
            <span>Instant Fund Transfer</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-semibold">Recipient Name</span>
              <div className="text-right">
                <p className="font-bold text-teal-950">{data.recipientName.toUpperCase()}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{maskAccount(data.recipientAccount, false)}</p>
              </div>
            </div>

            <div className="flex justify-between items-start border-t border-emerald-50/50 pt-2">
              <span className="text-gray-400 text-xs font-semibold">Source Account</span>
              <div className="text-right">
                <p className="font-semibold text-teal-900">{data.senderName || 'Mari Savings'}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{maskAccount(data.senderAccount || '8901 2345 6789', false)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-emerald-50/50 pt-2">
              <span className="text-gray-400 text-xs font-semibold">Transaction Fee</span>
              <span className="font-semibold text-teal-900">
                {data.fee > 0 ? formatCurrency(data.fee) : 'FREE'}
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-emerald-50/50 pt-2 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/50">
              <span className="text-teal-950 font-bold text-xs">Total Transferred</span>
              <span className="font-black text-teal-800 text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="border-t border-emerald-50/50 pt-3 space-y-1.5 text-[11px] text-gray-500">
            <div className="flex justify-between">
              <span>Transfer Time</span>
              <span className="font-mono text-teal-900 font-medium">{formatCustomDate(data.dateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference Number</span>
              <span className="font-mono text-teal-900 font-semibold">{data.referenceId}</span>
            </div>
          </div>

          {data.notes && (
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs text-teal-950">
              <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider">Remarks</span>
              <p className="italic text-teal-900/80">"{data.notes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Shopee/Mari Bank regulation detail */}
      <div className="p-5 text-center bg-teal-50/50 border-t border-emerald-100/50 rounded-b-3xl">
        <p className="text-[10px] text-teal-800/60 font-semibold">
          MariBank Philippines Inc. is supervised by the BSP.
        </p>
        <p className="text-[10px] text-teal-800/50">
          Insured by PDIC up to ₱500,000.
        </p>
      </div>
    </div>
  );

  const renderChinaBankReceipt = () => (
    <div className="h-full flex flex-col justify-between bg-[#FCFBF8] text-[#334155] font-sans border-2 border-red-900/20 rounded-3xl">
      {/* Deep Red Classic Banking Corporate Style */}
      <div className="bg-[#8B0000] text-white px-6 pt-10 pb-8 rounded-b-xl shadow-sm relative border-b-4 border-yellow-500">
        <div className="absolute top-0 right-0 w-24 h-full bg-[#700000] skew-x-12 opacity-40 transform translate-x-10 pointer-events-none" />

        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-base tracking-wide uppercase">
              CHINABANK
            </span>
            <span className="text-[8px] font-sans tracking-widest text-yellow-400 uppercase">
              Established 1920
            </span>
          </div>
          <span className="text-[9px] bg-yellow-500/20 border border-yellow-500 text-yellow-300 font-bold px-2 py-0.5 rounded font-mono">
            SUCCESSFUL
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Fund Transfer Confirmation</p>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
            {formatCurrency(data.amount)}
          </h2>
          <p className="text-[9px] text-gray-300/90 mt-1 font-mono">ID: {data.referenceId || 'CBS-98127394'}</p>
        </div>
      </div>

      {/* Main formal table section */}
      <div className="px-5 flex-1 mt-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm font-sans">
          <div className="text-[11px] font-bold text-red-900 border-b border-gray-150 pb-2 uppercase tracking-wide">
            Transaction Summary
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-3 py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Beneficiary</span>
              <span className="col-span-2 text-right font-bold text-gray-800">{data.recipientName.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-3 py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Account No.</span>
              <span className="col-span-2 text-right font-mono text-gray-700 font-semibold">{maskAccount(data.recipientAccount, false)}</span>
            </div>

            <div className="grid grid-cols-3 py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Source Account</span>
              <span className="col-span-2 text-right font-medium text-gray-700">{data.senderName || 'Chinabank Account'}</span>
            </div>

            <div className="grid grid-cols-3 py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Transfer Fee</span>
              <span className="col-span-2 text-right text-gray-700 font-medium">{formatCurrency(data.fee)}</span>
            </div>

            <div className="grid grid-cols-3 py-1 border-b border-gray-50 bg-red-50/40 px-1.5 rounded">
              <span className="text-red-900 font-bold text-xs">Total Amount</span>
              <span className="col-span-2 text-right font-bold text-red-900 text-sm">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-100">
            <div className="flex justify-between">
              <span>Posting Date</span>
              <span className="font-mono text-gray-700 font-semibold">{formatCustomDate(data.dateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Channel Network</span>
              <span className="font-semibold text-gray-700">InstaPay (Realtime Transfer)</span>
            </div>
            <div className="flex justify-between">
              <span>Reference Number</span>
              <span className="font-mono text-gray-700 font-bold">{data.referenceId}</span>
            </div>
          </div>

          {data.notes && (
            <div className="bg-amber-50/50 border border-amber-100/60 p-2.5 rounded text-xs text-amber-900">
              <span className="font-bold text-amber-800 block text-[10px] uppercase">Transaction Remarks</span>
              <p className="italic text-gray-600">"{data.notes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Chinabank formal disclaimer */}
      <div className="p-5 text-center bg-[#F1EFEB] border-t border-gray-200 rounded-b-3xl text-gray-500">
        <p className="text-[9px] uppercase tracking-wider font-bold text-red-900">
          China Banking Corporation
        </p>
        <p className="text-[9px] mt-1 font-medium leading-relaxed">
          China Bank is regulated by the Bangko Sentral ng Pilipinas.
          <br />Member: PDIC. Maximum Deposit Insurance for each depositor is ₱500,000.
        </p>
      </div>
    </div>
  );

  const getTemplate = () => {
    switch (data.bank) {
      case 'gcash': return renderGCashReceipt();
      case 'maya': return renderMayaReceipt();
      case 'gotyme': return renderGoTymeReceipt();
      case 'maribank': return renderMariBankReceipt();
      case 'chinabank': return renderChinaBankReceipt();
      default: return renderGCashReceipt();
    }
  };

  return (
    <div className="relative select-none">
      {/* Decorative Floating Frame Rings to simulate a high-quality preview */}
      <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#1E293B]/20 rounded-tl-xl pointer-events-none" />
      <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#1E293B]/20 rounded-tr-xl pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#1E293B]/20 rounded-bl-xl pointer-events-none" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#1E293B]/20 rounded-br-xl pointer-events-none" />

      {/* Smartphone frame container */}
      <div 
        id="receipt-viewport-container"
        className="w-[370px] h-[780px] bg-[#0F172A] rounded-[40px] p-3 shadow-2xl border-4 border-[#334155]/60 flex flex-col relative"
      >
        {/* Dynamic camera punch-hole notch */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-[#0f172a] rounded-full z-40 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-950 mr-4" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/30" />
        </div>

        {/* Dynamic speaker ear notch */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full z-40 pointer-events-none" />

        {/* Inner viewport container */}
        <div 
          ref={receiptRef}
          id="receipt-capture-element"
          className="w-full h-full rounded-[30px] overflow-hidden bg-white shadow-inner flex flex-col relative"
        >
          {getTemplate()}

          {/* Premium Watermark */}
          {data.showWatermark && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 rotate-12 opacity-3 select-none">
              <div className="border-4 border-dashed border-gray-800 p-4 rounded-xl flex flex-col items-center">
                <span className="text-xl font-bold tracking-widest text-gray-900">TRANSACTION COPY</span>
                <span className="text-xs font-mono font-bold tracking-wider text-gray-700 mt-1">GENERATED WITH RECEIPT_PRO</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
