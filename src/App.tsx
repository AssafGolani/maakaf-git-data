import "@radix-ui/themes/styles.css";
import { ThemeProvider } from "./ThemeProvider";
import DataApp from "./components/DataApp.jsx";

import { Theme } from "@radix-ui/themes";

const App = function () {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Theme
        appearance="dark"
        accentColor="iris"
        grayColor="slate"
        scaling="100%"
      >
        {" "}
        <DataApp />
      </Theme>
    </ThemeProvider>
  );
};

export default App;
