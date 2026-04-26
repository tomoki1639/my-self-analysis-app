"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800 min-h-screen">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* モバイル用ヘッダー（PCでは隠す） */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-200">
          <h1 className="font-bold text-indigo-600">Self-Analysis</h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* メインコンテンツエリア */}
        <main className={`
          transition-all duration-300
          md:ml-64 p-4 md:p-8
        `}>
          <div className="max-w-6xl mx-auto mt-4 md:mt-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}