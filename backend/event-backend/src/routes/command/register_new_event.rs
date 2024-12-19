use actix_web::{
    post,
    web::{self, Json},
    HttpResponse,
};
use mongodb::{bson::doc, Client};
use reqwest::Client as rq;

use crate::models::event_model::{EventType, RencontreEvent};

async fn notify_event_system(type_evenement: EventType, date: &str, lieu: &str) {
    let client = rq::new();
    let data = format!(
        "Une {} vient d'être publier et aura lieu le {} à {}",
        type_evenement.to_string(),
        date,
        lieu
    );

    let uri = "http://localhost:8080/pub?channelId=event";

    let response_result = client
        .post(uri)
        .header("Content-Type", "text/plain")
        .body(data)
        .send()
        .await;

    let response = match response_result {
        Ok(resp) => resp,
        Err(err) => {
            eprintln!("Error sending request: {}", err);
            return;
        }
    };
    ()
}

#[post("/register_new_event")]
async fn register_new_event(
    client: web::Data<Client>,
    event: Json<RencontreEvent>,
) -> HttpResponse {
    let collection = client.database("pocNchan").collection("events");

    let cloned_event = event.clone();

    let event_to_doc = doc! {
        "titre de l'evenement": &event.titre_de_levenement,
        "type de l'evenemnt": &event.type_de_levenement.to_string(),
        "date": &event.date.to_string(),
        "lieu": &event.lieu,
        "organisateur": &event.organisateur,
        "description": &event.description
    };

    match collection.insert_one(event_to_doc).await {
        Ok(insert_result) => {
            let response = HttpResponse::Ok().json({
                serde_json::json!({
                    "status": "success",
                    "inserted_id": insert_result.inserted_id,
                    "event": event.into_inner()
                })
            });

            notify_event_system(
                cloned_event.type_de_levenement,
                &cloned_event.date.to_string(),
                &cloned_event.lieu,
            )
            .await;

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
