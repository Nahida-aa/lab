use serde::{Deserialize, Serialize};
use uuid::Uuid;
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct Item {
    pub id: Uuid,
    pub name: String,
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct CreateItemRequest {
    pub name: String,
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct UpdateItemRequest {
    pub name: String,
}