# 使用官方 Rust 镜像作为基础镜像
FROM rust:latest AS builder

# 设置工作目录
WORKDIR /usr/src/app

# 复制项目的 Cargo.toml 和 Cargo.lock 文件
COPY Cargo.toml Cargo.lock ./

# 复制项目的源代码
COPY src ./src

# 复制项目的迁移文件
COPY migrations ./migrations

# 复制项目的 .env 文件
COPY .env ./

# 构建项目
RUN cargo build --release

# 使用更小的基础镜像
FROM debian:buster-slim

# 设置工作目录
WORKDIR /usr/src/app

# 复制构建好的二进制文件
COPY --from=builder /usr/src/app/target/release/axum_l .

# 复制项目的 .env 文件
COPY .env ./

# 暴露应用程序的端口
EXPOSE 3000

# 运行应用程序
CMD ["./axum_l"]