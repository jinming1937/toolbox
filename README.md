# ToolBox 工具箱

都是多年攒的前端小公举

## 开发

### 安装

```bash
npm i
```

or

```bash
yarn init
```

### 起服务

```bash
npm run dev
npm run view
```

### 构建

```bash
npm run build
```

### 预览

```bash
npm run view
```

### 上线

1. 先build，得到dist文件
2. dist中index.html 改为 index.php
3. 用FTP工具上传到服务器

### 目录

* \
* |- build/ 构建相关
* |- src/ TSX 主要项目代码目录
* |- static/ 静态资源: react等本地调试使用
* |- types/ ts 类型
* |- ... 其他项目配置文件
