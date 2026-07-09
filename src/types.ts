export type BankEWallet = 'chinabank' | 'gotyme' | 'maya' | 'maribank' | 'gcash';

export interface ReceiptData {
  bank: BankEWallet;
  amount: number;
  fee: number;
  senderName: string;
  senderAccount: string;
  recipientName: string;
  recipientAccount: string;
  referenceId: string;
  dateTime: string;
  status: 'Success' | 'Pending' | 'Failed';
  notes: string;
  showWatermark: boolean;
  themeColor?: string;
}

export interface BankConfig {
  id: BankEWallet;
  name: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoBg: string;
  defaultFee: number;
  accountFormatPlaceholder: string;
  referenceFormatPlaceholder: string;
}

export const BANK_CONFIGS: Record<BankEWallet, BankConfig> = {
  gcash: {
    id: 'gcash',
    name: 'GCash',
    fullName: 'GCash (Mynt)',
    primaryColor: '#005CE6', // GCash blue
    secondaryColor: '#E6F0FF',
    textColor: '#1E293B',
    logoBg: '#005CE6',
    defaultFee: 0.00,
    accountFormatPlaceholder: '09XX XXX XXXX',
    referenceFormatPlaceholder: 'Ref No. 901234567'
  },
  maya: {
    id: 'maya',
    name: 'Maya',
    fullName: 'Maya Philippines',
    primaryColor: '#00E676', // Maya electric green / dark theme contrast
    secondaryColor: '#000000', // Maya uses dark green & black
    textColor: '#FFFFFF',
    logoBg: '#1A1D20',
    defaultFee: 15.00,
    accountFormatPlaceholder: '09XX XXX XXXX or Account No.',
    referenceFormatPlaceholder: 'Ref: XXXX-XXXX-XXXX-XXXX'
  },
  gotyme: {
    id: 'gotyme',
    name: 'GoTyme',
    fullName: 'GoTyme Bank',
    primaryColor: '#00BAC6', // Blue-green / turquoise branding
    secondaryColor: '#111827', // Dark backgrounds
    textColor: '#111827',
    logoBg: '#F3F4F6',
    defaultFee: 8.00,
    accountFormatPlaceholder: 'XXXX-XXXX-XXXX-XXXX',
    referenceFormatPlaceholder: 'Ref: GT-XXXXXXXXXX'
  },
  maribank: {
    id: 'maribank',
    name: 'MariBank',
    fullName: 'MariBank (Shopee)',
    primaryColor: '#FF5722', // Shopee orange / Seafoam green
    secondaryColor: '#E0F2F1', // Light seafoam
    textColor: '#004D40', // Deep green
    logoBg: '#FFFFFF',
    defaultFee: 10.00,
    accountFormatPlaceholder: 'XXXX XXXX XXXX',
    referenceFormatPlaceholder: 'TRX-MB-XXXXXXXXX'
  },
  chinabank: {
    id: 'chinabank',
    name: 'Chinabank',
    fullName: 'China Banking Corporation',
    primaryColor: '#8B0000', // Deep red / crimson
    secondaryColor: '#FEF2F2',
    textColor: '#1E293B',
    logoBg: '#8B0000',
    defaultFee: 25.00,
    accountFormatPlaceholder: 'XXXX-XXXX-XXXX',
    referenceFormatPlaceholder: 'CBS-XXXXXXXXXXXX'
  }
};
