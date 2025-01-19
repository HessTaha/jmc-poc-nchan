use actix_web::{
    post,
    web::{self, Json},
    HttpResponse,
};
use mongodb::{Client, Collection};
use reqwest::Client as rq;

use crate::models::event_model::RencontreEvent;

async fn notify_event_system(event: RencontreEvent) -> Result<(), String> {
    let client = rq::new();
    let uri = "http://nginx:8081/pub?channelId=event";

    let _result = client
        .post(uri)
        .header("Content-Type", "application/json")
        .json(&event)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[post("/command/register_event")]
async fn register_new_event(
    client: web::Data<Client>,
    event: Json<RencontreEvent>,
) -> HttpResponse {
    let db = client.database("pocNchan");
    let collection: Collection<RencontreEvent> = db.collection("events");

    let event = event.into_inner();
    match collection.insert_one(&event).await {
        Ok(insert_result) => {
            let response = HttpResponse::Ok().json({
                serde_json::json!({
                    "status": "success",
                    "inserted_id": insert_result.inserted_id,
                    "event": &event
                })
            });

            match notify_event_system(event).await {
                Ok(_) => (),
                Err(e) => eprintln!("Could not notify that event was created : {}", e),
            }
            response
        }
        Err(e) => {
            // An error occurred while inserting the document
            eprintln!("Failed to insert document: {}", e);
            HttpResponse::InternalServerError().json({
                serde_json::json!({
                    "status": "error",
                    "message": "Failed to register the new event."
                })
            })
        }
    }
}
