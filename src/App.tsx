import { BrowserRouter } from 'react-router-dom';
import { ReactQuery } from './providers/ReactQuery';
import { AppDataProvider } from './providers/AppData';
import { Routes as AppRoutes } from './components/Routes';

const App = (): JSX.Element => (
  <div className="App">
    <ReactQuery>
      <AppDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppDataProvider>
    </ReactQuery>
  </div>
);

export default App;
