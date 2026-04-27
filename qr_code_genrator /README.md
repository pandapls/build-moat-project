## API

| 方法     | 路径                       | 说明           |
| -------- | -------------------------- | -------------- |
| `GET`    | `/api/qr`                  | 列出所有 QR 码 |
| `POST`   | `/api/qr/create`           | 创建 QR 码     |
| `GET`    | `/api/qr/:token`           | 获取单条详情   |
| `PATCH`  | `/api/qr/:token`           | 更新 QR 码     |
| `DELETE` | `/api/qr/:token`           | 删除 QR 码     |
| `GET`    | `/api/qr/:token/analytics` | 扫描统计       |
| `GET`    | `/api/qr/:token/images`    | QR 码图片      |
| `GET`    | `/r/:token`                | 短链接跳转     |

## 数据库 Schema

```sql
CREATE TABLE qr_codes (
    token        VARCHAR(16) PRIMARY KEY,
    original_url TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at   TIMESTAMPTZ,
    deleted_at   TIMESTAMPTZ,
    scan_count   BIGINT NOT NULL DEFAULT 0
);
```
