use actix_web::{
    post,
    web::{self, Json},
    HttpResponse,
};
use mongodb::{bson::doc, Client};

use crate::models::event_model::RencontreEvent;

#[post("/register_new_event")]
async fn register_new_event(
    client: web::Data<Client>,
    event: Json<RencontreEvent>,
) -> HttpResponse {
    let collection = client.database("pocNchan").collection("events");

    let event_to_doc = doc! {
        "titre de l'evenement": &event.titre_de_levenement,
        "type de l'evenemnt": &event.type_de_levenement.to_string(),
        "data": &event.date.to_string(),
        "lieu": &event.lieu,
        "organisateur": &event.organisateur,
        "description": &event.description
    };

    match collection.insert_one(event_to_doc).await {
        Ok(insert_result) => {
            // Successfully inserted the document
            // You can choose to return the inserted ID or the event itself
            HttpResponse::Ok().json({
                serde_json::json!({
                    "status": "success",
                    "inserted_id": insert_result.inserted_id,
                    "event": event.into_inner()
                })
            })
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
