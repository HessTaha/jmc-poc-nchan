import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Event } from '../data';

const AddEvents: React.FC = () => {
  const { handleSubmit, control, reset } = useForm<Event>({
    defaultValues: {
      title: "",
      type: "rencontre",
      date: "",
      location: "",
      organizer: "",
      description: "",
    },
  });

  const onSubmit = (data: Event) => {
    console.log("Form Data:", data);
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
        name="title"
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
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select {...field} labelId="type-label" label="Type">
              <MenuItem value="rencontre">Rencontre</MenuItem>
              <MenuItem value="petite annonce">Petite annonce</MenuItem>
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
        name="location"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Lieu" required fullWidth />
        )}
      />

      <Controller
        name="organizer"
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
