/**
 * WalletConnect Component
 * UI component for connecting/disconnecting Stellar wallet
 */

'use client';

import { useStellarWallet } from '@/hooks/useStellarWallet';

export default function WalletConnect() {
  const {
    walletInfo,
    isLoading,
    error,
    balance,
    isAvailable,
    connect,
    disconnect,
  } = useStellarWallet();

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isAvailable) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="https://freighter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Install Freighter
        </a>
      </div>
    );
  }

  if (!walletInfo.isConnected) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={connect}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-600">
          {formatAddress(walletInfo.publicKey)}
        </span>
        <span className="text-xs text-gray-500">
          Balance: {Number.parseFloat(balance).toFixed(4)} XLM
        </span>
        <span className="text-xs text-gray-400">
          {walletInfo.network}
        </span>
      </div>
      <button
        type="button"
        onClick={disconnect}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Disconnecting...' : 'Disconnect'}
      </button>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}
