"use client";

import { useState, useMemo, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Dot,
} from "recharts";

// 型定義
type DataPoint = {
    age: number;
    score: number;
    event: string;
};

export default function MotivationPage() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("self-analysis-motivation");
        if (saved) {
            setData(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("self-analysis-motivation", JSON.stringify(data));
        }
    }, [data, isLoaded]);

    // 入力フォームの状態
    const [age, setAge] = useState<number | "">("");
    const [score, setScore] = useState<number>(0);
    const [event, setEvent] = useState("");

    // 年齢順にデータを並び替えてグラフに渡す
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => a.age - b.age);
    }, [data]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (age === "" || !event) return;

        const newPoint: DataPoint = { age: Number(age), score, event };
        setData([...data, newPoint]);

        // リセット
        setAge("");
        setScore(0);
        setEvent("");
    };

    const removePoint = (age: number) => {
        setData(data.filter((p) => p.age !== age));
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8">
                <h2 className="text-3xl font-bold">モチベーショングラフ</h2>
                <p className="text-gray-500 mt-2">人生の満足度の推移を可視化して、自分の価値観の源泉を見つけましょう。</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左側：入力フォーム */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span>✨</span> エピソードを追加
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">年齢</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                                    className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">満足度 ({score})</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={score}
                                    onChange={(e) => setScore(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>どん底 (-100)</span>
                                    <span>最高 (100)</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">出来事</label>
                                <input
                                    type="text"
                                    value={event}
                                    onChange={(e) => setEvent(e.target.value)}
                                    className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: プロジェクト成功"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                追加する
                            </button>
                        </form>
                    </div>

                    {/* 記録一覧 */}
                    <div className="bg-white p-6 rounded-2xl border shadow-sm max-h-[400px] overflow-y-auto">
                        <h3 className="font-bold mb-4">記録リスト</h3>
                        <div className="space-y-3">
                            {sortedData.map((p) => (
                                <div key={p.age} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                                    <div>
                                        <span className="font-bold text-blue-600">{p.age}歳</span>
                                        <p className="text-gray-700 truncate w-32 md:w-48">{p.event}</p>
                                    </div>
                                    <button onClick={() => removePoint(p.age)} className="text-gray-400 hover:text-red-500">
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 右側：グラフ表示 */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm min-h-[400px]">
                    <h3 className="font-bold mb-6">ライフライン・チャート</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="age"
                                    type="number"
                                    domain={['dataMin - 2', 'dataMax + 2']}
                                    height={50}
                                    label={{ value: '年齢', position: 'insideBottomRight', offset: -10 }}
                                />
                                <YAxis domain={[-100, 100]} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 border shadow-lg rounded-lg">
                                                    <p className="font-bold text-blue-600">{d.age}歳</p>
                                                    <p className="text-sm font-bold">{d.event}</p>
                                                    <p className="text-xs text-gray-500 text-right">満足度: {d.score}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                {/* 満足度0の基準線 */}
                                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                    animationDuration={1000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}