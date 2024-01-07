import { extendTheme } from "@chakra-ui/react";

import { modalTheme } from "./components/theme/modal";

export const colors = {
  poktBlue: "rgba(105,141,255, 1)",
  poktLime: "rgba(255,255,255, 1)",
  darkBlue: "rgba(35,31,32, 1)",
  darkOverlay: "rgba(255, 255, 255, 0.05)",
  warning: "rgba(247, 216, 88, 1)",
  error: "rgba(249, 50, 50, 1)",
  hover: {
    poktBlue: "rgba(29, 138, 237, 0.5)",
    // poktLime: "rgba(255,255,255, 0.5)",
    poktLime: "rgba(105,141,255, 1)",
    darkBlue: "rgba(24, 33, 41, 0.5)",
  },
  buttonHover: {
    poktBlue: "rgba(29, 138, 237, 0.2)",
    // poktLime: "rgba(185, 240, 0, 0.2)",
    // darkBlue: "rgba(24, 33, 41, 0.2)",
    poktLime: "rgba(105,141,255, 1)",
    darkBlue: "rgba(35,31,32, 0.5)",
  },
};

export const theme = extendTheme({
  colors,
  fonts: {
    body: `Manrope, system-ui, sans-serif`,
    heading: "Manrope, system-ui, sans-serif",
    mono: "Menlo, monospace",
  },
  configs: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  components: {
    Modal: modalTheme,
  },
  styles: {
    global: {
      "html, body": {
        color: "white",
        backgroundColor: "rgba(35,31,32, 1)",
        fontSize: "14px",
      },
    },
  },
});
