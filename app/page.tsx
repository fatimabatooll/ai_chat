"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatHeader } from "@/components/chat-header"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMessage } from "@/components/chat-message"
import { TypingIndicator } from "@/components/typing-indicator"
import { ChatInput } from "@/components/chat-input"
import { ChatFooter } from "@/components/chat-footer"

import { sendMessage } from "@/lib/chat"
import { fetchProfile } from "@/lib/auth"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await fetchProfile()
        console.log("👤 User Profile:", profile)
        setUserProfile(profile)
      } catch (error) {
        console.error(" Failed to fetch profile:", error)
      }
    }

    getProfile()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await sendMessage(userMessage.content)
      console.log("🤖 AI Response:", response)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response?.reply || "⚠️ AI returned no reply.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat API Error:", error)
      const fallback: Message = {
        id: (Date.now() + 2).toString(),
        content: "⚠️ Something went wrong while contacting the assistant.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallback])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
    {/* Sidebar */}
    <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    {/* Main Chat */}
    <div className="flex-1 flex flex-col">
      <ChatHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={userProfile} />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        disabled={isTyping}
      />

      <ChatFooter />
    </div>
  </div>
  )
}
