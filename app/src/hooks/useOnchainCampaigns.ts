import { useEffect, useState } from 'react';
import { Campaign } from '../types';
import { createPublicClient, http, getContract } from 'viem';
import { baseSepolia } from 'viem/chains';

const CONTRACT_ADDRESS = '0x4951992d46fa57c50Cb7FcC9137193BE639A9bEE';
const ABI = [
  {
    name: 'getAllCampaigns',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'creator', type: 'address' },
          { name: 'goal', type: 'uint256' },
          { name: 'pledged', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'released', type: 'bool' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'imageUrl', type: 'string' },
          { name: 'tags', type: 'string[]' },
        ],
      },
    ],
  },
];

export function useOnchainCampaigns(rpcUrl: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  useEffect(() => {
    async function load() {
      const client = createPublicClient({
        chain: baseSepolia, // or your target chain
        transport: http(rpcUrl),
      });
      const contract = getContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        client,
      });
      const allCampaigns = await contract.read.getAllCampaigns() as any[];
      const now = Date.now();
      const result: Campaign[] = allCampaigns.map((c: any, i: number) => ({
        id: i.toString(),
        title: c.title,
        description: c.description,
        creator: c.creator,
        creatorAddress: c.creator,
        targetAmount: Number(c.goal) / 1e6,
        currentAmount: Number(c.pledged) / 1e6,
        currency: 'USDC', // adjust if multi-token
        deadline: new Date(Number(c.deadline) * 1000),
        status: c.released ? 'funded' : (now/1000 > Number(c.deadline) ? 'expired' : 'active'),
        category: c.category,
        imageUrl: c.imageUrl,
        tags: c.tags,
        createdAt: new Date(Number(c.deadline) * 1000 - 30 * 24 * 60 * 60 * 1000), // dummy, adjust if you store
        updatedAt: new Date(Number(c.deadline) * 1000), // dummy, adjust if you store
        backers: 0, // not tracked on-chain in struct
        escrowAddress: CONTRACT_ADDRESS,
        chainId: 1, // adjust if needed
        pledges: [], // not tracked on-chain
        comments: [], // not tracked on-chain
      }));
      setCampaigns(result);
    }
    load();
  }, [rpcUrl]);
  return campaigns;
} 