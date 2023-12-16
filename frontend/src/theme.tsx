import {
  //  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
// import Color from "color";

// const lighten = (clr, value) => Color(clr).lighten(value).hex().toString();
// const darken = (clr, value) => Color(clr).darken(value).hex().toString();

const Drawer = {
  sizes: {
    menu: {
      dialog: { maxWidth: "150px" },
    },
  },
};

const theme = extendTheme({
  colors: {
    pong_bg_primary: "#333333",
    pong_bg_secondary: "#454545",
    pong_bg_third: "#535353",
    pong_bg_fourth: "#5A5A5A",
    pong_bg: {
      100: "#333333",
      200: "#454545",
      300: "#535353",
      400: "#5A5A5A",
      500: "#676767",
      600: "#808080",
      700: "#939393",
      800: "#E0E0E0",
    },
    pong_cl_primary: "#FF8707",
    pong_cl: {
      100: "#FB6613",
      200: "#FF6D00",
      300: "#FF7900",
      400: "#FF7F00",
      500: "#FF8707",
      600: "#FF9100",
      700: "#FFA000",
    },
  },

  components: {
    Drawer,
  },
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`,
  },
  styles: {
    global: {
      html: {
        height: "100%",
        width: "100%",
        m: 0,
        p: 0,
        fontFamily: `'Montserrat', sans-serif`,
      },
      body: {
        display: "flex",
        direction: "row",
        justifyContent: "center",
        alignItems: "start",
        position: "relative",
        margin: 0,
        paddng: 0,
        boxSizing: "border-box",
        bg: "pong_bg_primary",
        color: "whiteAlpha.900",
        fontFamily: `'Montserrat', sans-serif`,
        textDecoration: "none",
      },
      a: {
        textDecoration: "none",
      },
    },
  },
});

export default theme;
