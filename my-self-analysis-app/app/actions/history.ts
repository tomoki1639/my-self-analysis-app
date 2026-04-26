// app/actions/history.ts
"use server";

import prisma from "@/lib/prisma";

// 先ほど作成したテストユーザーのIDを固定で使用します
const TEST_USER_ID = "test-user-id";

// ① 全件取得（年齢順）
export async function getHistories() {
  return await prisma.history.findMany({
    where: { userId: TEST_USER_ID },
    orderBy: { age: 'asc' }, // 年齢の昇順で並び替え
  });
}

// ② 新規追加
export async function addHistory(data: {
  age: number;
  title: string;
  fact: string;
  emotion: string;
  learning: string;
}) {
  const newHistory = await prisma.history.create({
    data: {
      ...data,
      userId: TEST_USER_ID, // テストユーザーと紐付け
    },
  });
  return newHistory;
}

// ③ 削除
export async function deleteHistory(id: string) {
  await prisma.history.delete({
    where: { id },
  });
  return { success: true };
}