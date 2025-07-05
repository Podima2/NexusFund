import { ChainInfo, StablecoinInfo } from '../types';

export const supportedChains: ChainInfo[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    icon: '🔷',
    supported: true
  },
  {
    chainId: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon.llamarpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: '🟣',
    supported: true
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arbitrum.llamarpc.com',
    blockExplorer: 'https://arbiscan.io',
    icon: '🔵',
    supported: true
  },
  {
    chainId: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://optimism.llamarpc.com',
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: '🔴',
    supported: true
  },
  {
    chainId: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://base.llamarpc.com',
    blockExplorer: 'https://basescan.org',
    icon: '🔵',
    supported: true
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://avalanche.llamarpc.com',
    blockExplorer: 'https://snowtrace.io',
    icon: '🔺',
    supported: true
  }
];

export const stablecoins: StablecoinInfo[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    icon: '💵',
    addresses: {
      1: '0xA0b86a33E6441c8C673f4c8C4C4C4C4C4C4C4C4C', // Ethereum
      137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon
      42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // Arbitrum
      10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // Optimism
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base
      43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' // Avalanche
    }
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    icon: '💰',
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
      42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum
      10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // Optimism
      8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // Base
      43114: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7' // Avalanche
    }
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    icon: '🟡',
    addresses: {
      1: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // Ethereum
      137: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // Polygon
      42161: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // Arbitrum
      10: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // Optimism
      8453: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // Base
      43114: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70' // Avalanche
    }
  }
];

export function getChainInfo(chainId: number): ChainInfo | undefined {
  return supportedChains.find(chain => chain.chainId === chainId);
}

export function getStablecoinInfo(symbol: string): StablecoinInfo | undefined {
  return stablecoins.find(coin => coin.symbol === symbol);
}

export function getStablecoinAddress(symbol: string, chainId: number): string | undefined {
  const stablecoin = getStablecoinInfo(symbol);
  return stablecoin?.addresses[chainId];
}