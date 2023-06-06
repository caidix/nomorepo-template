# Pnpm-Nomorepo-Template

## 全局安装 -w: --workspace-root

pnpm add typescript -D -w

## 局部安装

pnpm add typescript -D --filter pkg-a

## 互相安装

pnpm add pkg-a -D --workspace --filter pkg-b

> 在设置依赖版本的时候推荐用 workspace:*，这样就可以保持依赖的版本是工作空间里最新版本，不需要每次手动更新依赖版本。

## Changeset

pnpm changeset pre enter alpha   # 发布 alpha 版本
pnpm changeset pre enter beta    # 发布 beta 版本
pnpm changeset pre enter rc      # 发布 rc 版本

## Tips

### scripts中如何执行node指令运行TS文件？

安装 esno 插件

### 我书写的package包发布到公有npm上失败，说是私有的，如何解决？

打开包package.json文件添加:

```js
 "publishConfig": {
    "access": "public"
  },
```

### 希望跑脚本需要有哪些常用依赖？

- enquirer
- execa
- fs-extra
- chalk
