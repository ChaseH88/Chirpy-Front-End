import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/Auth";
import { AppDataProvider } from "./providers/AppData";
import { ApolloProvider } from "./providers/Apollo";
import { Routes as AppRoutes } from "./components/Routes";
import { GlobalStyle } from "./utilities/global-styles";

const App = (): JSX.Element => (
  <div className="App">
    <ApolloProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppDataProvider>
            <AppRoutes />
          </AppDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
    <GlobalStyle />
  </div>
);

export default App;
