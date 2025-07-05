import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Plus, Settings, Shield } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

export const WalletButton: React.FC = () => {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet, 
    formatAddress,
    user,
    chainId,
    wallets,
    linkWallet,
    switchChain
  } = useWallet();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openBlockExplorer = () => {
    if (address && chainId) {
      const explorers = {
        1: 'https://etherscan.io',
        137: 'https://polygonscan.com',
        42161: 'https://arbiscan.io',
        10: 'https://optimistic.etherscan.io',
        8453: 'https://basescan.org',
      };
      const baseUrl = explorers[chainId as keyof typeof explorers] || 'https://etherscan.io';
      window.open(`${baseUrl}/address/${address}`, '_blank');
    }
  };

  const getChainName = (chainId: number) => {
    const chains = {
      1: 'Ethereum',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
      8453: 'Base',
    };
    return chains[chainId as keyof typeof chains] || `Chain ${chainId}`;
  };

  const getLoginMethod = () => {
    if (!user) return null;
    
    if (user.email) return { type: 'email', value: user.email.address };
    if (user.phone) return { type: 'phone', value: user.phone.number };
    if (user.google) return { type: 'google', value: user.google.email };
    if (user.twitter) return { type: 'twitter', value: user.twitter.username };
    if (user.discord) return { type: 'discord', value: user.discord.username };
    if (user.wallet) return { type: 'wallet', value: 'External Wallet' };
    
    return null;
  };

  const loginMethod = getLoginMethod();

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 disabled:from-neutral-900 disabled:to-neutral-900 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-neutral-500/10 disabled:cursor-not-allowed disabled:hover:scale-100 tracking-wide text-sm"
        >
          <Wallet className="w-4 h-4" />
          <span>
            {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
          </span>
        </button>
        
        {error && (
          <div className="absolute top-full mt-2 right-0 bg-red-950 border border-red-800 text-red-300 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-50 animate-scale-in">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm font-semibold tracking-wide"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Wallet className="w-4 h-4" />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-left">
            <div className="font-semibold">
              {address ? formatAddress(address) : 'Connected'}
            </div>
            {/* <div className="text-xs text-neutral-400 font-medium -mt-0.5">
              {chainId ? getChainName(chainId) : 'Unknown Chain'}
            </div> */}
          </div>
          
          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-neutral-950 border border-neutral-800 rounded-xl p-2 min-w-[280px] z-50 animate-scale-in shadow-xl">
          {/* User Info Section */}
          <div className="px-3 py-3 border-b border-neutral-800 mb-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-neutral-300" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Connected Account</div>
                {loginMethod && (
                  <div className="text-xs text-neutral-400 capitalize">
                    via {loginMethod.type} • {loginMethod.type === 'email' || loginMethod.type === 'phone' ? 
                      loginMethod.value : loginMethod.type}
                  </div>
                )}
              </div>
            </div>
            
            {address && (
              <div className="space-y-2">
                <div className="text-xs text-neutral-400 font-medium">Primary Wallet</div>
                <div className="text-xs text-neutral-300 font-mono break-all bg-neutral-900 p-2 rounded-lg">
                  {address}
                </div>
                <div className="text-xs text-neutral-400">
                  Network: {chainId ? getChainName(chainId) : 'Unknown'}
                </div>
              </div>
            )}
          </div>
          
          {/* Wallet Management */}
          <div className="space-y-1 mb-2">
            <div className="px-3 py-1">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Wallet Actions
              </div>
            </div>
            
            {address && (
              <>
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>
                
                <button
                  onClick={openBlockExplorer}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </button>
              </>
            )}
            
            <button
              onClick={linkWallet}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Link Another Wallet</span>
            </button>
          </div>

          {/* Connected Wallets */}
          {wallets.length > 1 && (
            <div className="space-y-1 mb-2">
              <div className="px-3 py-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Connected Wallets ({wallets.length})
                </div>
              </div>
              
              {wallets.slice(0, 3).map((wallet, index) => (
                <div
                  key={wallet.address}
                  className="px-3 py-2 text-xs text-neutral-400 bg-neutral-900 rounded-lg mx-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono">{formatAddress(wallet.address)}</span>
                    <span className="capitalize">{wallet.walletClientType}</span>
                  </div>
                </div>
              ))}
              
              {wallets.length > 3 && (
                <div className="px-3 py-1 text-xs text-neutral-500 text-center">
                  +{wallets.length - 3} more wallets
                </div>
              )}
            </div>
          )}

          {/* Chain Switching */}
          {chainId && (
            <div className="space-y-1 mb-2">
              <div className="px-3 py-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Switch Network
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-1 px-2">
                {[
                  { id: 1, name: 'Ethereum', icon: '🔷' },
                  { id: 137, name: 'Polygon', icon: '🟣' },
                  { id: 42161, name: 'Arbitrum', icon: '🔵' },
                  { id: 10, name: 'Optimism', icon: '🔴' },
                ].map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => switchChain(chain.id)}
                    className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-lg transition-colors font-medium ${
                      chainId === chain.id
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>{chain.icon}</span>
                    <span>{chain.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t border-neutral-800 my-1"></div>
          
          {/* Disconnect */}
          <button
            onClick={() => {
              disconnectWallet();
              setShowDropdown(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};