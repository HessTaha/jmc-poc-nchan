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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  width: "50vh",
}));

const ListEvents: FunctionComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081/sub");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const newNotification: Notification = {
          id: Date.now().toString(),
          arrivalDate: new Date().toLocaleString(),
          ...data,
        };

        setNotifications((prevNotifications) => [
          newNotification,
          ...prevNotifications,
        ]);

        console.log("New notification:", newNotification);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

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
                badgeContent={notif.type_de_levenement}
                color={
                  notif.type_de_levenement === "rencontre"
                    ? "primary"
                    : "success"
                }
              >
                <Item key={index} elevation={6} sx={{ marginBottom: "10px" }}>
                  <Typography variant="h6" textAlign="center">
                    {notif.titre_de_levenement}
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
