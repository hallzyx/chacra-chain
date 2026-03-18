/**
 * Wallet-related types for PayLite.
 */

export interface WalletState {
  accountId: string;
  balance: number;
  isLoading: boolean;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

export interface SendFormData {
  toAddress: string;
  amount: number;
}
