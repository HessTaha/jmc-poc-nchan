use actix_cors::Cors;
use actix_web::{middleware::Logger, web, web::scope, App, HttpServer};
mod infrastructure;
mod models;
mod services;

use env_logger::Env;
use infrastructure::mongo_repo::db_pool;
use services::core::command::ready::ready;
use services::events::command::register_new_event::register_new_event;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let user = env::var("MONGO_INITDB_ROOT_USERNAME").unwrap();
    let password = env::var("MONGO_INITDB_ROOT_PASSWORD").unwrap();
    let host = env::var("MONGO_HOST").unwrap();
    let srv_port: u16 = env::var("BACKEND_SRV_PORT").unwrap().parse().unwrap();
    let host: &str = &format!(
        "mongodb://{}:{}@{}:27017/?authSource=admin",
        user, password, host
    );
    let db_pool = db_pool(host).await.unwrap();

    let http_server = HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_methods(vec!["GET", "POST"])
                    .allow_any_origin()
                    .allow_any_header()
                    .max_age(3600),
            )
            .service(ready)
            .service(scope("command").service(register_new_event))
            .app_data(web::Data::new(db_pool.clone()))
            .wrap(Logger::default())
    })
    .bind(("0.0.0.0", srv_port))?;
    http_server.run().await
}
