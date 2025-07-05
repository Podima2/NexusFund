import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  chainId: number | null;
}

export const useWallet = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout, 
    connectWallet,
    linkWallet 
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    chainId: null,
  });

  // Get the primary wallet (first connected wallet)
  const primaryWallet = wallets.length > 0 ? wallets[0] : null;

  useEffect(() => {
    if (!ready) {
      setWalletState(prev => ({ ...prev, isConnecting: true }));
      return;
    }

    if (authenticated && primaryWallet) {
      setWalletState({
        address: primaryWallet.address,
        balance: '0', // We'll fetch this separately if needed
        isConnected: true,
        isConnecting: false,
        error: null,
        chainId: primaryWallet.chainId ? parseInt(primaryWallet.chainId) : null,
      });
    } else {
      setWalletState({
        address: null,
        balance: null,
        isConnected: false,
        isConnecting: false,
        error: null,
        chainId: null,
      });
    }
  }, [ready, authenticated, primaryWallet]);

  const connectWalletHandler = async () => {
    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      if (!authenticated) {
        // If user is not authenticated, trigger login
        await login();
      } else {
        // If user is authenticated but no wallet, connect/link wallet
        await connectWallet();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = async () => {
    try {
      await logout();
      setWalletState({
        address: null,
        balance: null,
        isConnected: false,
        isConnecting: false,
        error: null,
        chainId: null,
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to disconnect',
      }));
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  const switchChain = async (chainId: number) => {
    if (primaryWallet && 'switchChain' in primaryWallet) {
      try {
        await primaryWallet.switchChain(chainId);
      } catch (error) {
        console.error('Failed to switch chain:', error);
        setWalletState(prev => ({
          ...prev,
          error: 'Failed to switch chain',
        }));
      }
    }
  };

  return {
    // Wallet state
    address: walletState.address,
    balance: walletState.balance,
    isConnected: walletState.isConnected,
    isConnecting: walletState.isConnecting,
    error: walletState.error,
    chainId: walletState.chainId,
    
    // Privy state
    ready,
    authenticated,
    user,
    
    // Wallet actions
    connectWallet: connectWalletHandler,
    disconnectWallet,
    switchChain,
    
    // Utility functions
    formatAddress,
    formatBalance,
    
    // Additional Privy features
    linkWallet,
    wallets,
    primaryWallet,
  };
};