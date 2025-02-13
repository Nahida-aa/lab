#

## dependencies

```sh
cargo run
cargo build
```

```sh
cargo add axum --features multipart
cargo add tokio --features full
cargo add serde --features derive
cargo add serde_json

cargo add sqlx --features runtime-tokio-rustls,postgres,chrono,uuid,migrate
cargo add dotenv
cargo add uuid --features serde,v4

cargo add log
cargo add env_logger
```

## db

```sh
# `sqlx` 提供了一个命令行工具 `sqlx-cli`，可以帮助你创建和管理迁移文件
cargo install sqlx-cli --no-default-features --features postgres
mkdir migrations
# 使用 `sqlx` 命令创建一个新的迁移文件：
sqlx migrate add init
```

这将创建一个新的迁移文件，文件名类似于 `migrations/20230213123456_init.sql`。

### 编辑迁移文件

打开迁移文件，并添加创建 `items` 表的 SQL 语句：

```sql
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL
);
```

### 运行迁移

可以省略, 因为在main中写了检查是否有未迁移的sql, 有则自动迁移

使用 `sqlx` 命令运行迁移：

```sh
sqlx migrate run
```

这将应用所有未应用的迁移，并创建或更新数据库表。

## OpenAPI

```sh
cargo add utoipa --features axum_extras,uuid
cargo add utoipa-swagger-ui --features axum
```

## Hot Reloading

在 Rust 开发 Web 应用程序时，热更新（Hot Reloading）可以显著提高开发效率。虽然 Rust 本身不直接支持热更新，但你可以使用一些工具来实现类似的功能。

### 使用 `cargo-watch`

`cargo-watch` 是一个可以监视文件变化并自动重新编译和运行项目的工具。你可以使用它来实现热更新。

#### 安装 `cargo-watch`

首先，安装 `cargo-watch`：

```sh
cargo install cargo-watch # 安装(全局)
```

#### 使用 `cargo-watch` 进行热更新

在项目根目录下运行以下命令：

```sh
cargo watch -x run
```

这将监视项目中的文件变化，并在检测到变化时自动重新编译和运行项目。

### 使用 `systemfd` 和 `cargo-watch`

如果你希望在不关闭服务器的情况下实现热更新，可以使用 `systemfd` 和 `cargo-watch` 组合。

#### 安装 `systemfd`

首先，安装 `systemfd`：

```sh
cargo install systemfd
```

#### 使用 `systemfd` 和 `cargo-watch` 进行热更新

在项目根目录下运行以下命令：

```sh
systemfd --no-pid -s http::3000 -- cargo watch -x 'run --bin your_binary_name'
```

请将 `your_binary_name` 替换为你的项目的二进制名称。

### 示例

以下是一个完整的示例，展示了如何使用 `cargo-watch` 和 `systemfd` 实现热更新：

1. **安装依赖项**：

   ```sh
   cargo install cargo-watch
   cargo install systemfd
   ```

2. **运行项目**：

   ```sh
   systemfd --no-pid -s http::3000 -- cargo watch -x 'run --bin your_binary_name'
   ```

### 更新 mod.rs 文件

确保你的 mod.rs 文件内容如下：

```rust
use axum::{response::Html, routing::get, Router};

pub fn create_router() -> Router {
    Router::new().route("/", get(root))
}

async fn root() -> Html<&'static str> {
    Html("<h1>Hello, Axum!</h1>")
}
```

### 更新 `main.rs` 文件

确保你的 `main.rs` 文件内容如下：

```rust
use axum::{
    routing::{get, post},
    Router, Extension
};
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::sync::Arc;
use dotenv::dotenv;
use std::env;

mod db;
mod models;
mod routes;

#[tokio::main]
async fn main() {
    // 加载 .env 文件
    dotenv().ok();

    // 初始化日志
    env_logger::init();

    // 检查并运行数据库迁移
    db::check_for_migrations().await.expect("An error occurred while running migrations.");

    // Database Connector
    let pool = db::connect()
        .await
        .expect("Database connection failed");

    // 创建共享状态
    let shared_state = Arc::new(pool);

    // 创建路由
    let app = routes::create_router().layer(Extension(shared_state));

    // 运行服务器
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("Listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

## Docker

### 解释

1. **基础镜像**：
   - 使用官方的 Rust 镜像作为基础镜像，以便在其中构建项目。

2. **设置工作目录**：
   - 设置工作目录为 `/usr/src/app`。

3. **复制项目文件**：
   - 复制项目的 Cargo.toml 和 Cargo.lock 文件，以便构建依赖项。
   - 复制项目的源代码和迁移文件。
   - 复制项目的 .env 文件。

4. **构建项目**：
   - 使用 `cargo build --release` 命令构建项目。

5. **使用更小的基础镜像**：
   - 使用更小的 Debian 镜像作为运行时基础镜像，以减小镜像大小。

6. **复制构建好的二进制文件**：
   - 从构建阶段复制构建好的二进制文件到运行时镜像中。

7. **暴露端口**：
   - 暴露应用程序的端口 3000。

8. **运行应用程序**：
   - 使用 `CMD` 指令运行构建好的二进制文件。

### 构建和运行 Docker 镜像

1. **构建 Docker 镜像**：

   在项目根目录下运行以下命令构建 Docker 镜像：

   ```sh
   docker build -t axum_l .
   ```

2. **运行 Docker 容器**：

   使用以下命令运行 Docker 容器：

   ```sh
   docker run -p 3000:3000 --env-file .env axum_l
   ```

通过这些步骤，你可以为你的 Rust 应用编写一个 Dockerfile 文件，并使用 Docker 构建和运行你的应用。这样可以确保你的应用在任何支持 Docker 的环境中都能一致地运行。
