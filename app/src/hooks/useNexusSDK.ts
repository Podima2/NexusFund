import { useState, useCallback } from 'react';
import { useWallet } from './useWallet';
import { NexusSDK, TESTNET_TOKEN_METADATA } from '@avail-project/nexus';
import { Abi } from 'viem';
import type { SUPPORTED_TOKENS, SUPPORTED_CHAINS_IDS, NexusNetwork, BridgeAndExecuteParams, BridgeAndExecuteResult, ExecuteParams } from "@avail-project/nexus";


interface UnifiedBalance {
  chainId: number;
  chainName: string;
  balances: {
    [token: string]: {
      balance: string;
      decimals: number;
      symbol: string;
      usdValue?: number;
    };
  };
}

interface NexusSDKState {
  sdk: NexusSDK | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  unifiedBalances: UnifiedBalance[];
  isLoadingBalances: boolean;
}

export const useNexusSDK = () => {
  const { primaryWallet, isConnected } = useWallet();
  const [state, setState] = useState<NexusSDKState>({
    sdk: null,
    isInitialized: false,
    isInitializing: false,  
    error: null,
    unifiedBalances: [],
    isLoadingBalances: false,
  });

  // Initialize SDK when wallet is connected
  const initializeSDK = useCallback(async () => {
    if (!primaryWallet || !isConnected || state.isInitializing) return;

    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      console.log('🔄 Initializing Nexus SDK...');
      
      // Create SDK instance with testnet configuration
      const sdk = new NexusSDK({
        network: 'testnet', // Use testnet for development
      });

      // Get the provider from Privy wallet
      const provider = await primaryWallet.getEthereumProvider(); 
      
      // Initialize SDK with the provider
      await sdk.initialize(provider);

      setState(prev => ({
        ...prev,
        sdk,
        isInitialized: true,
        isInitializing: false,
        error: null,
      }));

      console.log('✅ Nexus SDK initialized successfully');
      const balances = await sdk.getUnifiedBalances();
      console.log('All balances:', balances);

    } catch (error) {
      console.error('❌ Failed to initialize Nexus SDK:', error);
      setState(prev => ({
        ...prev,
        sdk: null,
        isInitialized: false,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Failed to initialize SDK',
      }));
    }
  }, [primaryWallet, isConnected, state.isInitializing]);

  // Load unified balances across all chains
  const loadUnifiedBalances = useCallback(async () => {
    if (!state.sdk || !state.isInitialized) return;

    setState(prev => ({ ...prev, isLoadingBalances: true }));

    try {
      console.log('🔄 Loading unified balances...');
      
      // Get unified balances from all supported chains
      const balances = await state.sdk.getUnifiedBalances();
      console.log('🔄 Balances:', balances);
      
      // Transform the data to our format (array of tokens with breakdowns)
      const chainMap: { [chainId: number]: UnifiedBalance } = {};
      balances.forEach((token: any) => {
        token.breakdown.forEach((entry: any) => {
          const chainId = entry.chain.id;
          if (!chainMap[chainId]) {
            chainMap[chainId] = {
              chainId,
              chainName: entry.chain.name,
              balances: {},
            };
          }
          chainMap[chainId].balances[token.symbol] = {
            balance: entry.balance,
            decimals: entry.decimals,
            symbol: token.symbol,
            usdValue: entry.balanceInFiat,
          };
        });
      });
      const unifiedBalances: UnifiedBalance[] = Object.values(chainMap);

      setState(prev => ({
        ...prev,
        unifiedBalances,
        isLoadingBalances: false,
      }));

      console.log('✅ Unified balances loaded:', unifiedBalances);
    } catch (error) {
      console.error('❌ Failed to load unified balances:', error);
      setState(prev => ({
        ...prev,
        isLoadingBalances: false,
        error: error instanceof Error ? error.message : 'Failed to load balances',
      }));
    }
  }, [state.sdk, state.isInitialized]);

  // Bridge and pledge implementation
  
  const bridgeAndPledge = useCallback(
    async (
      campaignId: string | number,
      pledgeAmount: string,
    ) => {
      if (!state.sdk || !state.isInitialized) throw new Error('Nexus SDK not initialized');

      // Convert amount to USDC base units (6 decimals)
      const amountInSmallestUnit = BigInt(parseFloat(pledgeAmount) * 10 ** TESTNET_TOKEN_METADATA["USDC"].decimals).toString();
      console.log(amountInSmallestUnit, 'amountInSmallestUnit');
      console.log(BigInt(campaignId).toString(), 'campaignId');

      const contractAbi : Abi = [
        {
          inputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" }
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ];
      console.log(campaignId, pledgeAmount, 'campaignId, amount');

      const result: BridgeAndExecuteResult = await state.sdk.bridgeAndExecute({
        token: 'USDC',
        amount: amountInSmallestUnit,
        toChainId: 84532,
        execute: {
          contractAddress: "0x4951992d46fa57c50Cb7FcC9137193BE639A9bEE",
          contractAbi: contractAbi,
          functionName: 'deposit',
          functionParams: [campaignId, amountInSmallestUnit],
          tokenApproval: {
            token: 'USDC',
            amount: amountInSmallestUnit
          },
        },
        waitForReceipt: true, 
        requiredConfirmations: 3,
      } as BridgeAndExecuteParams);

      console.log('result', result);
      // Return transaction hash or result
      return result.executeTransactionHash || result.executeExplorerUrl || result;
    },
    [state.sdk, state.isInitialized]
  );

  return {
    // SDK state
    sdk: state.sdk,
    isInitialized: state.isInitialized,
    isInitializing: state.isInitializing,
    error: state.error,
    
    // Balance management
    unifiedBalances: state.unifiedBalances,
    isLoadingBalances: state.isLoadingBalances,
    loadUnifiedBalances,
    initializeSDK,
    bridgeAndPledge
  };
};
