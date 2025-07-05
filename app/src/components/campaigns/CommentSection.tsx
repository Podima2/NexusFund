import React, { useState } from 'react';
import { MessageCircle, Heart, Reply, Send, User, Crown, Clock } from 'lucide-react';
import { Comment, Reply as ReplyType } from '../../types';
import { useWallet } from '../../hooks/useWallet';

interface CommentSectionProps {
  comments: Comment[];
  campaignCreator: string;
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  onLikeReply: (replyId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  campaignCreator,
  onAddComment,
  onAddReply,
  onLikeComment,
  onLikeReply
}) => {
  const { address, isConnected } = useWallet();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isConnected) return;
    
    onAddComment(newComment.trim());
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || !isConnected) return;
    
    onAddReply(commentId, replyContent.trim());
    setReplyContent('');
    setReplyingTo(null);
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <MessageCircle className="w-6 h-6 text-neutral-400" />
        <h3 className="text-xl font-bold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {isConnected ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this campaign..."
              className="w-full bg-transparent text-white placeholder-neutral-400 resize-none focus:outline-none font-medium"
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
              <span className="text-xs text-neutral-500 font-medium">
                {newComment.length}/500 characters
              </span>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-500 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center">
          <MessageCircle className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">
            Connect your wallet to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-neutral-400 mb-2">No comments yet</h4>
            <p className="text-neutral-500 font-medium">
              Be the first to share your thoughts about this campaign!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center">
                      {comment.isCreator ? (
                        <Crown className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <User className="w-5 h-5 text-neutral-300" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-white flex items-center space-x-2">
                        <span>{comment.author}</span>
                        {comment.isCreator && (
                          <span className="flex items-center space-x-1 px-2 py-0.5 bg-yellow-950 border border-yellow-800 rounded-full text-xs text-yellow-400 font-semibold">
                            <Crown className="w-3 h-3" />
                            <span>CREATOR</span>
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-neutral-500 font-mono">
                        {formatAddress(comment.authorAddress)}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                    </div>
                    
                    <p className="text-neutral-300 leading-relaxed font-medium mb-4">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className="flex items-center space-x-2 text-neutral-400 hover:text-red-400 transition-colors font-medium text-sm hover:scale-105 active:scale-95"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      
                      {isConnected && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-medium text-sm hover:scale-105 active:scale-95"
                        >
                          <Reply className="w-4 h-4" />
                          <span>Reply</span>
                        </button>
                      )}
                      
                      {comment.replies.length > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="text-neutral-400 hover:text-white transition-colors font-medium text-sm hover:scale-105 active:scale-95"
                        >
                          {expandedComments.has(comment.id) ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-14 animate-scale-in">
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="w-full bg-transparent text-white placeholder-neutral-400 resize-none focus:outline-none font-medium"
                      rows={2}
                      maxLength={300}
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
                      <span className="text-xs text-neutral-500 font-medium">
                        {replyContent.length}/300 characters
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors font-medium text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!replyContent.trim()}
                          className="flex items-center space-x-1 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Replies */}
              {expandedComments.has(comment.id) && comment.replies.length > 0 && (
                <div className="ml-14 space-y-4 animate-slide-up">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center">
                            {reply.isCreator ? (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <User className="w-4 h-4 text-neutral-300" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-bold text-white text-sm flex items-center space-x-2">
                              <span>{reply.author}</span>
                              {reply.isCreator && (
                                <span className="flex items-center space-x-1 px-1.5 py-0.5 bg-yellow-950 border border-yellow-800 rounded-full text-xs text-yellow-400 font-semibold">
                                  <Crown className="w-2.5 h-2.5" />
                                  <span>CREATOR</span>
                                </span>
                              )}
                            </h5>
                            <span className="text-xs text-neutral-500 font-mono">
                              {formatAddress(reply.authorAddress)}
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-neutral-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(reply.createdAt)}</span>
                            </div>
                          </div>
                          
                          <p className="text-neutral-300 leading-relaxed font-medium text-sm mb-3">
                            {reply.content}
                          </p>
                          
                          <button
                            onClick={() => onLikeReply(reply.id)}
                            className="flex items-center space-x-1 text-neutral-400 hover:text-red-400 transition-colors font-medium text-sm hover:scale-105 active:scale-95"
                          >
                            <Heart className="w-3 h-3" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};