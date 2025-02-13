# Axum + SQLx

这是一个使用 Axum 和 SQLx 构建的 Rust Web 项目，包含基本的 CRUD 操作和 OpenAPI 文档。

## 目录结构

- src/
  - db/
    - mod.rs
    - pg_db.rs
  - main.rs
  - models/
    - item_t.rs
     -mod.rs
  - routes/
    - items.rs
    - mod.rs
  - util/
    - mod.rs
    - oa.rs
- .dockerignore
- .env
- .env.example
- .gitignore
- Cargo.lock
- Cargo.toml
- dev.md
- Dockerfile
- migrations/
- package.json

## 依赖项

- [Axum](https://crates.io/crates/axum)
- [SQLx](https://crates.io/crates/sqlx)
- [Tokio](https://crates.io/crates/tokio)
- [dotenv](https://crates.io/crates/dotenv)
- [uuid](https://crates.io/crates/uuid)
- [utoipa](https://crates.io/crates/utoipa)
- [utoipa-swagger-ui](https://crates.io/crates/utoipa-swagger-ui)

## 数据库

确保你已经安装并运行了 PostgreSQL 数据库。你可以使用 `migrations` 文件夹中的 SQL 文件来初始化数据库。

## 环境变量

创建一个 `.env` 文件，并添加以下内容：

```
DATABASE_URL=postgres://user:password@localhost/database
```

## 运行项目

1. 安装依赖项：

```sh
cargo build
```

2. 运行数据库迁移：

```sh
cargo run --bin migrate
```

3. 启动服务器：

```sh
cargo run
```

服务器将运行在 `http://localhost:3000`，Swagger UI 可在 `http://localhost:3000/swagger-ui` 访问。

## 路由

- `POST /items` - 创建一个新项目
- `GET /items` - 获取所有项目
- `GET /items/{id}` - 根据 ID 获取项目
- `PUT /items/{id}` - 更新项目
- `DELETE /items/{id}` - 删除项目

## 开发

有关开发的更多信息，请参阅 dev.md 文件。

## 许可证

此项目使用 MIT 许可证。有关更多信息，请参阅 LICENSE 文件。
