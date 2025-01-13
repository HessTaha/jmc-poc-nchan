use actix_web::{get, HttpResponse};
use serde_json::json;

#[get("/ready")]
async fn ready() -> HttpResponse {
    HttpResponse::Ok().json(json!({"ready": 200}))
}

#[cfg(test)]
mod tests {
    use actix_web::{test, App};

    use super::ready;

    #[actix_web::test]
    async fn test_ready() {
        let app = test::init_service(App::new().service(ready)).await;
        let req = test::TestRequest::get().uri("/ready").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
    }
}
