import React from 'react';
import { 
  BANK_CONFIGS, 
  BankEWallet, 
  ReceiptData 
} from '../types';
import { 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Plus, 
  Minus, 
  Calendar, 
  User, 
  Coins, 
  Hash, 
  ChevronRight, 
  FileCheck2,
  Info
} from 'lucide-react';

interface ReceiptFormProps {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
  onRandomize: () => void;
}

// Preset Philippine transaction scenarios for immediate playground immersion
const PRESETS = [
  {
    name: '🍱 Food Delivery Split',
    amount: 450,
    fee: 0,
    senderName: 'Jose Santos',
    senderAccount: '09171234567',
    recipientName: 'Maria Cruz',
    recipientAccount: '09189876543',
    notes: 'Share for lunch delivery (GrabFood)',
  },
  {
    name: '💸 Weekly Allowance',
    amount: 2500,
    fee: 15,
    senderName: 'Manuel Santos Sr.',
    senderAccount: 'XXXX-XXXX-9012',
    recipientName: 'Ana Santos',
    recipientAccount: '09228889999',
    notes: 'Study hard and take care!',
  },
  {
    name: '🏠 Monthly Rent Payment',
    amount: 8500,
    fee: 25,
    senderName: 'Kathryn Bernardo',
    senderAccount: 'XXXX-XXXX-4567',
    recipientName: 'Liza Soberano',
    recipientAccount: 'XXXX-XXXX-1234',
    notes: 'Rent Payment - Room 302',
  },
  {
    name: '🛍️ Shopee Purchase',
    amount: 1240,
    fee: 10,
    senderName: 'Daniel Padilla',
    senderAccount: '09154445555',
    recipientName: 'MariBank Seller',
    recipientAccount: '9012 3456 7890',
    notes: 'Payment for order #SHP-90218',
  }
];

export const ReceiptForm: React.FC<ReceiptFormProps> = ({ data, onChange, onRandomize }) => {
  
  const handleBankChange = (bank: BankEWallet) => {
    const config = BANK_CONFIGS[bank];
    onChange({
      ...data,
      bank,
      fee: config.defaultFee
    });
  };

  const handleInputChange = (field: keyof ReceiptData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleAmountAdjust = (diff: number) => {
    const nextVal = Math.max(0, Number(data.amount) + diff);
    handleInputChange('amount', nextVal);
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    // Select an appropriate bank based on preset logic or keep current
    onChange({
      ...data,
      amount: preset.amount,
      fee: preset.fee,
      senderName: preset.senderName,
      senderAccount: preset.senderAccount,
      recipientName: preset.recipientName,
      recipientAccount: preset.recipientAccount,
      notes: preset.notes,
      referenceId: generateMockRef(data.bank)
    });
  };

  const generateMockRef = (bank: BankEWallet) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = () => Math.floor(100000000 + Math.random() * 900000000).toString();
    switch (bank) {
      case 'gcash': return '9012' + Math.floor(100000 + Math.random() * 900000).toString();
      case 'maya': return 'M-' + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + '-' + num().slice(0, 4) + '-' + num().slice(4, 8);
      case 'gotyme': return 'GT-' + num();
      case 'maribank': return 'TRX-MB-' + num();
      case 'chinabank': return 'CBS-' + num();
    }
  };

  const setTimeToNow = () => {
    const now = new Date();
    // Adjust to local ISO string
    const tzoffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    handleInputChange('dateTime', localISOTime);
  };

  return (
    <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 space-y-6 shadow-2xl">
      {/* Step 1: Destination Selection */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e] text-black text-[11px] font-sans font-extrabold">1</span>
            Bank / E-Wallet Channel
          </label>
          <span className="text-xs text-slate-500">Choose destination</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(BANK_CONFIGS) as BankEWallet[]).map((bankKey) => {
            const cfg = BANK_CONFIGS[bankKey];
            const isSelected = data.bank === bankKey;
            return (
              <button
                key={bankKey}
                type="button"
                id={`btn-bank-${bankKey}`}
                onClick={() => handleBankChange(bankKey)}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[#22c55e] bg-[#22c55e]/15 text-white shadow-lg ring-1 ring-[#22c55e]' 
                    : 'border-white/10 bg-[#1e1e1e] hover:border-white/20 text-slate-300 hover:bg-[#252525]'
                }`}
              >
                {/* Brand specific mini accent bar */}
                <div 
                  className="absolute top-1 left-3 right-3 h-1 rounded-full" 
                  style={{ backgroundColor: cfg.primaryColor }}
                />

                <div className="mt-1 font-bold text-sm leading-tight tracking-tight">
                  {cfg.name}
                </div>
                <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-[#22c55e]' : 'text-slate-500'}`}>
                  {cfg.id === 'gcash' || cfg.id === 'maya' ? 'E-Wallet' : 'Bank'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Presets Carousel */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">⚡ Quick Playground Presets</span>
          <button 
            onClick={onRandomize}
            className="text-[#22c55e] hover:text-[#16a34a] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sparkles size={13} className="text-yellow-500 animate-pulse" /> Randomize All
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              type="button"
              id={`preset-${index}`}
              onClick={() => applyPreset(preset)}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl border border-white/5 bg-[#1e1e1e] hover:bg-[#252525] text-xs font-semibold text-slate-300 cursor-pointer transition-colors shrink-0"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Step 2: Financial Customization */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e] text-black text-[11px] font-sans font-extrabold">2</span>
          Transaction Pricing
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Principal Amount</span>
              <span className="text-xs font-semibold text-[#22c55e]">PHP ₱</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleAmountAdjust(-100)}
                className="px-3 py-2.5 border border-white/10 rounded-l-xl bg-[#1e1e1e] hover:bg-[#252525] text-slate-300 font-semibold cursor-pointer border-r-0"
              >
                -100
              </button>
              <input
                type="number"
                id="input-amount"
                value={data.amount || ''}
                onChange={(e) => handleInputChange('amount', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2 text-center border border-white/10 font-bold text-white text-lg focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a]"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={() => handleAmountAdjust(100)}
                className="px-3 py-2.5 border border-white/10 rounded-r-xl bg-[#1e1e1e] hover:bg-[#252525] text-slate-300 font-semibold cursor-pointer border-l-0"
              >
                +100
              </button>
            </div>
            {/* Quick buttons */}
            <div className="flex gap-1.5 justify-center">
              {[50, 500, 1000, 5000].map((presetAmt) => (
                <button
                  key={presetAmt}
                  type="button"
                  onClick={() => handleInputChange('amount', presetAmt)}
                  className="px-2.5 py-1 rounded-lg bg-[#1e1e1e] hover:bg-[#252525] text-slate-300 font-semibold text-[11px] border border-white/5 cursor-pointer"
                >
                  ₱{presetAmt}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Fee Field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Service Fee</span>
              <span className="text-xs text-[#22c55e] font-semibold font-sans">Custom Fee</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleInputChange('fee', Math.max(0, data.fee - 5))}
                className="px-3 py-2.5 border border-white/10 rounded-l-xl bg-[#1e1e1e] hover:bg-[#252525] text-slate-300 font-semibold cursor-pointer border-r-0"
              >
                -5
              </button>
              <input
                type="number"
                id="input-fee"
                value={data.fee || 0}
                onChange={(e) => handleInputChange('fee', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2 text-center border border-white/10 font-bold text-white text-lg focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a]"
                placeholder="0.00"
                min="0"
                step="1"
              />
              <button
                type="button"
                onClick={() => handleInputChange('fee', data.fee + 5)}
                className="px-3 py-2.5 border border-white/10 rounded-r-xl bg-[#1e1e1e] hover:bg-[#252525] text-slate-300 font-semibold cursor-pointer border-l-0"
              >
                +5
              </button>
            </div>
            {/* Fee Helpers */}
            <div className="flex gap-1.5 justify-center">
              {[0, 10, 15, 25].map((feePreset) => (
                <button
                  key={feePreset}
                  type="button"
                  onClick={() => handleInputChange('fee', feePreset)}
                  className="px-2 py-1 rounded-lg bg-[#1e1e1e] hover:bg-[#252525] text-slate-300 font-semibold text-[11px] border border-white/5 cursor-pointer"
                >
                  {feePreset === 0 ? 'Free' : `₱${feePreset}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Step 3: Parties Detail Info */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e] text-black text-[11px] font-sans font-extrabold">3</span>
          Account Profiles
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recipient Card Block */}
          <div className="p-4 bg-[#1e1e1e] rounded-2xl border border-white/10 space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-white/5 pb-1.5">
              📥 Beneficiary / Receiver
            </span>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <User size={13} />
                  </span>
                  <input
                    type="text"
                    id="input-recipient-name"
                    value={data.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white placeholder:text-slate-600"
                    placeholder="Enter Recipient Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Account / Mobile No.</label>
                <input
                  type="text"
                  id="input-recipient-account"
                  value={data.recipientAccount}
                  onChange={(e) => handleInputChange('recipientAccount', e.target.value)}
                  className="w-full px-3 py-1.5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white placeholder:text-slate-600"
                  placeholder={BANK_CONFIGS[data.bank].accountFormatPlaceholder}
                />
              </div>
            </div>
          </div>

          {/* Sender Card Block */}
          <div className="p-4 bg-[#1e1e1e] rounded-2xl border border-white/10 space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-white/5 pb-1.5">
              📤 Origin / Sender
            </span>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Full Name (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <User size={13} />
                  </span>
                  <input
                    type="text"
                    id="input-sender-name"
                    value={data.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white placeholder:text-slate-600"
                    placeholder="My Wallet Account"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Account No. (Optional)</label>
                <input
                  type="text"
                  id="input-sender-account"
                  value={data.senderAccount}
                  onChange={(e) => handleInputChange('senderAccount', e.target.value)}
                  className="w-full px-3 py-1.5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white placeholder:text-slate-600"
                  placeholder="09XX XXX XXXX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Step 4: System Fields & Customization */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e] text-black text-[11px] font-sans font-extrabold">4</span>
          Transaction Parameters
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reference ID input with dynamic regeneration */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase">Reference / Transaction ID</label>
              <button
                type="button"
                onClick={() => handleInputChange('referenceId', generateMockRef(data.bank))}
                className="text-[#22c55e] hover:text-[#16a34a] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Hash size={13} />
              </span>
              <input
                type="text"
                id="input-reference-id"
                value={data.referenceId}
                onChange={(e) => handleInputChange('referenceId', e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white placeholder:text-slate-600"
                placeholder={BANK_CONFIGS[data.bank].referenceFormatPlaceholder}
              />
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase">Transaction Timestamp</label>
              <button
                type="button"
                onClick={setTimeToNow}
                className="text-[#22c55e] hover:text-[#16a34a] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Calendar size={12} /> Set to Now
              </button>
            </div>
            <input
              type="datetime-local"
              id="input-datetime"
              value={data.dateTime}
              onChange={(e) => handleInputChange('dateTime', e.target.value)}
              className="w-full px-3 py-1.5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white"
            />
          </div>
        </div>

        {/* Message / Remarks note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase">Personal Message / Remarks Memo (Optional)</label>
          <textarea
            id="input-notes"
            value={data.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#22c55e] focus:border-[#22c55e] bg-[#1a1a1a] text-white placeholder:text-slate-600"
            placeholder="Add a message note (e.g. 'Coffee is on me!', 'Thanks for dinner!')"
          />
        </div>

        {/* Aesthetic toggles */}
        <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="checkbox-watermark"
              checked={data.showWatermark}
              onChange={(e) => handleInputChange('showWatermark', e.target.checked)}
              className="w-4 h-4 rounded text-[#22c55e] focus:ring-[#22c55e] border-white/10 accent-[#22c55e]"
            />
            <label htmlFor="checkbox-watermark" className="font-bold text-slate-300 cursor-pointer select-none">
              Apply Premium Security Watermark
            </label>
          </div>
          <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
            <Info size={11} /> Toggle overlay pattern
          </span>
        </div>
      </div>
    </div>
  );
};
