import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, DollarSign, Plus, ArrowRight, Zap } from 'lucide-react';
import { Campaign } from '../../types';
import { useOnchainCampaigns } from '../../hooks/useOnchainCampaigns';
import { CampaignCard } from '../campaigns/CampaignCard';
import { CampaignModal } from '../campaigns/CampaignModal';

interface DashboardPageProps {
  onNavigate: (page: 'dashboard' | 'explore' | 'create') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const campaigns = useOnchainCampaigns('https://base-sepolia.g.alchemy.com/v2/kaFl069xyvy3np41aiUXwjULZrF67--t');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalBackers: 0,
    successRate: 0
  });

  useEffect(() => {
    // Calculate stats from on-chain campaigns
    const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBackers = campaigns.reduce((sum, campaign) => sum + campaign.backers, 0);
    const fundedCampaigns = campaigns.filter(c => c.status === 'funded').length;
    const successRate = campaigns.length > 0 ? (fundedCampaigns / campaigns.length) * 100 : 0;

    setStats({
      totalRaised,
      activeCampaigns,
      totalBackers,
      successRate
    });
  }, [campaigns]);

  const featuredCampaigns = campaigns.filter(c => c.status === 'active').slice(0, 3);
  const trendingCampaigns = campaigns
    .filter(c => c.status === 'active')
    .sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))
    .slice(0, 6);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-transparent to-blue-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8 animate-slide-up">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl text-sharp text-white leading-tight">
                Nexus
                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  Crowdfunding
                </span>
              </h1>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-medium">
                Fund innovative projects with seamless cross-chain support. 
                Powered by Avail Nexus for seamless cross-chain pledges.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {[
                { icon: Zap, text: 'Cross-Chain Pledges', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
                { icon: Target, text: 'Escrow Protection', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                { icon: DollarSign, text: 'Stablecoin Support', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
                { icon: Users, text: 'Global Community', color: 'from-red-500/20 to-pink-500/20 border-red-500/30' }
              ].map((feature, index) => (
                <div
                  key={feature.text}
                  className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${feature.color} rounded-full border backdrop-blur-sm animate-scale-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl text-sharp text-white mb-4">Platform Overview</h2>
          <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
            Real-time insights from our cross-chain crowdfunding ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: DollarSign,
              title: 'Total Raised',
              value: formatAmount(stats.totalRaised),
              subtitle: 'Across all campaigns',
              color: 'from-green-900 to-emerald-900 border-green-800',
              iconColor: 'text-green-300',
              valueColor: 'text-green-400'
            },
            {
              icon: Target,
              title: 'Active Campaigns',
              value: stats.activeCampaigns,
              subtitle: 'Currently fundraising',
              color: 'from-blue-900 to-indigo-900 border-blue-800',
              iconColor: 'text-blue-300',
              valueColor: 'text-blue-400'
            },
            {
              icon: Users,
              title: 'Total Backers',
              value: stats.totalBackers.toLocaleString(),
              subtitle: 'Community supporters',
              color: 'from-purple-900 to-pink-900 border-purple-800',
              iconColor: 'text-purple-300',
              valueColor: 'text-purple-400'
            },
            {
              icon: TrendingUp,
              title: 'Success Rate',
              value: `${stats.successRate.toFixed(0)}%`,
              subtitle: 'Funded campaigns',
              color: 'from-yellow-900 to-orange-900 border-yellow-800',
              iconColor: 'text-yellow-300',
              valueColor: 'text-yellow-400'
            }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                <div className={`text-3xl font-mono font-bold ${stat.valueColor} transition-all duration-500`}>
                  {stat.value}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{stat.title}</h3>
                <p className={`${stat.iconColor} text-sm font-medium opacity-80`}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Campaigns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* <div className="flex items-center justify-between mb-12 animate-slide-up">
          <div>
            <h2 className="text-3xl text-sharp text-white mb-4">Featured Campaigns</h2>
            <p className="text-neutral-400 font-medium">
              Handpicked innovative projects making a difference
            </p>
          </div>
          
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-semibold text-sm tracking-wide hover:scale-105 active:scale-95"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div> */}

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {featuredCampaigns.map((campaign, index) => (
            <div 
              key={campaign.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-slide-up h-full"
            >
              <CampaignCard
                campaign={campaign}
                onViewDetails={setSelectedCampaign}
              />
            </div>
          ))}
        </div> */}

        {/* Trending Campaigns */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-sharp text-white mb-4">Trending Now</h2>
              <p className="text-neutral-400 font-medium">
                Campaigns gaining momentum in the community
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id}
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
                className="animate-slide-up h-full"
              >
                <CampaignCard
                  campaign={campaign}
                  onViewDetails={setSelectedCampaign}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center animate-slide-up">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-neutral-800 to-neutral-700 border border-neutral-700 rounded-xl">
                <Plus className="w-6 h-6 text-neutral-300" />
              </div>
              <h2 className="text-2xl text-sharp text-white">Start Your Campaign</h2>
            </div>
            
            <p className="text-lg text-neutral-300 leading-relaxed font-medium">
              Have an innovative idea that needs funding? Launch your cross-chain crowdfunding campaign 
              and reach supporters across multiple blockchains with complete transparency.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => onNavigate('create')}
                className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 focus:outline-none"
              >
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full bg-gradient-to-r from-neutral-800 to-neutral-700 group-hover:from-neutral-700 group-hover:to-neutral-600 rounded-[10px] transition-all duration-300"></div>
                </div>
                
                {/* Shiny Highlight Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
                
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <Plus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">CREATE CAMPAIGN</span>
              </button>
              
              <button
                onClick={() => onNavigate('explore')}
                className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
              >
                <TrendingUp className="w-4 h-4" />
                <span>EXPLORE CAMPAIGNS</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span className="font-semibold tracking-wide">CROSS-CHAIN SUPPORT</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="font-semibold tracking-wide">ESCROW PROTECTION</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span className="font-semibold tracking-wide">GLOBAL REACH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
};