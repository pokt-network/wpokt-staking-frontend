import "@fontsource/manrope"
import { extendTheme } from "@chakra-ui/react";
import { modalTheme } from "./components/theme/modal";

export const theme = extendTheme({
  fonts: {
    heading: `'manrope', sans-serif`,
    body: `'manrope', sans-serif`,
  },
  colors: {
    poktBlue: "rgba(29, 138, 237, 1)",
    poktLime: "rgba(185, 240, 0, 1)",
    darkBlue: "rgba(24, 33, 41, 1)",
    darkOverlay: "rgba(255, 255, 255, 0.05)",
    warning: "rgba(247, 216, 88, 1)",
    error: "rgba(249, 50, 50, 1)",
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
        backgroundColor: "rgba(24, 33, 41, 1)",
        fontSize: "14px",
      },
    },
  },
});
