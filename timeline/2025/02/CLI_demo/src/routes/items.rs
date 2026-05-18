use axum::{
    extract::{Extension, Path},
    routing::{get, post, put, delete},
    Json, Router,
};
use std::sync::Arc;
use uuid::Uuid;
use sqlx::PgPool;
use crate::models::{item_t::{CreateItemRequest, UpdateItemRequest}, Item};

pub fn create_router() -> Router {
    Router::new()
        .route("/", post(create_item).get(list_items))
        .route("/{id}", get(get_item).put(update_item).delete(delete_item))
}

#[utoipa::path(
    post, path = "/items",
    request_body = CreateItemRequest,
    responses(
        (status = 201, description = "Item created", body = Item)
    )
)]
pub async fn create_item(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<CreateItemRequest>,
) -> Json<Item> {
    let item = Item {
        id: Uuid::new_v4(),
        name: payload.name,
    };

    sqlx::query("INSERT INTO items (id, name) VALUES ($1, $2)")
        .bind(item.id)
        .bind(&item.name)
        .execute(&*pool)
        .await
        .expect("Failed to insert item");

    Json(item)
}

#[utoipa::path(
    get, path = "/items",
    responses(
        (status = 200, description = "List items", body = [Item])
    )
)]
pub async fn list_items(Extension(pool): Extension<Arc<PgPool>>) -> Json<Vec<Item>> {
    let items = sqlx::query_as!(Item, "SELECT id, name FROM items")
        .fetch_all(&*pool)
        .await
        .expect("Failed to fetch items");

    Json(items)
}

#[utoipa::path(
    get, path = "/items/{id}",
    responses(
        (status = 200, description = "Get item by ID", body = Item)
    ),
    params(
        ("id" = Uuid, Path, description = "Item ID")
    )
)]
pub async fn get_item(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(id): Path<Uuid>,
) -> Json<Item> {
    let item = sqlx::query_as!(Item, "SELECT id, name FROM items WHERE id = $1", id)
        .fetch_one(&*pool)
        .await
        .expect("Failed to fetch item");

    Json(item)
}

#[utoipa::path(
    put, path = "/items/{id}",
    request_body = UpdateItemRequest,
    responses(
        (status = 200, description = "Item updated", body = Item)
    ),
    params(
        ("id" = Uuid, Path, description = "Item ID")
    )
)]
pub async fn update_item(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateItemRequest>,
) -> Json<Item> {
    sqlx::query("UPDATE items SET name = $1 WHERE id = $2")
        .bind(&payload.name)
        .bind(id)
        .execute(&*pool)
        .await
        .expect("Failed to update item");

    Json(Item { id, name: payload.name })
}

#[utoipa::path(
    delete, path = "/items/{id}",
    responses(
        (status = 200, description = "Item deleted", body = String)
    ),
    params(
        ("id" = Uuid, Path, description = "Item ID")
    )
)]
pub async fn delete_item(
    Extension(pool): Extension<Arc<PgPool>>,
    Path(id): Path<Uuid>,
) -> Json<String> {
    sqlx::query("DELETE FROM items WHERE id = $1")
        .bind(id)
        .execute(&*pool)
        .await
        .expect("Failed to delete item");

    Json(format!("Deleted item with id {}", id))
}