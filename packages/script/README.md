# CD-Script

> 这是一个在持续跟进的仓库，进行 webpack5 封装， 目前仅支持 react 运行时，支持 less、sass 样式编译，打包及 vue 的支持将在后续做项目的时候持续完善。

## 使用方式

### 安装

```bash
npm i -g @caidix/cd-scripts
```

### 改造项目

1. 打开 package.json,scripts 添加如下指令：

```json
  "scripts": {
    "dev": "cd-scripts start",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write \"**/*.+(js|jsx|json|css|md)\""
  },
```

2. 在根目录下创建 config/config.js 文件，cd-scripts 命令将会从 config.js 文件中获取你传入的定制化 webpack 配置。

相关配置：

| 参数      | 作用                                                      |
| --------- | --------------------------------------------------------- |
| devServer | webpack-dev-server 入参，通常为 proxy 代理，post 端口号等 |

3. 在你的目录下创建.env.development 及 .env.production 文件，它们的作用和传统 cli 创建时.env 的作用相同。在不同环境下为 process.env 内传入不同的环境变量。变量为 APP*ENV* 开头的变量将会注入到项目运行时。
