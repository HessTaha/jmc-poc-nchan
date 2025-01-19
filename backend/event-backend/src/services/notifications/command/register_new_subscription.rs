use actix_web::{
    post,
    web::{self, Json},
    HttpResponse,
};
use mongodb::{bson::doc, Client, Collection};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct SubscriptionKeys {
    p256dh: String,
    auth: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserPubSubSubscription {
    event_type: String,
    endpoint: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    expiration_time: Option<String>,
    keys: SubscriptionKeys,
}

#[post("/command/subscribe")]
async fn save_subscription(
    client: web::Data<Client>,
    sub_data: Json<UserPubSubSubscription>,
) -> HttpResponse {
    let db = client.database("pocNchan");
    let collection: Collection<UserPubSubSubscription> = db.collection("sub_notifications");

    let subscription_data = sub_data.into_inner();
    match collection.insert_one(subscription_data).await {
        Ok(insert_result) => {
            let response = HttpResponse::Ok().json({
                serde_json::json!({
                    "status": "success",
                    "inserted_id": insert_result.inserted_id
                })
            });
            response
        }
        Err(e) => {
            eprintln!("Failed to insert document: {}", e);
            HttpResponse::InternalServerError().json({
                serde_json::json!({
                    "status": "error",
                    "message": "Failed to register the new subscription data."
                })
            })
        }
    }
}
