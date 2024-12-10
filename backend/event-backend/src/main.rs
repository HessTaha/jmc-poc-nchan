use actix_web::{middleware::Logger, web, web::scope, App, HttpServer};

mod infrastructure;
mod models;
mod routes;

use env_logger;
use infrastructure::mongo_repo::db_pool;
use routes::command::register_new_event::register_new_event;
use routes::ready::ready;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let user = env::var("MONGO_INITDB_ROOT_USERNAME").unwrap();
    let password = env::var("MONGO_INITDB_ROOT_PASSWORD").unwrap();
    let host: &str = &format!(
        "mongodb://{}:{}@mongo:27017/?authSource=admin",
        user, password
    );
    let db_pool = db_pool(host).await.unwrap();

    HttpServer::new(move || {
        App::new()
            .service(ready)
            .service(scope("command").service(register_new_event))
            .app_data(web::Data::new(db_pool.clone()))
            .wrap(Logger::default())
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
