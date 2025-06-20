/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@app/store/hooks';
import { userSelector, userRoleSelector } from '@app/store/selectors/user-selectors';
import { profileStudentSelector, profileAssociationSelector } from '@app/store/selectors/profile-selectors';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';

import { IChatGroup, IChatMessage } from '@app/types/chat';
import { getChatGroupsRequest, getChatMessagesRequest, sendMessageRequest, markMessagesAsReadRequest } from '@app/api/requests/chat-requests';
import { MessageCircle, Search, Send, Plus, ArrowLeft, MoreVertical } from 'lucide-react';
import { authTokenSelector } from '@app/store/selectors/auth-selectors';
import { cn } from '@app/lib/utils';
import { signalRService } from '@app/services/signalr-service';
import { Roles } from '@app/types/user/Role';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const chatIdFromUrl = searchParams.get('chatId');

  // State
  const [chatGroups, setChatGroups] = useState<IChatGroup[]>([]);
  const [selectedChatGroup, setSelectedChatGroup] = useState<IChatGroup | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  // Infinite scroll state
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [messagesPage, setMessagesPage] = useState(1);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  
  // Auto-read and scroll state
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hasUserScrolledUp, setHasUserScrolledUp] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redux selectors
  const user = useAppSelector(userSelector);
  const userRole = useAppSelector(userRoleSelector);
  const studentProfile = useAppSelector(profileStudentSelector);
  const associationProfile = useAppSelector(profileAssociationSelector);
  const token = useAppSelector(authTokenSelector);

  // Utility function for auto-scroll
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth', force = false) => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;

    // If not forcing, check if user is extremely close to bottom and not manually scrolling
    if (!force) {
      const isExtremelyCloseToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10; // Even more strict - only 10px
      if (!isExtremelyCloseToBottom || isUserScrolling) return;
    }

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (container) {
        // Scroll to the very bottom of the container
        container.scrollTo({
          top: container.scrollHeight,
          behavior: behavior
        });
      }
    });
  };

  // Responsive handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChatList(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Page visibility detection for auto-read functionality
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      
      // If page becomes visible and we have an active chat, mark messages as read
      if (!document.hidden && selectedChatGroup) {
        setTimeout(() => markChatAsRead(), 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedChatGroup]);

  // Setup SignalR connection and message handling
  useEffect(() => {
    if (token) {
      const setupConnection = async () => {
        try {
          const connection = await signalRService.getChatConnection(token);
          if (connection) {
            console.log('SignalR connected');

            // Listen for incoming messages
            connection.on('ReceiveMessage', (message: IChatMessage) => {
              console.log('Received message:', message);
              setMessages(prev => [...prev, message]);

              // Update chat group last message time and unread count
              setChatGroups(prev =>
                prev.map(group => {
                  if (group.id === message.chatGroupId) {
                    // Only increment unread count if this chat is not currently selected
                    // or if the message is not from the current user
                    const shouldIncrementUnread = selectedChatGroup?.id !== message.chatGroupId && message.senderId !== user?.id;
                    return {
                      ...group,
                      lastMessageAt: message.sentAt,
                      unreadCount: shouldIncrementUnread ? group.unreadCount + 1 : group.unreadCount,
                    };
                  }
                  return group;
                }),
              );

              // Auto-mark as read if user is actively viewing this conversation
              if (
                selectedChatGroup?.id === message.chatGroupId && 
                message.senderId !== user?.id && 
                isPageVisible && 
                !isUserScrolling
              ) {
                // Mark as read after a short delay to ensure message is processed
                setTimeout(() => {
                  markChatAsRead();
                }, 1000);
              }
            });
          }
        } catch (error) {
          console.error('Failed to setup SignalR connection:', error);
        }
      };

      setupConnection();

      return () => {
        // Clean up event listeners
        signalRService
          .getChatConnection(token)
          .then(connection => {
            if (connection) {
              connection.off('ReceiveMessage');
            }
          })
          .catch(console.error);
      };
    }
  }, [token, selectedChatGroup, user?.id]);

  // Load chat groups on mount
  useEffect(() => {
    loadChatGroups();
  }, []);

  // Auto-select chat from URL parameter
  useEffect(() => {
    if (chatIdFromUrl && chatGroups.length > 0) {
      const chatFromUrl = chatGroups.find(group => group.id === chatIdFromUrl);
      if (chatFromUrl) {
        setSelectedChatGroup(chatFromUrl);
        if (isMobile) {
          setShowChatList(false);
        }
      }
    }
  }, [chatIdFromUrl, chatGroups, isMobile]);

  // Load messages when chat group is selected
  useEffect(() => {
    if (selectedChatGroup) {
      loadMessages(true); // Reset messages when selecting new chat

      // Reset scroll state for new conversation
      setHasUserScrolledUp(false);

      // Mark messages as read when opening a chat
      markChatAsRead();

      // Join SignalR group
      signalRService.joinChat(selectedChatGroup.id, token);
    }

    return () => {
      if (selectedChatGroup) {
        signalRService.leaveChat(selectedChatGroup.id);
      }
    };
  }, [selectedChatGroup]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isMyMessage = lastMessage.senderId === user?.id;

      // Auto-scroll in these cases:
      // 1. It's my own message (always scroll)
      // 2. First message in a new conversation
      // 3. For received messages: ONLY if user hasn't scrolled up manually
      if (isMyMessage) {
        // Force scroll for own messages - always
        setTimeout(() => scrollToBottom('smooth', true), 50);
      } else if (messages.length === 1) {
        // Force scroll for first message in conversation
        setTimeout(() => scrollToBottom('auto', true), 50);
      } else if (!hasUserScrolledUp && isPageVisible && !isUserScrolling) {
        // For received messages: only scroll if user hasn't manually scrolled up
        const container = messagesContainerRef.current;
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const isExtremelyCloseToBottom = scrollHeight - scrollTop <= clientHeight + 10;
          
          if (isExtremelyCloseToBottom) {
            setTimeout(() => scrollToBottom('smooth', false), 50);
          }
        }
      }
    }
  }, [messages, user?.id, isUserScrolling, isPageVisible, hasUserScrolledUp]);

  // Auto-scroll when conversation is opened or switched (immediate scroll)
  useEffect(() => {
    if (selectedChatGroup && messages.length > 0) {
      // Use multiple timeouts to ensure scrolling works
      const timer1 = setTimeout(() => {
        scrollToBottom('auto', true);
      }, 50);
      
      const timer2 = setTimeout(() => {
        scrollToBottom('auto', true);
      }, 200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [selectedChatGroup?.id]); // Only trigger when chat group changes

  // Enhanced scroll handler with manual scroll detection
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Detect if user is at bottom
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
      
      // Track if user has scrolled up from bottom
      if (!isAtBottom && !hasUserScrolledUp) {
        setHasUserScrolledUp(true);
        console.log('User scrolled up - disabling auto-scroll for received messages');
      }
      
      // Reset the flag when user returns to bottom
      if (isAtBottom && hasUserScrolledUp) {
        setHasUserScrolledUp(false);
        console.log('User returned to bottom - enabling auto-scroll for received messages');
      }

      // Set user scrolling state
      setIsUserScrolling(!isAtBottom);

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set a longer timeout to detect when user stops scrolling
      const timeout = setTimeout(() => {
        setIsUserScrolling(false);
        // If user returns to bottom, mark messages as read
        if (isAtBottom && selectedChatGroup && isPageVisible) {
          markChatAsRead();
        }
      }, 3000);

      setScrollTimeout(timeout);

      // Load more messages when scrolled to top
      if (scrollTop === 0 && hasMoreMessages && !loadingMoreMessages && selectedChatGroup) {
        loadMoreMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    // Add ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      // When container resizes, only scroll if user was extremely close to bottom AND hasn't scrolled up manually
      const { scrollTop, scrollHeight, clientHeight } = container;
      const wasExtremelyCloseToBottom = scrollHeight - scrollTop <= clientHeight + 10;
      
      if (wasExtremelyCloseToBottom && !isUserScrolling && !hasUserScrolledUp) {
        setTimeout(() => scrollToBottom('auto', true), 50);
      }
    });
    
    resizeObserver.observe(container);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [hasMoreMessages, loadingMoreMessages, selectedChatGroup, scrollTimeout, isPageVisible, isUserScrolling, hasUserScrolledUp]);

  const loadChatGroups = async () => {
    try {
      setLoading(true);
      const response = await getChatGroupsRequest();
      setChatGroups(response.items || []);
    } catch (error) {
      console.error('Failed to load chat groups:', error);
      setChatGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (reset = false, page = 1) => {
    if (!selectedChatGroup) return;

    try {
      if (reset) {
        setMessagesLoading(true);
        setMessagesPage(1);
        setHasMoreMessages(true);
      }

      console.log('Loading messages for chat group:', selectedChatGroup.id, 'page:', page);
      const response = await getChatMessagesRequest(selectedChatGroup.id, page, 20);
      console.log('Messages response:', response);

      if (response && response.items) {
        // Backend returns messages in DESC order (newest first)
        // For display, we want oldest at top, newest at bottom
        const sortedMessages = [...response.items].reverse();

        if (reset) {
          // Reset messages for new chat - display in chronological order
          setMessages(sortedMessages);
          
          // Auto-scroll to bottom when loading new conversation
          setTimeout(() => {
            scrollToBottom('auto', true);
          }, 100);
        } else {
          // For infinite scroll, prepend older messages (they come reversed from backend)
          // So we reverse them again to get chronological order, then prepend
          setMessages(prev => [...sortedMessages, ...prev]);
        }

        // Check if there are more messages
        if (response.items.length < 20) {
          setHasMoreMessages(false);
        }
      } else {
        setMessages([]);
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      if (reset) {
        setMessages([]);
      }
      setHasMoreMessages(false);
    } finally {
      if (reset) {
        setMessagesLoading(false);
      }
    }
  };

  const loadMoreMessages = async () => {
    if (!selectedChatGroup || loadingMoreMessages || !hasMoreMessages) return;

    try {
      setLoadingMoreMessages(true);
      const nextPage = messagesPage + 1;
      setMessagesPage(nextPage);

      const response = await getChatMessagesRequest(selectedChatGroup.id, nextPage, 20);

      if (response && response.items && response.items.length > 0) {
        // Store current scroll position
        const container = messagesContainerRef.current;
        const previousScrollHeight = container?.scrollHeight || 0;

        // Backend returns messages in DESC order (newest first for this page)
        // For infinite scroll, we want to prepend older messages
        // So we reverse to get chronological order, then prepend
        const sortedMessages = [...response.items].reverse();
        setMessages(prev => [...sortedMessages, ...prev]);

        // Restore scroll position after new messages are added
        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - previousScrollHeight;
          }
        }, 0);

        // Check if there are more messages
        if (response.items.length < 20) {
          setHasMoreMessages(false);
        }
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
      setHasMoreMessages(false);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  const markChatAsRead = async () => {
    if (!selectedChatGroup) return;

    try {
      await markMessagesAsReadRequest(selectedChatGroup.id);
      // Update the chat group's unread count locally
      setChatGroups(prev => prev.map(cg => (cg.id === selectedChatGroup.id ? { ...cg, unreadCount: 0 } : cg)));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedChatGroup || sendingMessage) return;

    try {
      setSendingMessage(true);

      // Send via SignalR first
      try {
        await signalRService.sendMessage(selectedChatGroup.id, newMessage.trim());
        // Force scroll to bottom after sending message with multiple attempts
        setTimeout(() => scrollToBottom('smooth', true), 50);
        setTimeout(() => scrollToBottom('smooth', true), 150);
      } catch (signalRError) {
        console.warn('SignalR send failed, using HTTP fallback:', signalRError);
        // Fallback to HTTP API
        const sentMessage = await sendMessageRequest(selectedChatGroup.id, newMessage.trim());
        setMessages(prev => [...prev, sentMessage]);
        // Force scroll to bottom after sending message with multiple attempts
        setTimeout(() => scrollToBottom('smooth', true), 50);
        setTimeout(() => scrollToBottom('smooth', true), 150);
      }

      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleChatSelect = (chatGroup: IChatGroup) => {
    setSelectedChatGroup(chatGroup);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setSelectedChatGroup(null);
    setShowChatList(true);
    setMessages([]);
  };

  // Helper function to get the other participant's info
  const getOtherParticipant = (chatGroup: IChatGroup) => {
    // If current user is a student, show the association
    // If current user is an association, show the student
    if (userRole === Roles.STUDENT) {
      return {
        id: chatGroup.associationId,
        type: 'Association' as const,
        name: chatGroup.associationName || 'Association',
        avatarUrl: chatGroup.associationAvatarUrl || null,
      };
    } else {
      return {
        id: chatGroup.studentId,
        type: 'Student' as const,
        name: chatGroup.studentName || 'Student',
        avatarUrl: chatGroup.studentAvatarUrl || null,
      };
    }
  };

  const filteredChatGroups = chatGroups.filter(group => {
    if (!searchTerm) return true;
    const otherParticipant = getOtherParticipant(group);
    return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isMyMessage = (message: IChatMessage) => {
    return message.senderId === user?.id;
  };

  const getCurrentUserAvatar = () => {
    // For students, use direct avatar URL with cache busting
    if (userRole === Roles.STUDENT && studentProfile?.avatarUrl) {
      const baseUrl = studentProfile.avatarUrl;
      // Add cache-busting parameter based on profile update time
      const cacheBuster = studentProfile.updatedAt ? `?t=${Date.parse(studentProfile.updatedAt)}` : `?t=${Date.now()}`;
      return `${baseUrl}${cacheBuster}`;
    }

    // For associations, use direct logo URL with cache busting
    if (userRole === Roles.ASSOCIATION && associationProfile?.logo) {
      const baseUrl = associationProfile.logo;
      // Add cache-busting parameter based on profile update time
      const cacheBuster = associationProfile.updatedAt ? `?t=${Date.parse(associationProfile.updatedAt)}` : `?t=${Date.now()}`;
      return `${baseUrl}${cacheBuster}`;
    }

    // No avatar/logo available
    return undefined;
  };

  const getCurrentUserName = () => {
    if (userRole === Roles.STUDENT && studentProfile) {
      return `${studentProfile.firstName} ${studentProfile.lastName}`;
    } else if (userRole === Roles.ASSOCIATION && associationProfile) {
      return associationProfile.name;
    }
    return 'You';
  };

  const getCurrentUserInitial = () => {
    // For students, use first and last name initials
    if (userRole === Roles.STUDENT && studentProfile) {
      return `${studentProfile.firstName.charAt(0)}${studentProfile.lastName.charAt(0)}`.toUpperCase();
    }

    // For associations, use association name initials
    if (userRole === Roles.ASSOCIATION && associationProfile) {
      const words = associationProfile.name.split(' ');
      return words.length > 1 ? `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase() : associationProfile.name.substring(0, 2).toUpperCase();
    }

    return 'Y';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Chat List - Left Sidebar */}
          <div className={cn('w-full md:w-96 lg:w-[400px] xl:w-[450px] 2xl:w-[500px] border-r bg-card flex flex-col', isMobile && !showChatList && 'hidden')}>
            {/* Desktop Header */}
            {!isMobile && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-semibold">Messages</h1>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
            )}

            {/* Chat Groups List - Scrollable */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      </div>
                      <div className="h-3 bg-muted rounded w-12 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filteredChatGroups.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                  <p className="text-muted-foreground mb-4 text-sm">Start chatting with associations by visiting their profile pages</p>
                  <Button asChild size="sm">
                    <a href="/associations">Browse Associations</a>
                  </Button>
                </div>
              ) : (
                <div className="p-2">
                  {filteredChatGroups.map(chatGroup => {
                    const otherParticipant = getOtherParticipant(chatGroup);

                    return (
                      <div
                        key={chatGroup.id}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
                          selectedChatGroup?.id === chatGroup.id && 'bg-muted',
                        )}
                        onClick={() => handleChatSelect(chatGroup)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={otherParticipant.avatarUrl || ''} alt={otherParticipant.name} />
                          <AvatarFallback>{otherParticipant.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{otherParticipant.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {otherParticipant.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {chatGroup.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                                  {chatGroup.unreadCount}
                                </Badge>
                              )}
                              {chatGroup.lastMessageAt && <span className="text-xs text-muted-foreground">{formatDate(chatGroup.lastMessageAt)}</span>}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {chatGroup.lastMessageAt ? `Last message ${formatDate(chatGroup.lastMessageAt)}` : `Created ${formatDate(chatGroup.createdAt)}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area - Right Side */}
          <div className={cn('flex-1 flex flex-col', isMobile && showChatList && 'hidden')}>
            {selectedChatGroup ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b bg-card">
                  <div className="flex items-center space-x-3">
                    {isMobile && (
                      <Button variant="ghost" size="icon" onClick={handleBackToList}>
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getOtherParticipant(selectedChatGroup).avatarUrl || ''} alt={getOtherParticipant(selectedChatGroup).name} />
                      <AvatarFallback>{getOtherParticipant(selectedChatGroup).name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{getOtherParticipant(selectedChatGroup).name}</p>
                      <p className="text-xs text-muted-foreground">{getOtherParticipant(selectedChatGroup).type}</p>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Messages Area - Scrollable with infinite scroll */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 scroll-smooth" style={{ overscrollBehavior: 'contain' }}>
                  {/* Loading indicator for older messages */}
                  {loadingMoreMessages && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {messagesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={cn('flex gap-3', index % 2 === 0 ? 'justify-end' : 'justify-start')}>
                          <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                          <div className="max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div key={message.id} className={cn('flex gap-3', isMyMessage(message) ? 'justify-end' : 'justify-start')}>
                          {!isMyMessage(message) && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={message.senderAvatarUrl || ''} alt={message.senderName} />
                              <AvatarFallback className="text-xs">{message.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          )}

                          <div className={cn('max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] rounded-lg p-3 shadow-sm', isMyMessage(message) ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            {!isMyMessage(message) && <p className="text-xs font-medium mb-1 opacity-70">{message.senderName}</p>}
                            <p className="text-sm">{message.content}</p>
                            <p className={cn('text-xs mt-1 opacity-70', isMyMessage(message) ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                              {formatTime(message.sentAt)}
                            </p>
                          </div>

                          {isMyMessage(message) && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={getCurrentUserAvatar()} alt={getCurrentUserName()} />
                              <AvatarFallback className="text-xs">{getCurrentUserInitial()}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-card">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sendingMessage}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim() || sendingMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              // No chat selected state
              <div className="flex-1 flex items-center justify-center bg-muted/10">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
