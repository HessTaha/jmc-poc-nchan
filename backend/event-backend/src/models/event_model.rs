use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum EventType {
    Rencontre,
    PetiteAnnonce,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RencontreEvent {
    pub titre_de_levenement: String,

    pub type_de_levenement: EventType,

    pub date: DateTime<Utc>,

    pub lieu: String,

    pub organisateur: String,

    pub description: String,
}
