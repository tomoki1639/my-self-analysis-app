"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, TrendingUp, Brain, Users, X 
} from "lucide-react";

// プロップスの型定義
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "ダッシュボード", href: "/", icon: LayoutDashboard },
  { name: "自分史", href: "/history", icon: BookOpen },
  { name: "モチベーショングラフ", href: "/motivation", icon: TrendingUp },
  { name: "マインドマップ", href: "/mindmap", icon: Brain },
  { name: "ジョハリの窓", href: "/johari", icon: Users },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* モバイル用オーバーレイ（背景の暗幕） */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* サイドバー本体 */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}>
        {/* ロゴエリア */}
        <div className="p-6 mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm">S</div>
            Self-Analysis
          </h1>
          {/* モバイル用閉じるボタン */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // リンククリック時に閉じる
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "hover:bg-slate-800"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* プロフィール */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">U</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Guest User</p>
              <p className="text-xs text-slate-500 truncate">Self-Analysis Mode</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}