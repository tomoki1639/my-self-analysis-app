"use client";

import { useState, useEffect } from "react";

// 型定義（以前と同じ）
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
  const [isLoaded, setIsLoaded] = useState(false); // マウント確認用

  // 1. 初回マウント時に localStorage から読み込み
  useEffect(() => {
    const saved = localStorage.getItem("self-analysis-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    setIsLoaded(true); // 読み込み完了
  }, []);

  // 2. history が更新されるたびに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("self-analysis-history", JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // フォームの状態
  const [age, setAge] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [fact, setFact] = useState("");
  const [emotion, setEmotion] = useState("");
  const [learning, setLearning] = useState("");

  // 追加処理（メモリ内のStateを更新するだけ）
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (age === "" || !title.trim()) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(), // 簡易的なID生成
      age: Number(age),
      title: title.trim(),
      fact,
      emotion,
      learning,
    };

    // 年齢順に並び替えてセット
    setHistory([...history, newItem].sort((a, b) => a.age - b.age));

    // フォームをクリア
    setAge("");
    setTitle("");
    setFact("");
    setEmotion("");
    setLearning("");
  };

  // 削除処理
  const handleDelete = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">自分史</h2>
      </header>

      {/* 入力フォーム */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-12 border-t-4 border-t-indigo-500">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="w-full border rounded-lg p-2 outline-none"
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
                className="w-full border rounded-lg p-2 outline-none"
                placeholder="例: サークルでの活動"
                required
              />
            </div>
          </div>
          <textarea
            value={fact}
            onChange={(e) => setFact(e.target.value)}
            className="w-full border rounded-lg p-2 h-20 outline-none resize-none"
            placeholder="事実・行動"
          />
          <textarea
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="w-full border rounded-lg p-2 h-20 outline-none resize-none"
            placeholder="感情・思考"
          />
          <textarea
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
            className="w-full border rounded-lg p-2 h-20 outline-none resize-none"
            placeholder="学び・強み"
          />
          <div className="text-right">
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-indigo-700">
              追加
            </button>
          </div>
        </form>
      </div>

      {/* 表示リスト */}
      <div className="space-y-6 border-l-2 border-indigo-100 ml-4 pl-6">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border shadow-sm relative">
            <div className="absolute -left-[35px] top-1 bg-white border-4 border-indigo-500 w-6 h-6 rounded-full"></div>
            <div className="flex justify-between items-start">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">{item.age}歳</span>
              <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 text-sm">削除</button>
            </div>
            <h4 className="text-lg font-bold mt-2">{item.title}</h4>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>事実:</strong> {item.fact}</p>
              <p><strong>感情:</strong> {item.emotion}</p>
              <p><strong>学び:</strong> {item.learning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}