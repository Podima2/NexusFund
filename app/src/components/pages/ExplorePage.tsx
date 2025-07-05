import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Calendar, Target, Users } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';
import { Campaign } from '../../types';
import { useOnchainCampaigns } from '../../hooks/useOnchainCampaigns';
import { CampaignCard } from '../campaigns/CampaignCard';
import { CampaignModal } from '../campaigns/CampaignModal';

export const ExplorePage: React.FC = () => {
  const campaigns = useOnchainCampaigns('https://base-sepolia.g.alchemy.com/v2/kaFl069xyvy3np41aiUXwjULZrF67--t');
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'ending-soon' | 'most-funded'>('trending');

  // Convert arrays to options format for CustomSelect
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Education', label: 'Education' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Security', label: 'Security' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'funded', label: 'Funded' },
    { value: 'expired', label: 'Expired' }
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'ending-soon', label: 'Ending Soon' },
    { value: 'most-funded', label: 'Most Funded' }
  ];

  useEffect(() => {
    let filtered = [...campaigns];
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }
    // Sorting
    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === 'trending') {
      filtered = filtered.sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount));
    } else if (sortBy === 'ending-soon') {
      filtered = filtered.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
    } else if (sortBy === 'most-funded') {
      filtered = filtered.sort((a, b) => b.currentAmount - a.currentAmount);
    }
    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, selectedCategory, selectedStatus, sortBy]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl text-sharp text-white mb-2">EXPLORE CAMPAIGNS</h1>
        <p className="text-neutral-400 font-medium">
          Discover innovative projects seeking funding across multiple blockchains
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search campaigns, creators, or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Category and Status Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <Filter className="w-5 h-5 text-neutral-400" />
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <CustomSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                placeholder="Select category"
                className="w-full sm:w-[160px]"
              />

              <CustomSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                placeholder="Select status"
                className="w-full sm:w-[140px]"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-3 w-full lg:w-auto justify-start lg:justify-end">
            <span className="text-neutral-400 font-semibold text-sm">Sort by:</span>
            <CustomSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              options={sortOptions}
              placeholder="Select sort"
              className="w-full sm:w-[160px]"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <p className="text-neutral-400 font-medium">
          {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-6">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl text-sharp text-white mb-4">No Campaigns Found</h3>
            <p className="text-neutral-400 font-medium max-w-md mx-auto">
              Try adjusting your search terms or filters to find campaigns that match your interests.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up h-full"
              >
                <CampaignCard
                  campaign={campaign}
                  onViewDetails={setSelectedCampaign}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </main>

  );
};