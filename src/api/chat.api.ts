import { api } from "../lib/api";

export interface ChatMessageItem {
  id: string;
  chatSessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ChatSessionItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: {
    content: string;
    createdAt: string;
    role: string;
  } | null;
  messages?: ChatMessageItem[];
}

export const chatApi = {
  getSessions: async (): Promise<ChatSessionItem[]> => {
    const res = await api.get<ChatSessionItem[]>("/chat/sessions");
    return res.data;
  },

  createSession: async (title?: string): Promise<ChatSessionItem> => {
    const res = await api.post<ChatSessionItem>("/chat/sessions", { title });
    return res.data;
  },

  getSession: async (sessionId: string): Promise<ChatSessionItem> => {
    const res = await api.get<ChatSessionItem>(`/chat/sessions/${sessionId}`);
    return res.data;
  },

  deleteSession: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete<{ success: boolean; message: string }>(`/chat/sessions/${sessionId}`);
    return res.data;
  },

  sendMessage: async (sessionId: string, content: string): Promise<ChatMessageItem> => {
    const res = await api.post<ChatMessageItem>(`/chat/sessions/${sessionId}/messages`, { content });
    return res.data;
  },
};
