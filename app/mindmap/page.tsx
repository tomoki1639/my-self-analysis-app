"use client";

import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import "@xyflow/react/dist/style.css";
import { Brain, Plus, Download, Save, RotateCcw } from "lucide-react";

// --- デザイン設定 ---
const styles = {
  core: { background: "#4f46e5", color: "#fff", fontWeight: "bold", borderRadius: "12px", padding: "15px 30px", border: "none", boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" },
  strength: { background: "#fff", border: "2px solid #818cf8", color: "#3730a3", borderRadius: "10px", padding: "10px 20px", fontWeight: "bold", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  episode: { background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
};

// --- 初期データの設定 ---
const initialNodes: Node[] = [
  { id: "center", position: { x: 400, y: 300 }, data: { label: "コアの価値観" }, style: styles.core },
  { id: "strength1", position: { x: 150, y: 150 }, data: { label: "粘り強さ・継続力" }, style: styles.strength },
  { id: "strength2", position: { x: 650, y: 200 }, data: { label: "論理的思考・分析力" }, style: styles.strength },
  { id: "strength3", position: { x: 400, y: 500 }, data: { label: "知的好奇心" }, style: styles.strength },
  { id: "ep1", position: { x: -50, y: 50 }, data: { label: "LoRaWANの認証プロセス最適化" }, style: styles.episode },
  { id: "ep2", position: { x: 850, y: 100 }, data: { label: "Pythonを用いた通信ボトルネック特定" }, style: styles.episode },
  { id: "ep3", position: { x: 400, y: 650 }, data: { label: "CTF（セキュリティコンテスト）参加" }, style: styles.episode },
];

const initialEdges: Edge[] = [
  { id: "e-c-s1", source: "center", target: "strength1", animated: true, style: { stroke: "#818cf8", strokeWidth: 3 } },
  { id: "e-c-s2", source: "center", target: "strength2", animated: true, style: { stroke: "#818cf8", strokeWidth: 3 } },
  { id: "e-c-s3", source: "center", target: "strength3", animated: true, style: { stroke: "#818cf8", strokeWidth: 3 } },
  { id: "e-s1-ep1", source: "strength1", target: "ep1", style: { stroke: "#cbd5e1", strokeWidth: 2 } },
  { id: "e-s2-ep2", source: "strength2", target: "ep2", style: { stroke: "#cbd5e1", strokeWidth: 2 } },
  { id: "e-s3-ep3", source: "strength3", target: "ep3", style: { stroke: "#cbd5e1", strokeWidth: 2 } },
];

export default function MindmapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. ロード処理
  useEffect(() => {
    const savedNodes = localStorage.getItem("mindmap-nodes");
    const savedEdges = localStorage.getItem("mindmap-edges");

    if (savedNodes && savedEdges) {
      try {
        setNodes(JSON.parse(savedNodes));
        setEdges(JSON.parse(savedEdges));
      } catch (e) {
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // 2. 自動保存処理
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mindmap-nodes", JSON.stringify(nodes));
      localStorage.setItem("mindmap-edges", JSON.stringify(edges));
    }
  }, [nodes, edges, isLoaded]);

  // 3. 各種関数（コンポーネント直下に配置）
  const resetToInitial = () => {
    if (window.confirm("全てのデータを消去し、真っ白な状態から開始しますか？")) {
      localStorage.removeItem("mindmap-nodes");
      localStorage.removeItem("mindmap-edges");
      setNodes([initialNodes[0]]);
      setEdges([]);
    }
  };

  const onDownloadImage = () => {
    const element = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!element) return;
    toPng(element, { backgroundColor: "#ffffff", width: 1200, height: 800 })
      .then((dataUrl) => download(dataUrl, "my-mindmap.png"));
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: "#94a3b8", strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;
    const newNode = {
      id: `node-${Date.now()}`,
      position: { x: 400, y: 300 },
      data: { label: newNodeLabel },
      style: styles.episode,
    };
    setNodes((nds) => nds.concat(newNode));
    setNewNodeLabel("");
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-6 space-y-4">
      {/* ヘッダーエリア */}
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="text-indigo-600" />
            マインドマップ
          </h2>
          <p className="text-gray-500 mt-2">強みと経験を結びつけ、ブラウザに自動保存されます。</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetToInitial}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition shadow-sm"
          >
            <RotateCcw size={18} />
            リセット
          </button>
          <button
            onClick={onDownloadImage}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-sm"
          >
            <Download size={18} />
            画像保存
          </button>
        </div>
      </header>

      {/* 操作パネルエリア */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="md:col-span-3 bg-white p-4 rounded-xl border shadow-sm flex items-end gap-4 border-l-4 border-l-indigo-500">
          <form onSubmit={handleAddNode} className="flex flex-1 gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">New Element</label>
              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                className="w-full border-slate-200 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="新しいキーワードを入力..."
              />
            </div>
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition self-end">
              <Plus size={24} />
            </button>
          </form>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
          <Save size={20} className="text-emerald-500 shrink-0" />
          <p className="text-[11px] text-emerald-700 font-bold leading-tight">
            自動保存中
          </p>
        </div>
      </div>

      {/* キャンバスエリア */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#f1f5f9" variant={BackgroundVariant.Lines} />
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
}