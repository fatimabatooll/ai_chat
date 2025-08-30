// lib/chat.ts
import { api } from "./api";
import Cookies from "js-cookie";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export async function sendMessage(message: string): Promise<any> {
  const token = Cookies.get("access_token");
  const type = Cookies.get("token_type") || "Bearer";

  try {
    const res = await api.post(
      "/api/v1/chat/",
      { message },
      {
        headers: {
          Authorization: `${type} ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getConversations(): Promise<Conversation[]> {
  const token = Cookies.get("access_token");
  const type = Cookies.get("token_type") || "Bearer";

  try {
    const res = await api.get("/api/v1/chat/history/conversations", {
      headers: {
        Authorization: `${type} ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

export async function createConversation(): Promise<Conversation> {
  const token = Cookies.get("access_token");
  const type = Cookies.get("token_type") || "Bearer";

  try {
    const res = await api.post("/api/v1/chat/history/conversations", {}, {
      headers: {
        Authorization: `${type} ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const token = Cookies.get("access_token");
  const type = Cookies.get("token_type") || "Bearer";

  try {
    const res = await api.get(`/api/v1/chat/history/conversations/${conversationId}/messages`, {
      headers: {
        Authorization: `${type} ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    throw error;
  }
}

export async function activateConversation(conversationId: string): Promise<any> {
  const token = Cookies.get("access_token");
  const type = Cookies.get("token_type") || "Bearer";

  try {
    const res = await api.post(`/api/v1/chat/history/conversations/${conversationId}/activate`, {}, {
      headers: {
        Authorization: `${type} ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error activating conversation:", error);
    throw error;
  }
}

export async function findSimilarProducts(name: string, image: string, platform: string): Promise<any> {
  const token = Cookies.get("access_token");
  const type = Cookies.get("token_type") || "Bearer";

  try {
    const res = await api.post("/api/v1/chat/find-similar-products", 
      { name, image, platform },
      {
        headers: {
          Authorization: `${type} ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error finding similar products:", error);
    throw error;
  }
}