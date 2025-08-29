"use client"

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-2xl px-4 py-3 mr-12 shadow-lg shadow-teal-500/20">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
