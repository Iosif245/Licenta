'use client';

import React, { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Textarea } from '@app/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@app/components/ui/dropdown-menu';
import { MessageCircle, Send, Reply, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { IAnnouncementComment } from '@app/types/announcement';

interface CommentSectionProps {
  comments: IAnnouncementComment[];
  onAddComment: (content: string, parentId?: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  showTitle?: boolean;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

const getIndentationClass = (depth: number): string => {
  const indentations = ['ml-0', 'ml-4', 'ml-6', 'ml-8', 'ml-10', 'ml-12', 'ml-14'];
  return indentations[Math.min(depth, indentations.length - 1)] || 'ml-14';
};

export const CommentSection = ({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUserId = 'current-user',
  currentUserName = 'You',
  currentUserAvatar,
  showTitle = true,
}: CommentSectionProps) => {
  // Debug logging for comment section props
  console.log('🔍 CommentSection - Received comments:', comments);
  console.log('🔍 CommentSection - Comments structure:', JSON.stringify(comments, null, 2));

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Count total comments including replies
  const getTotalCommentCount = (comments: IAnnouncementComment[]): number => {
    return comments.reduce((total, comment) => {
      let count = 1; // Count this comment
      if (comment.replies && comment.replies.length > 0) {
        count += getTotalCommentCount(comment.replies); // Recursively count replies
      }
      return total + count;
    }, 0);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    onAddComment(replyContent, commentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleEditComment = (commentId: string) => {
    if (!editContent.trim()) return;
    onEditComment(commentId, editContent);
    setEditContent('');
    setEditingComment(null);
  };

  const startEditing = (comment: IAnnouncementComment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
    // Cancel any active reply when starting to edit
    setReplyingTo(null);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const startReplying = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent('');
    // Cancel any active edit when starting to reply
    setEditingComment(null);
  };

  const cancelReplying = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const renderComment = (comment: IAnnouncementComment, depth = 0, parentComment?: IAnnouncementComment) => {
    const commentAuthorId = comment.authorId || (comment as any).AuthorId;
    const isOwner = commentAuthorId === currentUserId;
    const isEditing = editingComment === comment.id;
    const isReplying = replyingTo === comment.id;
    const maxDepth = 6; // Support up to 6 levels of nesting to match backend
    const canReply = depth < maxDepth;

    return (
      <div key={comment.id} className="group">
        {/* Main Comment */}
        <div className={`flex gap-3 ${depth > 0 ? getIndentationClass(depth) : ''} relative`}>
          {/* Connection line for nested replies */}
          {depth > 0 && <div className="absolute left-[-8px] top-0 bottom-0 w-px bg-border/40"></div>}

          <Avatar className="h-8 w-8 shrink-0 mt-1">
            <AvatarImage src={comment.authorAvatarUrl || '/placeholder.svg'} />
            <AvatarFallback className="text-xs bg-muted">
              {comment.authorName
                ? comment.authorName
                    .split(' ')
                    .map(name => name.charAt(0))
                    .join('')
                    .slice(0, 2)
                : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            {/* Comment Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm text-foreground truncate">{comment.authorName || 'Unknown User'}</span>
                <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(comment.createdAt)}</span>
                {depth > 0 && parentComment && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Reply className="h-3 w-3" />
                    <span className="font-medium text-primary truncate max-w-20">{parentComment.authorName || 'User'}</span>
                  </div>
                )}
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-24 z-[10000]">
                    <DropdownMenuItem onClick={() => startEditing(comment)} className="text-xs">
                      <Edit className="h-3 w-3 mr-1.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteComment(comment.id)} className="text-destructive text-xs">
                      <Trash2 className="h-3 w-3 mr-1.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Replying to indicator for deeper nesting */}
            {depth > 0 && parentComment && (
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md border-l-2 border-primary/30">
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-muted-foreground">
                    Replying to <span className="font-medium text-foreground">{parentComment.authorName}</span>
                  </span>
                  <p className="text-xs text-muted-foreground/80 italic truncate">
                    "{parentComment.content.length > 40 ? parentComment.content.substring(0, 40) + '...' : parentComment.content}"
                  </p>
                </div>
              </div>
            )}

            {/* Comment Content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="min-h-[60px] resize-none text-sm border-border/50 focus:border-primary"
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEditComment(comment.id)} disabled={!editContent.trim()} className="h-7 text-xs px-3">
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEditing} className="h-7 text-xs px-3">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Action Buttons */}
                {!isEditing && canReply && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={() => startReplying(comment.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    {comment.replies && comment.replies.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reply Form */}
            {isReplying && (
              <div className="space-y-2 p-3 bg-muted/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Reply className="h-3 w-3" />
                  <span>
                    Replying to <span className="font-medium text-foreground">{comment.authorName}</span>
                  </span>
                </div>
                <Textarea
                  placeholder={`Reply to ${comment.authorName ? comment.authorName.split(' ')[0] : 'User'}...`}
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none text-sm border-border/50 focus:border-primary"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReply(comment.id)} disabled={!replyContent.trim()} className="h-7 text-xs px-3">
                    <Send className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelReplying} className="h-7 text-xs px-3">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 relative">
            {/* Connection line for reply thread */}
            {depth >= 0 && <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/30"></div>}
            {comment.replies.map(reply => renderComment(reply, depth + 1, comment))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2 pb-2 border-b border-border/30">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Comments ({getTotalCommentCount(comments)})</h3>
        </div>
      )}

      {/* Add New Comment */}
      <div className="flex gap-3 p-4 bg-muted/20 rounded-lg border border-border/30">
        <Avatar className="h-8 w-8 shrink-0 mt-1">
          <AvatarImage src={currentUserAvatar || '/placeholder.svg'} />
          <AvatarFallback className="text-xs bg-muted">
            {currentUserName
              .split(' ')
              .map(name => name.charAt(0))
              .join('')
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none border-border/50 focus:border-primary bg-background"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()} className="h-8 px-4 text-sm">
              <Send className="h-3 w-3 mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">{comments.map(comment => renderComment(comment, 0))}</div>
        )}
      </div>
    </div>
  );
};
