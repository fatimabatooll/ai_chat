
"use client"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white ml-12"
            : "bg-gradient-to-r from-teal-600 to-cyan-500 text-white mr-12 shadow-lg shadow-teal-500/20 animate-pulse-glow"
        }`}
      >
        <p
          className="
            text-sm leading-relaxed
            whitespace-pre-wrap break-words [overflow-wrap:anywhere] 
            min-w-0 overflow-x-auto
          "
        >
          {message.content}
        </p>

        <p className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
