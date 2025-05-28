import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<div className="p-4">Bienvenido a MiFestival 🎵</div>} />
        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
