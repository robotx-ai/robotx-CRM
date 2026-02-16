import { alpha } from "@mui/material/styles";

export const sidebarTheme = {
  // type: "dark",
  palette: {
    primary: {
      main: "#F5F5F5",
      light: "#FFFFFF",
      dark: "#D4D4D8",
      contrastText: "#111111",
    },
    secondary: {
      main: "#A1A1AA",
      light: "#D4D4D8",
      dark: "#71717A",
      contrastText: "#111111",
    },
    error: {
      main: "#E73145",
      light: "#FF6A70",
      dark: "#AD001E",
      contrastText: "#FFF",
    },
    warning: {
      main: "#F39711",
      light: "#FFC84C",
      dark: "#BB6900",
      contrastText: "#FFF",
    },
    info: {
      main: "#2EB5C9",
      light: "#6FE7FC",
      dark: "#008598",
      contrastText: "#FFF",
    },
    success: {
      main: "#3BD2A2",
      light: "#78FFD3",
      dark: "#00A073",
      contrastText: "#FFF",
    },
    text: {
      primary: "#C5CDE6",
      secondary: "#8595A6",
      disabled: "#A2B2C3",
    },

    divider: "#DEE2E6",
    background: {
      paper: "#26324D",
      default: "#222D45",
    },
    action: {
      active: "#475259",
      hover: "#F5F7FA",
    },
  },
  jumboComponents: {
    JumboNavbar: {
      nav: {
        action: {
          active: "#FFFFFF",
          hover: "#FFFFFF",
        },
        background: {
          active: alpha("#FFFFFF", 0.16),
          hover: alpha("#FFFFFF", 0.15),
        },
        tick: {
          active: "#D4D4D8",
          hover: alpha("#FFFFFF", 0.25),
        },
      },
    },
  },
};
