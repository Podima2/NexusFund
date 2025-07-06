import React, { useState } from 'react';
import { X, Calendar, Users, Target, ArrowRight, Loader2, MessageCircle } from 'lucide-react';
import { Campaign } from '../../types';
import { PledgeForm } from './PledgeForm';
import { CommentSection } from './CommentSection';
import { useWallet } from '../../hooks/useWallet';

interface CampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose }) => {
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const { address } = useWallet();
  const [comments, setComments] = useState(campaign.comments);
  const progressPercentage = (campaign.currentAmount / campaign.targetAmount) * 100;
  const daysLeft = Math.ceil((campaign.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

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

  const handleAddComment = (content: string) => {
    // Optimistically add the comment to local state
    const newComment = {
      id: Date.now().toString(),
      campaignId: campaign.id,
      author: address ? address.slice(0, 6) + '...' + address.slice(-4) : 'You',
      authorAddress: address || '',
      content,
      createdAt: new Date(),
      likes: 0,
      replies: [],
      isCreator: address === campaign.creatorAddress,
    };
    setComments(prev => [newComment, ...prev]);
    // Optionally, also send to backend or contract here
  };

  const handleAddReply = (commentId: string, content: string) => {
    // In a real app, this would make an API call
    console.log('Adding reply to comment:', commentId, content);
  };

  const handleLikeComment = (commentId: string) => {
    // In a real app, this would make an API call
    console.log('Liking comment:', commentId);
  };

  const handleLikeReply = (replyId: string) => {
    // In a real app, this would make an API call
    console.log('Liking reply:', replyId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img 
            src={campaign.imageUrl} 
            alt={campaign.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${getStatusColor(campaign.status)}`}>
                {campaign.status.toUpperCase()}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{campaign.title}</h1>
            <p className="text-white/80 font-medium">by {campaign.creator}</p>
          </div>
        </div>

        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                activeTab === 'details'
                  ? 'bg-neutral-800 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>CAMPAIGN DETAILS</span>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                activeTab === 'comments'
                  ? 'bg-neutral-800 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>COMMENTS ({campaign.comments.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'details' ? (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">About This Campaign</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {campaign.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">Campaign Creator</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {campaign.creator.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{campaign.creator}</div>
                        <div className="text-neutral-400 text-sm font-mono">
                          {campaign.creatorAddress.slice(0, 6)}...{campaign.creatorAddress.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-slide-up">
                  <CommentSection
                    comments={comments}
                    campaignCreator={campaign.creatorAddress}
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onLikeComment={handleLikeComment}
                    onLikeReply={handleLikeReply}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">
                      {formatAmount(campaign.currentAmount)}
                    </span>
                    <span className="text-neutral-400 text-sm">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-neutral-400 text-sm mb-4">
                    raised of {formatAmount(campaign.targetAmount)} goal
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-neutral-400 to-neutral-300 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{campaign.backers.toLocaleString()}</div>
                    <div className="text-xs text-neutral-400 font-semibold tracking-wide">BACKERS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {daysLeft > 0 ? daysLeft : 0}
                    </div>
                    <div className="text-xs text-neutral-400 font-semibold tracking-wide">
                      {daysLeft > 0 ? 'DAYS LEFT' : 'ENDED'}
                    </div>
                  </div>
                </div>

                {campaign.status === 'active' && daysLeft > 0 && (
                  <button
                    onClick={() => setShowPledgeForm(true)}
                    className="relative w-full bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none text-sm overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-neutral-500/20"
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
                    
                    <span className="relative z-10">
                      Back This Campaign
                    </span>
                  </button>
                )}

                {campaign.status === 'funded' && (
                  <div className="text-center py-4">
                    <div className="text-green-400 font-bold text-lg mb-2">🎉 Successfully Funded!</div>
                    <p className="text-neutral-400 text-sm">
                      This campaign has reached its funding goal.
                    </p>
                  </div>
                )}
              </div>

              {/* Campaign Details */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Campaign Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Currency</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {campaign.currency === 'USDC' ? '💵' : campaign.currency === 'USDT' ? '💰' : '🟡'}
                      </span>
                      <span className="text-white font-semibold">{campaign.currency}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Category</span>
                    <span className="text-white font-semibold">{campaign.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Created</span>
                    <span className="text-white font-semibold">
                      {campaign.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pledge Form Modal */}
      {showPledgeForm && (
        <PledgeForm
          campaign={campaign}
          onClose={() => setShowPledgeForm(false)}
          onSuccess={() => {
            setShowPledgeForm(false);
            // Refresh campaign data
          }}
        />
      )}
    </div>
  );
};