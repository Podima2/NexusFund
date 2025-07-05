import React, { useState, useEffect } from 'react';
import { Shield, Newspaper, Lock, Sparkles, CheckCircle, Database, Users, Brain, Activity, TrendingUp, Eye, Clock, PlusCircle } from 'lucide-react';
import { Article } from '../../types';
import { mockArticles } from '../../data/mockArticles';

interface DashboardLandingProps {
  onNavigate: (page: 'dashboard' | 'articles' | 'submit' | 'form') => void;
}

export const DashboardLanding: React.FC<DashboardLandingProps> = ({
  onNavigate,
}) => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    verifiedAuthors: 0,
    zkProofs: 0,
    loading: false
  });

  useEffect(() => {
    // Load articles immediately without delay
    const featured = mockArticles.filter(article => article.featured).slice(0, 3);
    const latest = mockArticles
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 6);
    
    setFeaturedArticles(featured);
    setLatestArticles(latest);
    
    setStats({
      totalArticles: mockArticles.length,
      verifiedAuthors: new Set(mockArticles.map(a => a.author)).size,
      zkProofs: mockArticles.filter(a => a.zkProof).length,
      loading: false
    });
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      news: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      research: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      tutorial: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
      analysis: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400',
      opinion: 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400'
    };
    return colors[category as keyof typeof colors] || colors.news;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-transparent to-purple-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8 animate-slide-up">
            {/* Main Headline */}
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl text-sharp text-white leading-tight">
                thewitness
                <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  Media Network
                </span>
              </h1>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-medium">
                Decentralized journalism powered by cryptographic truth. 
                Publish, verify, and discover content with complete transparency and privacy.
              </p>
            </div>

            {/* Key Features Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {[
                { icon: Shield, text: 'ZK Verified Content', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
                { icon: Lock, text: 'Anonymous Publishing', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                { icon: Database, text: 'IPFS Distributed', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
                { icon: Newspaper, text: 'Decentralized News', color: 'from-red-500/20 to-pink-500/20 border-red-500/30' }
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
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h2 className="text-3xl text-sharp text-white">Network Overview</h2>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-950 border border-green-800 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-bold tracking-wide">LIVE</span>
            </div>
          </div>
          <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
            Real-time insights from our decentralized media ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Newspaper,
              title: 'Published Articles',
              value: stats.totalArticles,
              subtitle: 'ZK verified content',
              color: 'from-blue-900 to-indigo-900 border-blue-800',
              iconColor: 'text-blue-300',
              valueColor: 'text-blue-400'
            },
            {
              icon: Users,
              title: 'Verified Authors',
              value: stats.verifiedAuthors,
              subtitle: 'Anonymous contributors',
              color: 'from-purple-900 to-pink-900 border-purple-800',
              iconColor: 'text-purple-300',
              valueColor: 'text-purple-400'
            },
            {
              icon: Shield,
              title: 'ZK Proofs',
              value: stats.zkProofs,
              subtitle: 'Cryptographic verifications',
              color: 'from-green-900 to-emerald-900 border-green-800',
              iconColor: 'text-green-300',
              valueColor: 'text-green-400'
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

      {/* Featured Articles */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12 animate-slide-up">
          <div>
            <h2 className="text-3xl text-sharp text-white mb-4">Featured Articles</h2>
            <p className="text-neutral-400 font-medium">
              Editor's picks and trending content
            </p>
          </div>
          
          <button
            onClick={() => onNavigate('articles')}
            className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-semibold text-sm tracking-wide hover:scale-105 active:scale-95"
          >
            <span>VIEW ALL</span>
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {featuredArticles.map((article, index) => (
            <div
              key={article.id}
              className="group bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onNavigate('articles')}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(article.category)} rounded-full border text-xs font-bold tracking-wide`}>
                    {article.category.toUpperCase()}
                  </div>
                  {article.zkProof && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <Shield className="w-3 h-3" />
                      <span className="text-xs font-bold">ZK</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{article.author}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Latest News Section */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-sharp text-white mb-4">Latest News</h2>
              <p className="text-neutral-400 font-medium">
                Recent updates from the ZK ecosystem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestArticles.map((article, index) => (
              <div
                key={article.id}
                className="group bg-neutral-950 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
                onClick={() => onNavigate('articles')}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(article.category)} rounded-full border text-xs font-bold tracking-wide`}>
                        {article.category.toUpperCase()}
                      </div>
                      {article.zkProof && (
                        <div className="flex items-center space-x-1 text-green-400">
                          <Shield className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-semibold">{article.author}</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center animate-slide-up">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-800 rounded-2xl">
                <Newspaper className="w-8 h-8 text-purple-300" />
              </div>
              <h2 className="text-3xl text-sharp text-white">Contribute to the Network</h2>
            </div>
            
            <p className="text-xl text-neutral-300 leading-relaxed font-medium">
              Share your insights, research, and stories with cryptographic verification 
              and complete anonymity on our decentralized platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onNavigate('submit')}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
              >
                <PlusCircle className="w-5 h-5" />
                <span>SUBMIT CONTENT</span>
              </button>
              
              <button
                onClick={() => onNavigate('articles')}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
              >
                <Eye className="w-5 h-5" />
                <span>EXPLORE CONTENT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};