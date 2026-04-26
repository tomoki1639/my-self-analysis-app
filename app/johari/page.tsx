"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, EyeOff, User, Users, Info } from "lucide-react";

// 特徴タグのリスト
const ALL_TRAITS = [
    "責任感がある", "リーダーシップがある", "聞き上手", "慎重", "行動力がある",
    "論理的", "創造的", "素直", "真面目", "ユーモアがある",
    "冷静", "情熱的", "社交的", "こだわりが強い", "優しい",
    "几帳面", "好奇心旺盛", "忍耐強い", "ポジティブ", "柔軟性がある"
];

// 他人からの回答（モックデータ）
const MOCK_OTHERS_ANSWERS = ["責任感がある", "几帳面", "論理的", "冷静", "忍耐強い"];

export default function JohariPage() {
    const [selfSelected, setSelfSelected] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. 初回読み込み
    useEffect(() => {
        const saved = localStorage.getItem("johari-self-selected");
        if (saved) {
            setSelfSelected(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    // 2. 変更時に自動保存
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("johari-self-selected", JSON.stringify(selfSelected));
        }
    }, [selfSelected, isLoaded]);

    // 特徴をクリックした時の処理
    const toggleTrait = (trait: string) => {
        setSelfSelected(prev =>
            prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
        );
    };

    // 4つの窓の計算
    const windows = useMemo(() => {
        return {
            open: selfSelected.filter(t => MOCK_OTHERS_ANSWERS.includes(t)),      // 自分も他人も知っている
            blind: MOCK_OTHERS_ANSWERS.filter(t => !selfSelected.includes(t)),   // 他人だけが知っている
            hidden: selfSelected.filter(t => !MOCK_OTHERS_ANSWERS.includes(t)),   // 自分だけが知っている
            // 未知は今回は「誰にも選ばれなかったもの」からいくつか表示
            unknown: ALL_TRAITS.filter(t => !selfSelected.includes(t) && !MOCK_OTHERS_ANSWERS.includes(t)).slice(0, 3)
        };
    }, [selfSelected]);

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8">
                <h2 className="text-3xl font-bold">ジョハリの窓</h2>
                <p className="text-gray-500 mt-2">自己認識と他者認識を一致させ、まだ見ぬ自分の可能性を探りましょう。</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* 左側：特徴選択エリア */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <User size={20} className="text-indigo-500" />
                            自分の特徴を選択（5つ程度）
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {ALL_TRAITS.map(trait => (
                                <button
                                    key={trait}
                                    onClick={() => toggleTrait(trait)}
                                    className={`px-4 py-2 rounded-full text-sm transition-all ${selfSelected.includes(trait)
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {trait}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <p className="text-xs text-blue-800 leading-relaxed">
                            <strong>現在はシミュレーションモードです。</strong><br />
                            本来は友人に専用リンクを送って回答してもらいますが、現在はあらかじめ用意された「友人の評価（モック）」とあなたの回答を比較しています。
                        </p>
                    </div>
                </div>

                {/* 右側：窓の表示エリア */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 開放の窓 */}
                    <div className="bg-white p-5 rounded-2xl border-2 border-indigo-500 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600">
                            <Eye size={18} />
                            <h4 className="font-bold">開放の窓</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">自分も他人も認める強み</p>
                        <div className="flex flex-wrap gap-1">
                            {windows.open.map(t => <span key={t} className="bg-indigo-50 text-indigo-700 text-[11px] px-2 py-0.5 rounded border border-indigo-100">{t}</span>)}
                        </div>
                    </div>

                    {/* 盲点の窓 */}
                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-amber-600">
                            <Users size={18} />
                            <h4 className="font-bold">盲点の窓</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">自分は気づいていない強み</p>
                        <div className="flex flex-wrap gap-1">
                            {windows.blind.map(t => <span key={t} className="bg-amber-50 text-amber-700 text-[11px] px-2 py-0.5 rounded border border-amber-100">{t}</span>)}
                        </div>
                    </div>

                    {/* 秘密の窓 */}
                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-emerald-600">
                            <EyeOff size={18} />
                            <h4 className="font-bold">秘密の窓</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">他人には見せていない自分</p>
                        <div className="flex flex-wrap gap-1">
                            {windows.hidden.map(t => <span key={t} className="bg-emerald-50 text-emerald-700 text-[11px] px-2 py-0.5 rounded border border-emerald-100">{t}</span>)}
                        </div>
                    </div>

                    {/* 未知の窓 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-300">
                        <div className="flex items-center gap-2 mb-3 text-slate-500">
                            <Info size={18} />
                            <h4 className="font-bold">未知の窓</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">誰も知らない可能性</p>
                        <div className="flex flex-wrap gap-1 opacity-50">
                            {windows.unknown.map(t => <span key={t} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded">{t}</span>)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}