# BuildMoat — QR Code Generator

一个全栈 QR 码生成与管理平台，支持短链接跳转、扫描统计和二维码图片导出。

## 技术栈

| 层级     | 技术                                            |
| -------- | ----------------------------------------------- |
| 后端     | Rust · Axum · SQLx · PostgreSQL                 |
| 前端     | Next.js 16 · React 19 · TypeScript              |
| UI       | Tailwind CSS v4 · shadcn/ui · Lucide            |
| 状态管理 | TanStack Query · TanStack Form · TanStack Table |
| 基础设施 | Docker Compose (PostgreSQL)                     |

## 项目结构

```
buildmoat/
├── qr_code_genrator/   # Rust 后端 (Axum, port 8000)
│   ├── src/
│   │   ├── routes/     # API 路由 (create / manage / redirect / analytics)
│   │   ├── models.rs
│   │   ├── dto.rs
│   │   ├── db.rs
│   │   ├── config.rs
│   │   └── state.rs
│   ├── migrations/
│   └── docker-compose.yml
└── frontend/           # Next.js 前端 (port 3000)
    └── src/
        ├── app/        # App Router 页面
        ├── components/ # UI 组件 (features / ui)
        ├── hooks/      # React Query hooks
        ├── services/   # API 调用层
        ├── lib/        # axios 客户端、表单 schema、工具函数
        └── types/
```

```

```
