import Cookies from "js-cookie";
import { httpBase } from "@/lib/utils"; // make sure this path matches your alias

const base = httpBase();

function authHeaders(): Record<string, string> {
  const token = Cookies.get("access_token") || localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createConversation(title: string) {
  const res = await fetch(`${base}/api/v1/chat/history/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),           // <-- call it
    } as HeadersInit,
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Create conversation failed: ${res.status}`);
  return res.json();
}

export async function getConversations() {
  const res = await fetch(`${base}/api/v1/chat/history/conversations`, {
    headers: authHeaders() as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`List conversations failed: ${res.status}`);
  return res.json();
}

export async function getMessages(conversationId: string) {
  const res = await fetch(`${base}/api/v1/chat/history/conversations/${conversationId}/messages`, {
    headers: authHeaders() as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Get messages failed: ${res.status}`);
  return res.json();
}

export async function activateConversation(conversationId: string) {
  const res = await fetch(`${base}/api/v1/chat/history/conversations/${conversationId}/activate`, {
    method: "POST",
    headers: authHeaders() as HeadersInit,
  });
  if (!res.ok) throw new Error(`Activate conversation failed: ${res.status}`);
  return res.json();
}
