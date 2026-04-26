"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  Brain,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";


export default function DashboardPage() {
  // 各機能のステータスを管理するState
  const [counts, setCounts] = useState({
    history: 0,
    motivation: 0,
    mindmap: 0,
    johari: 0
  });

  useEffect(() => {
    // LocalStorageからデータを取得してカウント
    const h = JSON.parse(localStorage.getItem("self-analysis-history") || "[]");
    const m = JSON.parse(localStorage.getItem("self-analysis-motivation") || "[]");
    const mmNodes = JSON.parse(localStorage.getItem("mindmap-nodes") || "[]");
    const j = JSON.parse(localStorage.getItem("johari-self-selected") || "[]");

    setCounts({
      history: h.length,
      motivation: m.length > 0 ? 1 : 0, // データがあれば「作成済み」とする
      mindmap: mmNodes.length,
      johari: j.length
    });
  }, []);

  // 動的な値を反映させた stats 配列
  const stats = [
    {
      name: "自分史",
      description: "過去の経験を洗い出し、エピソードを蓄積します。",
      href: "/history",
      icon: BookOpen,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
      status: `${counts.history} 件のエピソード`,
      lastUpdated: counts.history > 0 ? "最近更新" : "未登録",
    },
    {
      name: "モチベーショングラフ",
      description: "人生の満足度の波を可視化し、価値観を探ります。",
      href: "/motivation",
      icon: TrendingUp,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      status: counts.motivation > 0 ? "グラフ作成済み" : "未作成",
      lastUpdated: counts.motivation > 0 ? "保存済み" : "-",
    },
    {
      name: "マインドマップ",
      description: "強みや価値観を深掘りし、構造化します。",
      href: "/mindmap",
      icon: Brain,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-700",
      status: `${counts.mindmap} 個のキーワード`,
      lastUpdated: counts.mindmap > 7 ? "分析が進んでいます" : "分析中",
    },
    {
      name: "ジョハリの窓",
      description: "他者からの評価を集め、客観的な自己を把握します。",
      href: "/johari",
      icon: Users,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      status: counts.johari > 0 ? `${counts.johari} 個の自己認識` : "未実施",
      lastUpdated: counts.johari > 0 ? "診断中" : "-",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ヒーローセクション */}
      <header>
        <h2 className="text-3xl font-bold text-slate-800">ダッシュボード</h2>
        <p className="text-slate-500 mt-2">
          自己分析の進捗を確認しましょう。一貫性のあるエピソードが内定への近道です。
        </p>
      </header>

      {/* ステータスカードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 relative overflow-hidden"
          >
            {/* 装飾用の背景アクセント */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${item.lightColor} opacity-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${item.color} text-white shadow-lg shadow-indigo-200`}>
                  <item.icon size={24} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Clock size={14} />
                  {item.lastUpdated}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className={`flex items-center gap-1.5 text-sm font-bold ${item.textColor}`}>
                  <CheckCircle2 size={16} />
                  {item.status}
                </div>
                <div className="text-indigo-600 flex items-center gap-1 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  詳細を見る
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* クイックアクション or Tips セクション */}
      <section className="bg-indigo-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-200 group">
        {/* 背景の装飾（より大きく、少し傾ける） */}
        <div className="absolute right-[-40px] bottom-[-60px] opacity-10 pointer-events-none rotate-12 transition-transform group-hover:rotate-6 duration-700">
          <Brain size={320} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg text-xl">💡</span>
              自己分析のヒント
            </h3>
            <p className="text-indigo-100 text-base leading-relaxed opacity-90">
              マインドマップで繋がった「強み」と「エピソード」を、自分史の「事実・行動」に書き込んでみましょう。
              具体的な行動事実があることで、面接官に納得感を与えることができます。
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/history"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-3 group/btn"
            >
              今すぐ自分史を更新する
              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}