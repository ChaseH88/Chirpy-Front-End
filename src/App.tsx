import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateUserPage } from './pages/CreateUserPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/create-user" element={<CreateUserPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
