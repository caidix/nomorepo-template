if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(
    `\u001b[33m该仓库推荐采用pnpm来进行依赖管理 ` +
      ` 请使用pnpm来进行本地作业.\u001b[39m\n`
  );
  process.exit(1);
}
