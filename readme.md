# CD-Script

> 这是一个在持续跟进的仓库，进行webpack5封装， 目前仅支持react运行时，支持less、sass样式编译，打包及vue的支持将在后续做项目的时候持续完善。

## 使用方式

### 安装

```bash
npm i -g @caidix/cd-scripts
```

### 改造项目

1. 打开package.json,scripts添加如下指令：

```json
  "scripts": {
    "dev": "cd-scripts start",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write \"**/*.+(js|jsx|json|css|md)\""
  },
```

2. 在根目录下创建config/config.js文件，cd-scripts命令将会从config.js文件中获取你传入的定制化webpack配置。

相关配置：

| 参数 | 作用 |
|  ----  | ----  |
| devServer| webpack-dev-server入参，通常为proxy代理，post端口号等 |

3. 在你的目录下创建.env.development 及 .env.production 文件，它们的作用和传统cli创建时.env的作用相同。在不同环境下为process.env内传入不同的环境变量。变量为 APP_ENV_ 开头的变量将会注入到项目运行时。
