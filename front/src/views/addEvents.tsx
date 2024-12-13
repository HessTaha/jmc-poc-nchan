import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Event } from '../data';

const AddEvents: React.FC = () => {
  const { handleSubmit, control, reset } = useForm<Event>({
    defaultValues: {
      titre_de_levenement: "",
      type_de_levenement: "rencontre",
      date: "",
      lieu: "",
      organisateur: "",
      description: "",
    },
  });

  const onSubmit = (data: Event) => {

    fetch("http://localhost:8080/command/register_new_event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data, date: new Date(data.date).toISOString()
      })
    }).catch(e => { console.log(e) })
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "500px",
        margin: "auto",
        color: "white",
      }}
    >
      <Typography variant="h5" textAlign="center" color="#535353" gutterBottom>
        Créer un événement
      </Typography>

      <Controller
        name="titre_de_levenement"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Titre de l'événement"
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="type_de_levenement"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select {...field} labelId="type-label" label="Type">
              <MenuItem value="rencontre">Rencontre</MenuItem>
              <MenuItem value="petiteannonce">Petite annonce</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Date"
            type="datetime-local"
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="lieu"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Lieu" required fullWidth />
        )}
      />

      <Controller
        name="organisateur"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Organisateur" required fullWidth />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            multiline
            rows={4}
            fullWidth
            required
          />
        )}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Soumettre
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => reset()}
        >
          Réinitialiser
        </Button>
      </Box>
    </Box>
  );
};

export { AddEvents };
