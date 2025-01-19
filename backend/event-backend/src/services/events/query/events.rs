use crate::models::event_model::RencontreEvent;
use actix_web::{
    get,
    web::{self},
    HttpResponse,
};
use futures::stream::TryStreamExt;

use mongodb::{bson::doc, Client, Collection};

#[get("/query/events")]
async fn get_all_events(client: web::Data<Client>) -> HttpResponse {
    let db = client.database("pocNchan");
    let collection: Collection<RencontreEvent> = db.collection("events");

    match collection.find(doc! {}).await {
        Ok(mut cursor) => {
            let mut events: Vec<_> = Vec::new();
            println!("{:?}", &cursor.deserialize_current());

            while let Some(event) = cursor.try_next().await.unwrap() {
                events.push(event);
            }
            HttpResponse::Ok().json(events)
        }
        Err(_) => HttpResponse::InternalServerError().json({
            serde_json::json!({
                "status": "error",
                "message": "Failed to retrieve events."
            })
        }),
    }
}
