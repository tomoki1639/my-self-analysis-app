# Self-Analysis Dashboard (自己分析ダッシュボード)

就職活動や自己研鑽のための、多角的な自己分析をサポートするWebアプリケーションです。

## 主な機能
- **ダッシュボード**: 各分析機能の進捗をリアルタイムでカウント
- **自分史**: 過去のエピソードを時系列で蓄積
- **モチベーショングラフ**: 人生の満足度を可視化
- **マインドマップ**: 強みと経験を構造化（React Flowを使用）
- **ジョハリの窓**: 自己認識と他者認識を整理

## 技術スタック
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Libraries**: React Flow (Mindmap), Recharts (Charts), html-to-image
- **Storage**: LocalStorage (ブラウザ内保存)

## 使い方
1. リポジトリをクローン
2. `npm install` で依存関係をインストール
3. `npm run dev` でローカルサーバーを起動