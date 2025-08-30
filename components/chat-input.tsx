"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Upload } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export function ChatInput({ value, onChange, onSend, onKeyPress }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-teal-500/20 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Ask me anything..."
              className="bg-gray-800 border-teal-500/30 text-white placeholder-gray-400 rounded-2xl pr-24 py-3 focus:border-teal-400 focus:ring-teal-400/20"
            />
            {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-teal-500/20"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-teal-500/20"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
          <Button
            onClick={onSend}
            disabled={!value.trim()}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl px-6 py-3 shadow-lg shadow-teal-500/20 transition-all duration-200 hover:shadow-teal-500/30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
