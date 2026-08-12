/**
 * React hook for Stellar wallet integration
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { stellarWallet, WalletInfo, TransactionResult } from '@/lib/stellar/wallet';

export function useStellarWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    publicKey: '',
    isConnected: false,
    network: 'testnet',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  // Check wallet availability on mount
  useEffect(() => {
    const available = stellarWallet.isAvailable();
    if (!available) {
      setError('Freighter wallet is not installed');
    }
  }, []);

  // Update wallet info when connection state changes
  const updateWalletInfo = useCallback(() => {
    const info = stellarWallet.getWalletInfo();
    setWalletInfo(info);
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await stellarWallet.connect();
      setWalletInfo(info);
      
      // Fetch balance after connection
      const bal = await stellarWallet.getBalance();
      setBalance(bal);
      
      return info;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    stellarWallet.disconnect();
    setWalletInfo({
      publicKey: '',
      isConnected: false,
      network: 'testnet',
    });
    setBalance('0');
    setError(null);
  }, []);

  // Sign transaction
  const signTransaction = useCallback(async (xdr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await stellarWallet.signTransaction(xdr);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign transaction';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign and submit transaction
  const signAndSubmitTransaction = useCallback(async (xdr: string): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await stellarWallet.signAndSubmitTransaction(xdr);
      
      if (result.status === 'error') {
        setError(result.error || 'Transaction failed');
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!walletInfo.isConnected) return;

    try {
      const bal = await stellarWallet.getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [walletInfo.isConnected]);

  // Switch network
  const switchNetwork = useCallback(async (network: 'testnet' | 'public') => {
    setIsLoading(true);
    setError(null);

    try {
      await stellarWallet.switchNetwork(network);
      updateWalletInfo();
      
      // Refresh balance after network switch
      await refreshBalance();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to switch network';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateWalletInfo, refreshBalance]);

  return {
    walletInfo,
    isLoading,
    error,
    balance,
    isAvailable: stellarWallet.isAvailable(),
    connect,
    disconnect,
    signTransaction,
    signAndSubmitTransaction,
    refreshBalance,
    switchNetwork,
  };
}
