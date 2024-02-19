import { BrowserRouter } from 'react-router-dom';
import { AppDataProvider } from './providers/AppData';
import { Routes as AppRoutes } from './components/Routes';

const App = (): JSX.Element => (
  <div className="App">
    <AppDataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppDataProvider>
  </div>
);

export default App;
