# 🐍 贪吃蛇游戏

一个使用纯JavaScript和Canvas API开发的经典贪吃蛇游戏，具有现代化的UI设计和完整的排行榜系统。

![游戏截图](https://img.shields.io/badge/Game-Snake-brightgreen?style=for-the-badge&logo=javascript)
![技术栈](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue?style=for-the-badge)
![响应式](https://img.shields.io/badge/Design-Responsive-orange?style=for-the-badge)

## 🎮 游戏特性

### 核心功能
- 🎯 **经典贪吃蛇玩法** - 控制蛇移动、吃食物、避免碰撞
- 🏆 **排行榜系统** - 记录前20名最高分，支持本地存储
- 👤 **用户名系统** - 个性化游戏体验，显示玩家排名
- 📱 **移动端支持** - 响应式设计，支持触摸控制按钮
- 🎨 **美观UI设计** - 毛玻璃效果、渐变背景、现代化界面

### 游戏机制
- ⚡ **动态速度** - 随着得分增加，游戏速度逐渐提升
- 🍎 **智能食物生成** - 避免与蛇身重叠，确保公平游戏
- 💥 **即时碰撞检测** - 撞墙或撞自己立即结束游戏
- 📊 **实时分数显示** - 当前分数和历史最高分

### 控制方式
- 🖥️ **桌面端**：方向键 (↑↓←→) 或 WASD 键
- 📱 **移动端**：屏幕触摸按钮
- 🔄 **重新开始**：空格键

## 🛠️ 技术栈

| 技术 | 描述 | 版本 |
|------|------|------|
| **HTML5** | 页面结构和Canvas元素 | - |
| **CSS3** | 样式设计、响应式布局、毛玻璃效果 | - |
| **JavaScript** | 游戏逻辑、Canvas绘制、事件处理 | ES6+ |
| **Canvas API** | 游戏渲染和图形绘制 | - |
| **localStorage** | 排行榜数据持久化存储 | - |

## 📁 项目结构

```
snake/
├── index.html          # 主页面文件
├── style.css           # 样式文件
├── game.js            # 游戏逻辑文件
├── apple.svg          # 苹果图标文件
├── snake-head.svg     # 蛇头图标文件（展示用）
├── snake-head-game.svg # 游戏专用蛇头图片
├── netlify.toml       # Netlify部署配置
├── _redirects         # 重定向规则
└── README.md          # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- Python 3.x（用于本地开发服务器）
- 现代浏览器（支持HTML5 Canvas）

### 本地运行

1. **克隆项目**
   ```bash
   git clone <项目地址>
   cd snake
   ```

2. **启动本地服务器**
   ```bash
   python3 -m http.server 8000
   ```

3. **打开游戏**
   在浏览器中访问：`http://localhost:8000`

### 在线演示
🎮 **立即体验**：[在线游戏地址](https://cursor-snake.netlify.app)

## 🌐 部署到Netlify

### 方法一：Git仓库自动部署（推荐）

1. **推送代码到Git仓库**
   ```bash
   git add .
   git commit -m "Add Netlify deployment config"
   git push origin main
   ```

2. **连接Netlify**
   - 访问 [Netlify](https://www.netlify.com/)
   - 点击 "New site from Git"
   - 选择您的Git提供商（GitHub/GitLab/Bitbucket）
   - 选择snake项目仓库

3. **部署设置**
   - **Branch to deploy**: `main`
   - **Build command**: 留空（纯前端项目）
   - **Publish directory**: `.`（根目录）
   - 点击 "Deploy site"

4. **自定义域名（可选）**
   - 在站点设置中点击 "Change site name"
   - 或绑定自定义域名

### 方法二：拖拽部署

1. **压缩项目文件**
   ```bash
   zip -r snake-game.zip . -x "*.git*" "node_modules/*"
   ```

2. **手动部署**
   - 访问 [Netlify](https://app.netlify.com/)
   - 拖拽zip文件到部署区域
   - 等待部署完成

### 部署配置说明

项目包含以下Netlify配置文件：
- `netlify.toml` - 主要配置文件
- `_redirects` - 重定向规则（备用）

### 游戏开始
1. 输入您的用户名
2. 点击"开始游戏"按钮
3. 使用方向键或触摸按钮控制蛇的移动
4. 吃掉红色苹果获得分数
5. 避免撞墙和撞到自己

## 🎯 游戏规则

- **目标**：控制蛇吃掉尽可能多的食物
- **得分**：每吃掉一个苹果获得10分
- **成长**：吃掉食物后蛇身会增长
- **结束条件**：
  - 撞到游戏边界（墙壁）
  - 撞到自己的身体
- **速度变化**：每获得50分，游戏速度会轻微提升

## 🏆 排行榜系统

- 自动保存每局游戏成绩
- 显示前20名最高分记录
- 包含玩家姓名、分数和游戏日期
- 前三名有特殊颜色标识
- 支持显示/隐藏切换

## 📱 响应式设计

| 设备类型 | 屏幕宽度 | 适配特性 |
|----------|----------|----------|
| **桌面端** | > 768px | 键盘控制、完整界面 |
| **移动端** | ≤ 768px | 触摸按钮、优化布局 |

## 🐛 问题修复记录

### 版本更新历史

#### v1.5 - 最新版本
- ✅ 蛇头图片支持：优先使用SVG图片，降级到Canvas绘制
- ✅ 精美蛇头设计：朝向感强的流线型蛇头
- ✅ 双重渲染系统：图片 + Canvas备份确保兼容性
- ✅ 智能方向旋转：蛇头图片根据移动方向自动旋转
- ✅ 高清矢量图形：SVG格式支持任意缩放不失真

#### v1.4
- ✅ 全新的蛇形象设计：逼真的蛇头和蛇身
- ✅ 智能蛇头方向：根据移动方向自动旋转
- ✅ 眨眼动画：每3秒眨眼一次，增加生动感
- ✅ 渐变蛇身：从头到尾颜色渐变，模拟真实蛇类
- ✅ 动态纹理：旋转花纹和鳞片效果
- ✅ 精细五官：眼睛、鼻孔、舌头等细节

#### v1.3
- ✅ 添加精美的苹果SVG图标
- ✅ 双重渲染机制：SVG图片 + Canvas绘制备份
- ✅ 渐变效果和真实苹果外观
- ✅ 自动降级兼容性处理

#### v1.2
- ✅ 修复食物生成边界问题（Canvas尺寸600x400对应30x20网格）
- ✅ 改进撞墙立即结束机制
- ✅ 优化食物显示逻辑
- ✅ 增强调试信息输出

#### v1.1
- ✅ 添加排行榜功能
- ✅ 实现用户名系统
- ✅ 移动端适配

#### v1.0
- ✅ 基础游戏功能
- ✅ 从Phaser.js迁移到纯JavaScript
- ✅ Canvas渲染优化

## 🎨 UI设计特色

- **毛玻璃效果**：使用CSS backdrop-filter创建现代感界面
- **渐变背景**：多色渐变营造视觉层次
- **圆角设计**：所有元素采用圆角边框，提升美观度
- **阴影效果**：适度的box-shadow增强立体感
- **动画效果**：hover状态和过渡动画提升交互体验

## 🔧 配置说明

### 游戏参数配置

```javascript
// 在game.js中可调整的参数
gridSize: 20,           // 网格大小（像素）
tileCountX: 30,         // 水平方向瓦片数
tileCountY: 20,         // 垂直方向瓦片数
baseSpeed: 150,         // 基础游戏速度（毫秒）
speedIncrement: 10,     // 速度提升量
scoreIncrement: 10      // 每个食物的分数
```

### Canvas尺寸
- 宽度：600px（30个20px网格）
- 高度：400px（20个20px网格）

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发环境设置
1. Fork本项目
2. 创建feature分支
3. 提交更改
4. 发起Pull Request

### 代码规范
- 使用ES6+语法
- 保持代码注释清晰
- 遵循现有的代码风格

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至：823532258@qq.com

---

**🎮 享受游戏！祝您在贪吃蛇的世界中玩得开心！**

> 💡 小贴士：想要获得高分？试试规划路线，避免把自己困在角落里！
