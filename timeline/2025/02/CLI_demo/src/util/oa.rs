use utoipa::OpenApi;
use crate::models::Item;
use crate::routes::items::{create_item, list_items, get_item, update_item, delete_item};

#[derive(OpenApi)]
#[openapi(
    info(description = "- [/](/)"),
    paths(
        crate::routes::items::create_item,
        crate::routes::items::list_items,
        crate::routes::items::get_item,
        crate::routes::items::update_item,
        crate::routes::items::delete_item
    ),
    components(schemas(Item))
)]
pub struct ApiDoc;

