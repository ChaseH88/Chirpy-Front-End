import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateUserPage } from './pages/CreateUserPage';
import { LoginPage } from './pages/LoginPage';
import { ReactQuery } from './providers/ReactQuery';
import { DashboardPage } from './pages/DashboardPage/Dashboard';

const App = (): JSX.Element => (
  <div className="App">
    <ReactQuery>
      <BrowserRouter>
        <Routes>
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ReactQuery>
  </div>
);

export default App;
