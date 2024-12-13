import { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Home, AddEvents, ListEvents } from "./views";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2"
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
});

const App: FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEvents />} />
        <Route path="/list" element={<ListEvents />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
