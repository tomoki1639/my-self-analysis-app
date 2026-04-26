"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Save, X } from "lucide-react";

// 型定義
type HistoryItem = {
  id: string;
  age: number;
  title: string;
  fact: string;
  emotion: string;
  learning: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // フォームの状態（こちらに一本化します）
  const [age, setAge] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [fact, setFact] = useState("");
  const [emotion, setEmotion] = useState("");
  const [learning, setLearning] = useState("");

  // 編集中のアイテムIDを管理
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. 初回読み込み
  useEffect(() => {
    const saved = localStorage.getItem("self-analysis-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // 2. 自動保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("self-analysis-history", JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // 入力フォームを空にする共通関数
  const clearForm = () => {
    setAge("");
    setTitle("");
    setFact("");
    setEmotion("");
    setLearning("");
    setEditingId(null);
  };

  // 追加または更新の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age === "" || !title.trim()) return;

    if (editingId) {
      // --- 更新処理 ---
      setHistory((prev) =>
        prev
          .map((item) =>
            item.id === editingId
              ? {
                  id: editingId,
                  age: Number(age),
                  title: title.trim(),
                  fact,
                  emotion,
                  learning,
                }
              : item
          )
          .sort((a, b) => a.age - b.age)
      );
    } else {
      // --- 新規追加処理 ---
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        age: Number(age),
        title: title.trim(),
        fact,
        emotion,
        learning,
      };
      setHistory((prev) => [...prev, newItem].sort((a, b) => a.age - b.age));
    }

    clearForm();
  };

  // 編集モードに入る処理
  const startEdit = (item: HistoryItem) => {
    setAge(item.age);
    setTitle(item.title);
    setFact(item.fact);
    setEmotion(item.emotion);
    setLearning(item.learning);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 削除処理
  const handleDelete = (id: string) => {
    if (window.confirm("このエピソードを削除しますか？")) {
      setHistory(history.filter((item) => item.id !== id));
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">自分史</h2>
      </header>

      {/* 入力フォーム */}
      <div
        className={`p-6 rounded-xl border shadow-sm mb-12 border-t-4 transition-all ${
          editingId ? "border-t-amber-500 bg-amber-50/30" : "border-t-indigo-500 bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? "エピソードを編集" : "新しいエピソードを追加"}
          </h3>
          {editingId && (
            <button onClick={clearForm} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
              <X size={16} /> 編集をキャンセル
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: 20"
                required
              />
            </div>
            <div className="w-full md:w-3/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: サークルでの活動"
                required
              />
            </div>
          </div>
          <textarea
            value={fact}
            onChange={(e) => setFact(e.target.value)}
            className="w-full border rounded-lg p-2 h-20 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            placeholder="事実・行動（何をしたか）"
          />
          <textarea
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="w-full border rounded-lg p-2 h-20 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            placeholder="感情・思考（どう感じ、どう考えたか）"
          />
          <textarea
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
            className="w-full border rounded-lg p-2 h-20 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            placeholder="学び・強み（何を得たか、何に繋がったか）"
          />
          <div className="text-right">
            <button
              type="submit"
              className={`font-bold py-2 px-10 rounded-lg transition-all flex items-center gap-2 ml-auto text-white shadow-md ${
                editingId ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? "変更を保存" : "追加する"}
            </button>
          </div>
        </form>
      </div>

      {/* 表示リスト */}
      <div className="space-y-6 border-l-2 border-indigo-100 ml-4 pl-6">
        {history.length === 0 && <p className="text-gray-400 text-sm">エピソードを登録して、自分史を構築しましょう。</p>}
        {history.map((item) => (
          <div key={item.id} className="group bg-white p-6 rounded-xl border shadow-sm relative hover:border-indigo-300 transition-colors">
            <div className="absolute -left-[35px] top-1 bg-white border-4 border-indigo-500 w-6 h-6 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
            
            <div className="flex justify-between items-start">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                {item.age}歳
              </span>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-xs">
                  <Edit2 size={14} /> 編集
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-xs">
                  <Trash2 size={14} /> 削除
                </button>
              </div>
            </div>

            <h4 className="text-lg font-bold mt-2 text-slate-800">{item.title}</h4>
            
            <div className="mt-4 space-y-3 text-sm">
              {item.fact && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-400 text-[10px] uppercase mb-1">Fact</p>
                  <p className="text-slate-600 leading-relaxed">{item.fact}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.emotion && (
                  <div className="p-3 border border-slate-100 rounded-lg">
                    <p className="font-bold text-slate-400 text-[10px] uppercase mb-1">Emotion</p>
                    <p className="text-slate-600 leading-relaxed">{item.emotion}</p>
                  </div>
                )}
                {item.learning && (
                  <div className="p-3 border border-indigo-50 rounded-lg bg-indigo-50/30">
                    <p className="font-bold text-indigo-300 text-[10px] uppercase mb-1">Learning</p>
                    <p className="text-slate-700 leading-relaxed font-medium">{item.learning}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}