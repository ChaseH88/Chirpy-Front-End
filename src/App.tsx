import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/Auth";
import { AppDataProvider } from "./providers/AppData";
import { ApolloProvider } from "./providers/Apollo";
import { MessageProvider } from "./providers/Message/MessageProvider";
import { Routes as AppRoutes } from "./components/Routes";
import { GlobalStyle } from "./utilities/global-styles";
import { SnackbarProvider } from "notistack";
import { ModalProvider } from "./providers/Modal/ModalProvider";

const App = (): JSX.Element => (
  <div className="App">
    <ApolloProvider>
      <BrowserRouter>
        <SnackbarProvider maxSnack={5}>
          <AuthProvider>
            <AppDataProvider>
              <MessageProvider>
                <ModalProvider>
                  <AppRoutes />
                </ModalProvider>
              </MessageProvider>
            </AppDataProvider>
          </AuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </ApolloProvider>
    <GlobalStyle />
  </div>
);

export default App;
