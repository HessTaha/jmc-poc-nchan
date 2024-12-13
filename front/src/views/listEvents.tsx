import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { FunctionComponent, useEffect, useState } from "react";
import { Badge, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { Event } from "../data";

interface Notification extends Event {
  id: string;
  arrivalDate: string;
}

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  width: "50vh",
}));

const events: Event[] = [
  {
    title: "Concert acoustique intime",
    type: "rencontre",
    date: "2024-01-15",
    location: "Le Café des Artistes",
    organizer: "Hysao",
    description:
      "Un concert acoustique en petit comité avec des reprises et des compositions originales.",
  },
  {
    title: "Jam session ouverte",
    type: "rencontre",
    date: "2024-02-10",
    location: "Studio 22",
    organizer: "Collectif Impro'Musique",
    description:
      "Apportez votre instrument ou votre voix pour une jam session inoubliable !",
  },
  {
    title: "Festival de musique en plein air",
    type: "rencontre",
    date: "2024-06-20",
    location: "Parc de la Liberté",
    organizer: "Ville de Musiqueville",
    description:
      "Célébrez la Fête de la Musique avec des artistes locaux et internationaux.",
  },
  {
    title: "Masterclass : Écrire une chanson",
    type: "rencontre",
    date: "2024-03-05",
    location: "Maison de la Musique",
    organizer: "Chanteur célèbre",
    description:
      "Un atelier pratique pour apprendre à composer une chanson de A à Z.",
  },
  {
    title: "Audition pour jeunes talents",
    type: "petite annonce",
    date: "2024-04-12",
    location: "Salle Harmonie",
    organizer: "Hysao Music",
    description:
      "Rejoignez notre groupe ! Nous recherchons de nouveaux talents pour nos projets musicaux.",
  },
  {
    title: "Vente de vinyles rares",
    type: "petite annonce",
    date: "2024-03-18",
    location: "Chez Max",
    organizer: "Max Le Collectionneur",
    description: "Venez découvrir une collection unique de vinyles à vendre.",
  },
  {
    title: "Projection de clips musicaux",
    type: "rencontre",
    date: "2024-05-14",
    location: "Cinéma Lumière",
    organizer: "Hysao",
    description: "Découvrez les clips de nos derniers albums sur grand écran.",
  },
  {
    title: "Concert caritatif pour les enfants",
    type: "rencontre",
    date: "2024-02-25",
    location: "Salle Polyvalente",
    organizer: "Solidarité Musicale",
    description:
      "Un concert caritatif pour collecter des fonds pour les enfants en difficulté.",
  },
  {
    title: "Bourse d'échange d'instruments",
    type: "rencontre",
    date: "2024-03-22",
    location: "Halle Municipale",
    organizer: "Club des Musiciens",
    description:
      "Échangez, vendez ou achetez des instruments de musique avec d'autres passionnés.",
  },
  {
    title: "Soirée karaoké spécial années 80",
    type: "rencontre",
    date: "2024-04-08",
    location: "Bar Chez Lulu",
    organizer: "Chez Lulu",
    description:
      "Chantez vos tubes préférés des années 80 dans une ambiance décontractée.",
  },
  {
    title: "Rencontre avec un producteur",
    type: "rencontre",
    date: "2024-06-05",
    location: "Studio Blue Sound",
    organizer: "Hysao",
    description:
      "Découvrez les secrets de la production musicale lors de cette rencontre exclusive.",
  },
  {
    title: "Session d'enregistrement gratuite",
    type: "rencontre",
    date: "2024-07-10",
    location: "Studio Hysao",
    organizer: "Hysao",
    description:
      "Testez votre talent en enregistrant un morceau gratuitement dans un studio professionnel.",
  },
];

const ListEvents: FunctionComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [intervalDelay, setIntervalDelay] = useState<number>(
    Math.floor(Math.random() * 5000) + 1000
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const newNotification: Notification = {
        id: generateUUID(),
        arrivalDate: new Date().toLocaleString(),
        ...randomEvent,
      };

      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);

      const newInterval = Math.floor(Math.random() * 5000) + 1000;
      setIntervalDelay(newInterval);

      setTimeout(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif.id !== newNotification.id)
        );
      }, 5000);
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [intervalDelay]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          ...theme.applyStyles("dark", {
            backgroundColor: "#1A2027",
            color: "#fff",
          }),
        })}
      >
        <AnimatePresence>
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                badgeContent={notif.type}
                color={notif.type === "rencontre" ? "primary" : "success"}
              >
                <Item key={index} elevation={6} sx={{ marginBottom: "10px" }}>
                  <Typography variant="h6" textAlign="center">
                    {notif.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="center"
                    color="textSecondary"
                  >
                    Début: {notif.arrivalDate}
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    {notif.description}
                  </Typography>
                </Item>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export { ListEvents };
