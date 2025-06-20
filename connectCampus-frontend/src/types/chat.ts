export interface IChatGroup {
  id: string;
  studentId: string;
  associationId: string;
  eventId?: string;
  createdAt: string;
  lastMessageAt?: string;
  unreadCount: number;
  studentName?: string;
  studentAvatarUrl?: string;
  associationName?: string;
  associationAvatarUrl?: string;
}

export interface IChatMessage {
  id: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  
  // Sender profile information
  senderName: string;
  senderAvatarUrl?: string;
  senderType: 'Student' | 'Association';
}

export interface IChatRequest {
  studentId: string;
  associationId: string;
  eventId?: string;
}

export interface IMessageRequest {
  message: string;
} 