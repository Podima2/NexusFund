import React from 'react';
import { Calendar, Users, Target, TrendingUp } from 'lucide-react';
import { Campaign } from '../../types';

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onViewDetails }) => {
  const progressPercentage = (campaign.currentAmount / campaign.targetAmount) * 100;
  const daysLeft = Math.ceil((campaign.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded':
        return 'text-green-400 bg-green-950 border-green-800';
      case 'expired':
        return 'text-red-400 bg-red-950 border-red-800';
      case 'cancelled':
        return 'text-gray-400 bg-gray-950 border-gray-800';
      default:
        return 'text-neutral-300 bg-neutral-800 border-neutral-700';
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="group bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 animate-slide-up cursor-pointer h-full flex flex-col">
      {/* Campaign Image */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${getStatusColor(campaign.status)}`}>
          {campaign.status.toUpperCase()}
        </div>

        {/* Progress Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold text-sm">
                {formatAmount(campaign.currentAmount)} raised
              </span>
              <span className="text-white/80 text-sm">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neutral-400 to-neutral-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 flex-1">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 min-h-[3.5rem]">
            {campaign.title}
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
            {campaign.description}
          </p>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-1">{formatAmount(campaign.targetAmount)}</div>
            <div className="text-xs text-neutral-400 font-semibold tracking-wide uppercase">Target</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-1">{campaign.backers.toLocaleString()}</div>
            <div className="text-xs text-neutral-400 font-semibold tracking-wide uppercase">Backers</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {campaign.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 font-medium"
            >
              {tag}
            </span>
          ))}
          {campaign.tags.length > 3 && (
            <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-400 font-medium">
              +{campaign.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="flex items-center space-x-4 text-sm text-neutral-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => onViewDetails(campaign)}
            className="relative flex items-center justify-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-[1.02] active:scale-[0.98] text-sm overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 focus:outline-none min-w-[100px]"
          >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-full h-full bg-neutral-800 group-hover:bg-neutral-700 rounded-[10px] transition-all duration-300"></div>
            </div>
            
            {/* Shiny Highlight Effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </div>
            
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative z-10">View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};