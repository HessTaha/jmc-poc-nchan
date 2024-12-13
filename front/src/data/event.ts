export interface Event {
  titre_de_levenement: string;
  type_de_levenement: "rencontre" | "petiteannonce";
  date: string;
  lieu: string;
  organisateur: string;
  description: string;
};
