import React, { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Campaign } from '../../types';
import { useNexusSDK } from '../../hooks/useNexusSDK';
import { stablecoins} from '../../data/chainConfig';
import { useWallet } from '../../hooks/useWallet';

interface PledgeFormProps {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}

export const PledgeForm: React.FC<PledgeFormProps> = ({ campaign, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(campaign.currency);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'bridging' | 'success' | 'error'>('form');
  const [txId, setTxId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { bridgeAndPledge, isInitialized, initializeSDK } = useNexusSDK();
  const { isConnected } = useWallet();
  
  useEffect(() => {
    if (!isInitialized) {
      initializeSDK();
      // console.log('Nexus SDK is still initializing. Please wait.');
    }
  }, [isConnected, isInitialized, initializeSDK]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !isInitialized) return;

    setIsLoading(true);
    setStep('bridging');
    setError('');

    try {
      const pledgeAmount = amount;
      const transactionId = await bridgeAndPledge(
        campaign.id,
        pledgeAmount,
      );

      setTxId(transactionId as string);

      // Immediately show success (no polling)
      setStep('success');
      setIsLoading(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err) {
      setStep('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  if (step === 'bridging') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Processing Your Pledge</h3>
            <p className="text-neutral-400">
              Bridging  
            </p>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-neutral-300">Initiating cross-chain bridge...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
              <span className="text-neutral-500">Executing pledge on target chain...</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
              <span className="text-neutral-500">Confirming transaction...</span>
            </div>
          </div>

          {txId && (
            <div className="mt-6 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div className="text-xs text-neutral-400 mb-1">Transaction ID</div>
              <div className="font-mono text-xs text-neutral-300 break-all">{txId}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Pledge Successful! 🎉</h3>
          <p className="text-neutral-400 mb-6">
            Your pledge of {amount} {selectedCurrency} has been successfully processed and added to the campaign.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Pledge Failed</h3>
          <p className="text-neutral-400 mb-6">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-lg w-full animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Back This Campaign</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">
              Pledge Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white text-xl font-bold placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 font-semibold">
                {selectedCurrency}
              </div>
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-3">
              Currency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {stablecoins.map(coin => (
                <button
                  key={coin.symbol}
                  type="button"
                  onClick={() => setSelectedCurrency(coin.symbol)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedCurrency === coin.symbol
                      ? 'bg-blue-900 border-blue-700 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{coin.icon}</div>
                  <div className="font-semibold text-sm">{coin.symbol}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) <= 0 || isLoading || !isInitialized}
            className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>
                  {!isInitialized ? 'Initializing Nexus' : `Pledge ${amount ? formatAmount(parseFloat(amount)) : '$0'}`}
                </span>
                {/* <ArrowRight className="w-5 h-5" /> */}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};