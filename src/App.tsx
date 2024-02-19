import { BrowserRouter } from 'react-router-dom';
import { AppDataProvider } from './providers/AppData';
import { ApolloProvider } from './providers/Apollo';
import { Routes as AppRoutes } from './components/Routes';

const App = (): JSX.Element => (
  <div className="App">
    <ApolloProvider>
      <AppDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppDataProvider>
    </ApolloProvider>
  </div>
);

export default App;
