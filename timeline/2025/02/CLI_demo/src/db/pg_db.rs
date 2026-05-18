use log::info;
use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::{PgPool, PgPoolOptions};
use sqlx::{Connection, PgConnection, Postgres};
use std::time::Duration;

pub async fn connect() -> Result<PgPool, sqlx::Error> {
    info!("Initializing database connection");
    let database_url = dotenv::var("DATABASE_URL").expect("`DATABASE_URL` not in .env");
    let pool = PgPoolOptions::new()
        .min_connections(
            dotenv::var("DATABASE_MIN_CONNECTIONS")
                .ok()
                .and_then(|x| x.parse().ok())
                .unwrap_or(0),
        )
        .max_connections(
            dotenv::var("DATABASE_MAX_CONNECTIONS")
                .ok()
                .and_then(|x| x.parse().ok())
                .unwrap_or(16),
        )
        .max_lifetime(Some(Duration::from_secs(60 * 60)))
        .connect(&database_url)
        .await?;

    Ok(pool)
}

pub async fn check_for_migrations() -> Result<(), sqlx::Error> {
    let uri = dotenv::var("DATABASE_URL").expect("`DATABASE_URL` not in .env");
    let uri = uri.as_str();
    if !Postgres::database_exists(uri).await? {
        info!("Creating database...");
        Postgres::create_database(uri).await?;
    }

    info!("Applying migrations...");

    // 它不会检查表是否存在，而是直接运行所有未应用的迁移。迁移文件中定义的 SQL 语句将负责创建表和其他数据库对象
    let mut conn: PgConnection = PgConnection::connect(uri).await?;
    sqlx::migrate!()
        .run(&mut conn)
        .await
        .expect("Error while running database migrations!");

    Ok(())
}