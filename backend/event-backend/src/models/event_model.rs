use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum EventType {
    Rencontre,
    PetiteAnnonce,
}

impl EventType {
    pub fn to_string(&self) -> String {
        if *self == EventType::Rencontre {
            return "rencontre".to_string();
        } else {
            return "petite annonce".to_string();
        }
    }
}

#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct RencontreEvent {
    pub titre_de_levenement: Option<String>,

    pub type_de_levenement: EventType,
    pub date: DateTime<Utc>,

    pub lieu: String,

    pub organisateur: String,

    pub description: String,
}
