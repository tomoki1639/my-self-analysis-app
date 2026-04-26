// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 指定したIDのユーザーがいなければ作成、いれば何もしない（upsert）
  const user = await prisma.user.upsert({
    where: { id: 'test-user-id' }, // 後で使いやすいようにIDを固定
    update: {},
    create: {
      id: 'test-user-id',
      name: 'テストユーザー',
    },
  });
  console.log("✅ テストユーザーを作成/確認しました:", user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });