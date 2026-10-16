# 良心云观察站

一个无构建依赖的静态多页面博客原型，采用「顶部全局导航 + 左侧频道目录 + 中间正文 + 右侧文章大纲」的信息架构。

## 页面

- `recommendations.html` — 机场推荐
- `reviews.html` — 机场评测（含 15 家主流机场深度实测、证据链与内外链接）
- `clients.html` — 客户端教程（覆盖 Windows、macOS、Android 与 iOS 基础配置、Sing-box、Apple TV/主机、软路由、订阅安全与排障）
- `ai-tools.html` — AI 工具（通用对话、代码助手、图像生成、搜索研究四大品类行业 TOP 5 盘点与安全稳定访问指南）
- `compare.html` — 机场对比（15 家主流服务商横向综合参数对比表、真实起步月付、线路架构、原生解锁与计费套路拆解）
- `faq.html` — 问题库
- `alerts.html` — 跑路预警
- `coupons.html` — 机场优惠码
- `protocols.html` — 协议与线路
- `troubleshooting.html` — 故障排查
- `about.html` — 关于

## 本地预览

无需安装依赖，直接打开 `index.html` 即可。也可以在当前目录运行：

```powershell
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 修改内容

- 页面数据和栏目结构：`assets/content.js`
- 布局与视觉样式：`assets/styles.css`
- 导航、大纲、搜索与滚动交互：`assets/app.js`
- 新增页面时可复制：`assets/base-template.html`

正式上线前，请将演示服务商、示例数据和联系邮箱替换为真实、可验证的信息，并补充域名、站点地图、分析工具与部署配置。
