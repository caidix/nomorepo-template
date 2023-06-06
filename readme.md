# yarn-lerna-template"

## 本地开发（Development）

### 克隆仓库

```
git clone xxxx
```

### 首次开发

- 全局安装 lerna `yarn global add lerna`
- 修改根目录及子包目录`package.json` 中 `name`、`main`、`module`、`repository`、`author` 的值，其中 `main`、`module` 可不改；
- 删除原 README.md 内容，书写自己的 README.md；
- `lerna bootstrap` 安装所有依赖及本地包依赖
- `yarn dev` 开发模式
- `yarn build` 打包构建
- git add . && git commit -m 'feat: xxxx'
- `yarn version:xxx` 生成需要发包的版本并打上 tag，代码提交到远程

### N 次开发

- 修改 packages/xxx 文件
- git add .
- git commit -m 'fix(xxx): 修复数据读取错误 bug'
- git log 查看生成的版本号是否是对的
- 如果版本号不符合，执行`git reset --hard HEAD^`，删除`yarn version:pre`命令产生的`commit`，继续执行`git tag -d vx.x.x-beta.x`，删除`yarn version:pre`命令产生的`tag`
- 在重新 git add. && git commit -m 'fix(xxx): 修复数据读取错误 bug'
- 如果版本号是对的，则提交代码 git push

更多 lerna 使用方式参考[lerna 管理 monorepo 多包项目](/docs/topic/lerna)
