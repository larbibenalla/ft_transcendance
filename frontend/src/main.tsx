import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "@fontsource/montserrat";
import theme from "./theme";
import store from "./app/store";
import BeatLoader from "react-spinners/BeatLoader";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <ChakraProvider theme={theme}>
        <Suspense fallback={<BeatLoader size={8} color="#FF8707" />}>
          <App />
        </Suspense>
      </ChakraProvider>
    </Router>
  </Provider>
);
