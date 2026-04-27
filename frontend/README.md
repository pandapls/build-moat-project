# QR Code Generator — 前端

动态二维码管理系统的 React + Next.js 前端。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16、React 19、TypeScript |
| 样式 | Tailwind CSS v4 |
| 数据请求 | TanStack Query v5 + Axios |
| 表单 | TanStack Form + Zod |
| 表格 | TanStack Table v8 |
| UI 组件 | Base UI、shadcn |

## 功能

- 创建动态二维码，支持可选过期时间
- 展示二维码图片 + 短链接，支持一键复制
- 列表展示所有二维码，过期时间实时倒计时
- 编辑目标 URL 和过期时间
- 删除二维码（软删除）
- 查看扫码统计（累计扫码次数）

## 项目结构

```
src/
├── app/
│   ├── page.tsx               # 首页 — 模块入口
│   ├── qr/
│   │   ├── page.tsx           # 创建二维码
│   │   └── list/page.tsx      # 二维码列表
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── CopyText.tsx       # 通用复制文本组件
│   │   └── Modal.tsx          # 通用弹窗组件
│   └── features/qr/
│       ├── QrCreateForm.tsx   # URL + 过期时间表单
│       ├── QrResult.tsx       # 创建成功结果卡片
│       ├── QrListTable.tsx    # 分页表格（含倒计时）
│       ├── QrEditModal.tsx    # 编辑 URL / 过期时间 / 删除
│       └── QrAnalyticsModal.tsx
├── hooks/
│   ├── useQrCode.ts           # 创建 mutation
│   └── useQrList.ts           # 分页列表 query
├── services/
│   └── qrService.ts           # 所有 API 调用
├── lib/
│   ├── apiClient.ts           # Axios 实例 + 响应解包
│   ├── queryClient.ts         # TanStack Query 配置 + 缓存键
│   ├── qrSchemas.ts           # Zod 校验 schema
│   └── utils.ts               # cn()、getCountdown()
└── types/
    └── qr.ts                  # 公共 TypeScript 接口定义
```

## 快速开始

**前置条件：** Node.js 18+，后端服务运行在 8000 端口

```bash
pnpm install
pnpm dev       # http://localhost:3000
```

环境变量（`.env.local`）：

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 后端接口

前端将所有 `/api/*` 和 `/r/*` 请求代理到 `NEXT_PUBLIC_API_URL`。

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/qr/create` | 创建二维码 |
| `GET` | `/api/qr` | 获取二维码列表（分页） |
| `GET` | `/api/qr/:token` | 获取单个二维码 |
| `PATCH` | `/api/qr/:token` | 更新 URL / 过期时间 |
| `DELETE` | `/api/qr/:token` | 软删除 |
| `GET` | `/api/qr/:token/analytics` | 扫码统计 |
| `GET` | `/api/qr/:token/images` | 二维码 PNG 图片 |
| `GET` | `/r/:token` | 短链接跳转 |

所有响应遵循统一信封格式 `{ success, code, data, message }`，由 `apiClient.ts` 自动解包。
