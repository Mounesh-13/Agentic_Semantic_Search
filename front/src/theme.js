import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#20B2C5" }, // Perplexity turquoise
    secondary: { main: "#ffffff" }, // White
    success: { main: "#20B2C5" },
    info: { main: "#20B2C5" },
    background: {
      default: "transparent",
      paper: "rgba(255, 255, 255, 0.97)",
    },
    error: { main: "#f44336" },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
    h1: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#000000",
      fontWeight: 400,
    },
    button: {
      fontFamily: "'Montserrat', 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', sans-serif",
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          background: "#20B2C5",
          color: "#ffffff",
          boxShadow: "0 3px 12px rgba(32, 178, 197, 0.3)",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "14px 28px",
          transition: "all 0.2s ease",
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          textTransform: "none",
          '&:hover': {
            background: "#1a9aab",
            boxShadow: "0 4px 16px rgba(32, 178, 197, 0.4)",
            transform: "translateY(-1px)",
          },
          '&:disabled': {
            background: "#cccccc",
            color: "#666666",
            transform: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(32, 178, 197, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            border: "2px solid #e0e0e0",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            fontSize: "1.2rem",
            transition: "all 0.2s ease",
            '&:hover': {
              border: "2px solid #20B2C5",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 16px rgba(32, 178, 197, 0.15)",
            },
            '&.Mui-focused': {
              border: "2px solid #20B2C5",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 0 3px rgba(32, 178, 197, 0.1)",
            },
            '&:before, &:after': {
              borderBottom: 'none !important',
            },
          },
          '& .MuiFilledInput-input': {
            color: "#000000",
            backgroundColor: "transparent",
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 400,
            lineHeight: 1.5,
          },
          '& .MuiInputLabel-root': {
            color: "#999999",
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 400,
            '&.Mui-focused': {
              color: "#20B2C5",
            },
          },
        },
      },
    },
  },
});

export default theme;
