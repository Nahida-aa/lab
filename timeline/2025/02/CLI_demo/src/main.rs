use axum::{
    routing::{get, post},
    Router, Extension};
use sqlx::postgres::PgPoolOptions;
use utoipa::OpenApi;
use std::net::SocketAddr;
use std::sync::Arc;
use dotenv::dotenv;
use std::env;

// use utoipa_swagger_ui::SwaggerFile;
use utoipa_swagger_ui::SwaggerUi;

mod db;
mod models;
mod routes;
mod util;

#[tokio::main]
async fn main() {
    // 初始化日志
    env_logger::init();

    db::check_for_migrations()
    .await
    .expect("An error occurred while running migrations.");

    // Database Connector
    let pool = db::connect()
        .await
        .expect("Database connection failed");

    // // 加载 .env 文件
    // dotenv().ok();

    // // 从环境变量中读取数据库连接字符串
    // let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // // let database_url = "postgres://user:password@localhost/database";
    // // 创建数据库连接池
    // let pool = PgPoolOptions::new()
    //     .max_connections(5)
    //     .connect(&database_url)
    //     .await
    //     .expect("Failed to create pool");

    // 创建共享状态
    let shared_state = Arc::new(pool);

    // 创建路由
    let app = routes::create_router()
    .layer(Extension(shared_state))
    .merge(
        SwaggerUi::new("/swagger-ui")
        .url("/api-docs/openapi.json", util::oa::ApiDoc::openapi())
        // Url::new("My Api", "/api-docs/openapi.json")
    )
    ;

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Listening on {}", listener.local_addr().unwrap());
    println!("Swagger UI available at http://localhost:3000/swagger-ui");
    axum::serve(listener, app).await.unwrap();
}
