"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Bookmark, HelpCircle, Phone, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  return (
    <>
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-teal-500/20 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-teal-500/20">
            <h2 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              AI Chat
            </h2>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-teal-500/20"
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-teal-500/20"
            >
              <Bookmark className="mr-3 h-4 w-4" />
              Saved Chats
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-teal-500/20"
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              FAQs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-teal-500/20"
            >
              <Phone className="mr-3 h-4 w-4" />
              Contact Support
            </Button>
            <div className="pt-4 border-t border-teal-500/20">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-teal-500/20"
                >
                  <LogIn className="mr-3 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-teal-500/20"
                >
                  <UserPlus className="mr-3 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-teal-500/20">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-teal-600 text-white">U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">User Profile</p>
                <p className="text-xs text-gray-400">Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}
    </>
  )
}
