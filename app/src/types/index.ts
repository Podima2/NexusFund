export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAddress: string;
  targetAmount: number;
  currentAmount: number;
  currency: 'USDC' | 'USDT' | 'DAI';
  deadline: Date;
  status: 'active' | 'funded' | 'expired' | 'cancelled';
  category: string;
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  backers: number;
  escrowAddress: string;
  chainId: number;
  pledges: Pledge[];
  comments: Comment[];
}

export interface Pledge {
  id: string;
  campaignId: string;
  pledgerAddress: string;
  amount: number;
  currency: 'USDC' | 'USDT' | 'DAI';
  sourceChain: number;
  targetChain: number;
  txHash: string;
  status: 'pending' | 'bridged' | 'deposited' | 'refunded';
  createdAt: Date;
  bridgedAt?: Date;
}

export interface Comment {
  id: string;
  campaignId: string;
  author: string;
  authorAddress: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Reply[];
  isCreator?: boolean;
}

export interface Reply {
  id: string;
  commentId: string;
  author: string;
  authorAddress: string;
  content: string;
  createdAt: Date;
  likes: number;
  isCreator?: boolean;
}

export interface ChainInfo {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  icon: string;
  supported: boolean;
}

export interface StablecoinInfo {
  symbol: 'USDC' | 'USDT' | 'DAI';
  name: string;
  decimals: number;
  addresses: Record<number, string>; // chainId -> contract address
  icon: string;
}

export interface BridgeTransaction {
  id: string;
  fromChain: number;
  toChain: number;
  amount: number;
  currency: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  txHash?: string;
  bridgeTxHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface UnifiedBalance {
  chainId: number;
  chainName: string;
  balances: {
    [tokenAddress: string]: {
      balance: string;
      decimals: number;
      symbol: string;
      name?: string;
      usdValue?: number;
    };
  };
}

export interface NexusTransaction {
  id: string;
  fromChain: number;
  toChain: number;
  token: string;
  amount: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  sourceTxHash?: string;
  destinationTxHash?: string;
  createdAt: string;
  completedAt?: string;
}