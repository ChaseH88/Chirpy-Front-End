import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateUserPage } from './pages/CreateUserPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
