import { Box, Button } from "@mui/material";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router";

const Home: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add")}
      >
        Ajouter un évènement
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/list")}
      >
        Liste des évènements
      </Button>
    </Box>
  );
};

export { Home };
