import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateFestival from './pages/CreateFestival';
import Inicio from './pages/Inicio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
        <Route path="/crear-festival" element={<CreateFestival />} />
        <Route path="/inicio" element={<Inicio />} />

      </Routes>
    </Router>
  );
}

export default App;
