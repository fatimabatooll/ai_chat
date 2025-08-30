"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat-header";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMessage } from "@/components/chat-message";
import { TypingIndicator } from "@/components/typing-indicator";
import { ChatInput } from "@/components/chat-input";
import { ChatFooter } from "@/components/chat-footer";
import { wsBase, titleFromMessage } from "@/lib/utils";
import { activateConversation, createConversation } from "@/lib/chat";
import { Button } from "@/components/ui/button";

type BaseMsg = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

type Product = {
  title: string;         // backend uses "title"
  price?: string;
  platform: string;
  url: string;
  image: string;
};

type MessageEventFromServer = {
  type: "message";
  content: string;
  products?: Product[];  // optional
};
type OptionsEventFromServer = {
  type: "product_options";
  options: Product[];
};
type ErrorEventFromServer = {
  type: "error";
  message: string;
};
type ServerEvent =
  | MessageEventFromServer
  | OptionsEventFromServer
  | ErrorEventFromServer;

function isMessage(e: any): e is MessageEventFromServer {
  return e && e.type === "message" && typeof e.content === "string";
}
function isOptions(e: any): e is OptionsEventFromServer {
  return e && e.type === "product_options" && Array.isArray(e.options);
}
function isError(e: any): e is ErrorEventFromServer {
  return e && e.type === "error" && typeof e.message === "string";
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<BaseMsg[]>([
    {
      id: "hello",
      content: "Hello! I'm your AI Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [productOptions, setProductOptions] = useState<Product[] | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const isWsOpen = wsRef.current?.readyState === WebSocket.OPEN;

  const bottomRef = useRef<HTMLDivElement>(null);
  const token = Cookies.get("access_token") || ""; // SSR-safe

  // keep the chat scrolled to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, productOptions, isTyping]);

  // open websocket AFTER conversation is active
  const openSocket = () => {
    if (!token) return console.warn("No token; login first.");
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const url = `${wsBase()}/ws/chat?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      let data: unknown;
      try {
        data = JSON.parse(ev.data as string);
      } catch {
        // show raw non-JSON
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), content: String(ev.data), isUser: false, timestamp: new Date() },
        ]);
        setIsTyping(false);
        return;
      }

      if (isMessage(data)) {
        // render assistant text
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), content: data.content, isUser: false, timestamp: new Date() },
        ]);
        // if products included inside the message, render them under the message area
        if (Array.isArray(data.products) && data.products.length) {
          setProductOptions(data.products);
        }
        setIsTyping(false);
        return;
      }

      if (isOptions(data)) {
        setProductOptions(data.options);
        setIsTyping(false);
        return;
      }

      if (isError(data)) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), content: `⚠️ ${data.message}`, isUser: false, timestamp: new Date() },
        ]);
        setIsTyping(false);
        return;
      }

      // unknown payload -> stringify briefly
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), content: JSON.stringify(data), isUser: false, timestamp: new Date() },
      ]);
      setIsTyping(false);
    };

    ws.onclose = () => {
      setTimeout(() => {
        if (conversationId) openSocket();
      }, 1500);
    };

    ws.onerror = () => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), content: "⚠️ WebSocket error.", isUser: false, timestamp: new Date() },
      ]);
      setIsTyping(false);
    };
  };

  // send any payload over WS
  const sendWs = (payload: any) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),
          content: "⚠️ Connection not ready. Reconnecting...",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      openSocket();
      return;
    }
    ws.send(JSON.stringify(payload));
  };

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text) return;

    // push user bubble immediately
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: text, isUser: true, timestamp: new Date() },
    ]);
    setInputValue("");
    setIsTyping(true);
    setProductOptions(null);

    try {
      if (!conversationId) {
        const title = titleFromMessage(text);
        const conv = await createConversation(title);
        const newId = (conv?.id ?? conv?.data?.id ?? "").toString();
        if (newId) {
          setConversationId(newId);
          await activateConversation(newId);
        }
        openSocket();
      } else if (!isWsOpen) {
        openSocket();
      }

      sendWs({ type: "message", text }); // backend accepts this as your chat input
    } catch (e: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `⚠️ ${e?.message || "Failed to send."}`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSelectProduct = (p: Product) => {
    sendWs({
      type: "select_product",
      selected: {
        name: p.title,          // map title -> name for server
        platform: p.platform,
        url: p.url,
        image: p.image,
      },
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: `✅ Selected: ${p.title} (${p.platform})`,
        isUser: true,
        timestamp: new Date(),
      },
    ]);
    setProductOptions(null);
    setIsTyping(true);
  };

  useEffect(() => {
    if (conversationId && !isWsOpen) openSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <div className="flex h-screen bg-black text-white">
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <ChatHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* main scrollable area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}

            {/* product cards section (scrolls if long) */}
            {productOptions && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-1">
                {productOptions.map((p, idx) => (
                  <div key={idx} className="bg-gray-800/70 rounded-xl p-3 border border-teal-500/20">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="text-sm font-semibold mb-1 line-clamp-2">{p.title}</div>
                    {p.price && <div className="text-xs text-gray-300 mb-1">{p.price}</div>}
                    <div className="text-xs text-gray-400 mb-3">{p.platform}</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => handleSelectProduct(p)}
                      >
                        Select
                      </Button>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline text-cyan-300 pt-2"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTyping && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <ChatFooter />
      </div>
    </div>
  );
}
