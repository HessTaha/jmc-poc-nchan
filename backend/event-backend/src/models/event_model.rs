use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum EventType {
    Rencontre,
    PetiteAnnonce,
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct RencontreEvent {
    pub titre_de_levenement: Option<String>,
    pub type_de_levenement: Option<EventType>,
    pub date: DateTime<Utc>,
    pub lieu: String,
    pub organisateur: String,
    pub description: String,
}
