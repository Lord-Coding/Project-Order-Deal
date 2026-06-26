// Type de notification
export type NotificationType = 
  | "order_status"
  | "promotion"
  | "system"
  | "chat"
  | "rating_request";

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>; // Données additionnelles (orderId, etc.)
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// Message de chat support
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "client" | "admin" | "system";
  senderName: string;
  message: string;
  attachments?: ChatAttachment[];
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface ChatAttachment {
  id: string;
  type: "image" | "file";
  url: string;
  name: string;
  size: number;
}

// Conversation de support
export interface ChatConversation {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  orderId?: string; // Si lié à une commande
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  assignedTo?: string; // ID admin
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// Présence en temps réel (Realtime Database)
export interface UserPresence {
  oderId: string;
  isOnline: boolean;
  lastSeen: Date;
  currentPage?: string;
}

// DTO pour envoi de message
export interface SendMessageDTO {
  conversationId: string;
  message: string;
  attachments?: File[];
}

// DTO pour création de notification
export interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}
