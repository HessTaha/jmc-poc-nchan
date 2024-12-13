export interface Event {
  title: string;
  type: "rencontre" | "petite annonce";
  date: string;
  location: string;
  organizer: string;
  description: string;
};
