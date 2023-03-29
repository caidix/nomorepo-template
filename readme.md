# demo(npm-package-monorepo-node)

## 简介（Introduction)

适用于开发 node 端多包项目模版

## 特性（Feature）

- 开箱即用的`typescript`
- 支持 `commonjs` 和 `esm` 两种模块类型输出
- 集成`CI` 自动发包
- 集成`eslint` 检查
- 规范`commit message`，支持`commit message`检查
- 集成`prettier`代码美化
- 集成`cspell`, 支持拼写检查
- 集成`@umijs/jest`，支持单元测试用例编写，与测试覆盖率收集
- 集成自动升级版本号与生成`changeLog.md`
- 开箱即用`scripts`命令
- `lerna`自动管理包依赖

## 项目设计结构（Structure）

```bash
|- packages
    |- packageA
      |- dist # build生成目录
        |- index.js
        |- index.d.ts
      |- src
        |- index.ts
        |- CHANGELOG.md
        |- package.json
        |- README.md
        |- tsconfig.json
        |- __tests__ # 测试目录
            |- index.test.ts
    |- packageB
      |- dist # build生成目录
        |- index.js
        |- index.d.ts
      |- src
        |- index.ts
        |- CHANGELOG.md
        |- package.json
        |- README.md
        |- tsconfig.json
        |- __tests__ # 测试目录
            |- index.test.ts
|- .editorconfig
|- .eslintignore
|- .eslintrc
|- .gitignore
|- .gitlab-ci.yml
|- .commitlintrc.js # commit信息检查
|- package.json
|- .prettierignore
|- .prettierrc.js
|- CHANGELOG.md
|- cspell.json
|- jest.config.js
|- lerna.json
|- README.md
|- tsconfig.base.json
```

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
