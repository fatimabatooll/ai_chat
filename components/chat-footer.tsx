"use client"

export function ChatFooter() {
  return (
    <footer className="p-4 text-center border-t border-teal-500/20 bg-gray-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center items-center space-x-4 text-xs text-gray-400 mb-2">
          <a href="#" className="hover:text-teal-400 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-teal-400 transition-colors">
            Terms of Use
          </a>
          <span>•</span>
          <a href="#" className="hover:text-teal-400 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-xs text-gray-500">© 2025 AI Assistant. All rights reserved.</p>
      </div>
    </footer>
  )
}
