use mongodb::{error::Error, options, Client};

pub async fn db_pool(host: &str) -> Result<Client, Error> {
    let mut client_option = options::ClientOptions::parse(host).await?;
    client_option.retry_writes = Some(false);

    let client = Client::with_options(client_option);

    match client {
        Ok(c) => {
            println!("Connected to database");
            Ok(c)
        }
        Err(e) => Err(e),
    }
}
