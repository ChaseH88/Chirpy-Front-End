import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/Auth';
import { AppDataProvider } from './providers/AppData';
import { ApolloProvider } from './providers/Apollo';
import { Routes as AppRoutes } from './components/Routes';

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
  </div>
);

export default App;
