"use client"

import { Button } from "@/components/ui/button"
import { Settings, HelpCircle, User, Menu } from "lucide-react"
import Link from "next/link"

interface ChatHeaderProps {
  onToggleSidebar: () => void
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-teal-500/20 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-gray-300 hover:text-white"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-sm text-gray-400">Powered by AI. Designed for You.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-teal-500/20">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-teal-500/20">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Link href="/login">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-teal-500/20">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
