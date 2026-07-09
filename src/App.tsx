import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  FileCheck2,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  Settings,
  Share2
} from 'lucide-react';
import { ReceiptData, BANK_CONFIGS, BankEWallet } from './types';
import { ReceiptPreview } from './components/ReceiptPreview';
import { ReceiptForm } from './components/ReceiptForm';

// Extensive pool of authentic Filipino names for randomization delight
const FIRST_NAMES = [
  'Jose', 'Maria', 'Juan', 'Ana', 'Andres', 'Corazon', 'Manuel', 'Benigno', 
  'Sarah', 'Leni', 'Carlos', 'Manny', 'Lea', 'Catriona', 'Pia', 'Hidilyn', 
  'Isabela', 'Grace', 'Antonio', 'Rodrigo', 'Ferdinand', 'Bongbong', 'Fidel',
  'Joseph', 'Gloria', 'Francisco', 'Gregorio', 'Apolinario', 'Emilio'
];

const LAST_NAMES = [
  'Cruz', 'Santos', 'Reyes', 'Diaz', 'Ramos', 'Mendoza', 'Garcia', 'Torres', 
  'Aquino', 'Marcos', 'Duterte', 'Robredo', 'Pacquiao', 'Sotto', 'Villar', 
  'Pangilinan', 'Bernardo', 'Soberano', 'Gil', 'Reid', 'Lustre', 'Padilla',
  'Salonga', 'Gray', 'Wurtzbach', 'Yulo', 'Del Rosario', 'Bautista', 'Gonzales'
];

const MOCK_NOTES = [
  'Share for GrabFood group order! 🍔',
  'Salamat sa pagpahiram ng pera kahapon!',
  'Rent contribution for July 2026 🏠',
  'Weekly allowance - galingan mo mag-aral! 📚',
  'Payment for custom knitted sweater 🧶',
  'Share for coffee and pastries yesterday ☕',
  'GCash G-Forest contribution 🌳',
  'Happy Birthday! Treat yourself 🎂🎉',
  'Payment for online checkout items 🛍️',
  'Lunch split bill - Samgyupsal 🥩',
  'Refund for excess payment',
  'Settle utility bills share ⚡'
];

export default function App() {
  // Setup dynamic, elegant defaults
  const [data, setData] = useState<ReceiptData>({
    bank: 'gcash',
    amount: 1500,
    fee: 0,
    senderName: 'Jose Rizal',
    senderAccount: '0917 123 4567',
    recipientName: 'Maria Clara',
    recipientAccount: '0918 987 6543',
    referenceId: '901238475',
    dateTime: '2026-07-08T19:20:15',
    status: 'Success',
    notes: 'Share for lunch split 🍱',
    showWatermark: false
  });

  const [activeTab, setActiveTab] = useState<'customize' | 'preview'>('customize');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  // Trigger transient screen notification toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Pre-seed reference ID on initial mount
  useEffect(() => {
    handleRegenerateRef();
  }, []);

  // Sync fee when bank changes if fee hasn't been edited manually
  const handleFormChange = (updatedData: ReceiptData) => {
    setData(updatedData);
  };

  // Generate extremely realistic reference number based on bank standard conventions
  const generateMockRef = (bank: BankEWallet) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = () => Math.floor(100000000 + Math.random() * 900000000).toString();
    switch (bank) {
      case 'gcash': 
        return '9012' + Math.floor(100000 + Math.random() * 900000).toString();
      case 'maya': 
        return 'M-' + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + '-' + num().slice(0, 4) + '-' + num().slice(4, 8);
      case 'gotyme': 
        return 'GT-' + num();
      case 'maribank': 
        return 'TRX-MB-' + num();
      case 'chinabank': 
        return 'CBS-' + num();
      default:
        return 'REF-' + num();
    }
  };

  const handleRegenerateRef = () => {
    setData(prev => ({
      ...prev,
      referenceId: generateMockRef(prev.bank)
    }));
  };

  // High-fidelity randomizer that creates highly cohesive mock payments
  const handleRandomizeAll = () => {
    const randomBankKeys: BankEWallet[] = ['gcash', 'maya', 'gotyme', 'maribank', 'chinabank'];
    const randomBank = randomBankKeys[Math.floor(Math.random() * randomBankKeys.length)];
    const config = BANK_CONFIGS[randomBank];

    const randomSenderFirst = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const randomSenderLast = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const randomRecipFirst = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const randomRecipLast = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    const senderFullName = `${randomSenderFirst} ${randomSenderLast}`;
    const recipFullName = `${randomRecipFirst} ${randomRecipLast}`;

    // Randomize amount with logical visual increments
    const amtPresets = [150, 280, 500, 1000, 1250, 2400, 3500, 5000, 8500, 12000];
    const randomAmt = amtPresets[Math.floor(Math.random() * amtPresets.length)];

    // Produce realistic account formats
    const randomPhone = () => {
      const prefixes = ['0917', '0918', '0922', '0915', '0995'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();
      return `${prefix} ${suffix.slice(0, 3)} ${suffix.slice(3)}`;
    };

    const randomBankAcc = () => {
      return Math.floor(1000 + Math.random() * 9000).toString() + '-' +
             Math.floor(1000 + Math.random() * 9000).toString() + '-' +
             Math.floor(1000 + Math.random() * 9000).toString();
    };

    const senderAcc = randomBank === 'gcash' || randomBank === 'maya' ? randomPhone() : randomBankAcc();
    const recipAcc = randomBank === 'gcash' || randomBank === 'maya' ? randomPhone() : randomBankAcc();

    // Date generation (last 7 days randomizer for variety)
    const now = new Date();
    const pastDays = Math.floor(Math.random() * 5);
    now.setDate(now.getDate() - pastDays);
    now.setHours(Math.floor(Math.random() * 12) + 8);
    now.setMinutes(Math.floor(Math.random() * 60));
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISO = (new Date(now.getTime() - tzoffset)).toISOString().slice(0, 16);

    const randomNote = MOCK_NOTES[Math.floor(Math.random() * MOCK_NOTES.length)];

    setData({
      bank: randomBank,
      amount: randomAmt,
      fee: config.defaultFee,
      senderName: senderFullName,
      senderAccount: senderAcc,
      recipientName: recipFullName,
      recipientAccount: recipAcc,
      referenceId: generateMockRef(randomBank),
      dateTime: localISO,
      status: 'Success',
      notes: randomNote,
      showWatermark: data.showWatermark
    });

    triggerToast('🎲 Receipt randomized with organic Filipino profiles!');
  };

  // Main capture and download routine using html2canvas
  const downloadReceiptImage = async () => {
    if (!receiptRef.current) {
      triggerToast('⚠️ Receipt preview target not found.');
      return;
    }

    setIsDownloading(true);
    triggerToast('📷 Processing high-resolution canvas capture...');

    try {
      // Small pause to guarantee absolute latest DOM bindings are flushed
      await new Promise(resolve => setTimeout(resolve, 300));

      const captureElement = receiptRef.current;

      // Configurations designed to capture perfect pixel-perfect renders
      const canvas = await html2canvas(captureElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        scale: 3, // Multiplies the scale by 3x for pristine, sharp high-DPI vector-like quality
        logging: false,
        width: captureElement.scrollWidth,
        height: captureElement.scrollHeight,
        windowWidth: captureElement.scrollWidth,
        windowHeight: captureElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Adjust any elements in cloned doc if required before taking the picture
          const target = clonedDoc.getElementById('receipt-capture-element');
          if (target) {
            target.style.borderRadius = '0px'; // Temporarily make it square for standard export if desired
          }
        }
      });

      // Export canvas to downloadable data URL link
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const downloadLink = document.createElement('a');
      
      const fileName = `Receipt-${data.bank.toUpperCase()}-${data.referenceId || 'TX'}.png`;
      downloadLink.download = fileName;
      downloadLink.href = dataUrl;
      
      // Execute document download trigger
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      triggerToast('🎉 Receipt image downloaded to your device successfully!');
    } catch (error) {
      console.error('Image capture error: ', error);
      triggerToast('❌ Capturing receipt failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased relative selection:bg-[#22c55e] selection:text-black pb-12">
      {/* Decorative ambient subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-55 pointer-events-none" />

      {/* App Header Section */}
      <header className="max-w-7xl mx-auto px-4 pt-8 pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter bg-[#141414] border border-white/15 text-white px-3 py-1 rounded-xl shadow-md">
                RECEIPT<span className="text-[#22c55e]">.PRO</span>
              </span>
              <span className="bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} className="stroke-[3]" /> INSTAPAY SYNCED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Create and export portrait, smartphone-sized transactional slips for Philippine finance platforms.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRandomizeAll}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-white/10 rounded-xl text-xs font-bold text-slate-200 shadow-sm transition-all cursor-pointer hover:shadow"
            >
              <Sparkles size={14} className="text-amber-500 animate-pulse" /> Randomize Profile
            </button>
            <button
              onClick={downloadReceiptImage}
              disabled={isDownloading}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer ${
                isDownloading 
                  ? 'bg-[#1a1a1a] text-slate-500 cursor-not-allowed' 
                  : 'bg-[#22c55e] hover:bg-[#16a34a] text-black hover:shadow-lg'
              }`}
            >
              {isDownloading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Rendering...
                </>
              ) : (
                <>
                  <Download size={14} /> Download Receipt
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 mt-6 relative z-10">
        
        {/* Mobile Viewport Toggle Header (Shown on mobile only) */}
        <div className="block md:hidden mb-6">
          <div className="flex bg-[#141414] rounded-2xl p-1.5 border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                activeTab === 'customize' 
                  ? 'bg-[#22c55e] text-black shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📝 1. Customize Details
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                activeTab === 'preview' 
                  ? 'bg-[#22c55e] text-black shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📱 2. View Smartphone Slip
            </button>
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Customization Form Grid Column */}
          <div className={`md:col-span-7 space-y-6 ${activeTab === 'customize' ? 'block' : 'hidden md:block'}`}>
            <ReceiptForm 
              data={data} 
              onChange={handleFormChange}
              onRandomize={handleRandomizeAll}
            />

            {/* Inline safe security banner */}
            <div className="bg-[#141414] border border-white/10 text-slate-100 rounded-3xl p-5 space-y-3 shadow-inner relative overflow-hidden animate-pulse">
              <div className="absolute top-0 right-0 w-32 h-full bg-[#1e1e1e] skew-x-12 opacity-50 transform translate-x-10 pointer-events-none" />
              <div className="flex gap-3 items-start relative z-10">
                <div className="bg-[#22c55e]/20 text-[#22c55e] p-2 rounded-xl mt-0.5 shrink-0">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-white">100% Secure & Local</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Your entries are processed locally on your browser. No financial data or names are sent to any server. Images are rendered using clientside vector mapping.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Mobile Live Preview Grid Column */}
          <div className={`md:col-span-5 flex flex-col items-center space-y-6 ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
            
            {/* Centered Device */}
            <div className="relative">
              <ReceiptPreview data={data} receiptRef={receiptRef} />
            </div>

            {/* Bottom Actions under smartphone slip */}
            <div className="w-full max-w-[370px] bg-[#141414] border border-white/10 rounded-3xl p-5 space-y-4 shadow-sm text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Export Settings (Png, DPI-3x)
                </span>
                <h3 className="text-sm font-extrabold text-slate-200 mt-0.5">Ready for Device Download</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-400">
                <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-slate-500">Dimensions</span>
                  <span className="font-bold text-[#22c55e] mt-0.5 block font-mono">1110 × 2340 px</span>
                </div>
                <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-slate-500">Format</span>
                  <span className="font-bold text-[#22c55e] mt-0.5 block font-mono">Lossless PNG</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-download-primary"
                onClick={downloadReceiptImage}
                disabled={isDownloading}
                className={`w-full py-3 rounded-2xl font-extrabold text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDownloading
                    ? 'bg-[#1a1a1a] text-slate-500 cursor-not-allowed'
                    : 'bg-[#22c55e] hover:bg-[#16a34a] text-black hover:shadow-md'
                }`}
              >
                {isDownloading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Compiling High-Res Image...
                  </>
                ) : (
                  <>
                    <Download size={16} /> Save Receipt to Gallery
                  </>
                )}
              </button>

              <div className="flex justify-center items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Info size={12} />
                <span>Supports iOS, Android, and Desktop saves</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Active Alerts/Toasts container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            id="toast-notification"
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#141414] border border-white/10 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 max-w-sm text-xs font-semibold"
          >
            <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-black shrink-0">
              <CheckCircle2 size={13} className="stroke-[3]" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

