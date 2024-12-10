use actix_web::{get, HttpResponse};
use serde_json::json;

#[get("/ready")]
async fn ready() -> HttpResponse {
    HttpResponse::Ok().json(json!({"ready": 200}))
}
