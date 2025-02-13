use axum::{response::Html, routing::get, Router};

pub mod items;

pub fn create_router() -> Router {
    Router::new().route("/", get(root))
        .nest("/items", items::create_router())
}

async fn root() -> Html<&'static str> {
    Html("<h1>Hello, Axum!</h1>
    <a href=\"/swagger-ui\">swagger-ui</a>
    ")
}