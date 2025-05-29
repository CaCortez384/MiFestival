import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateFestival from './pages/CreateFestival';
import Inicio from './pages/Inicio';
import MisFestivales from './pages/MisFestivales';
import Festival from './pages/Festival';
import EditarFestival from './pages/EditarFestival';


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
        <Route path="/mis-festivales" element={<MisFestivales />} />
        <Route path="/festival/:id" element={<Festival />} />
        <Route path="/festival/:id/artistas" element={<Festival />} />
        <Route path="/editarFestival/:id" element={<EditarFestival />} />

      </Routes>
    </Router>
  );
}

export default App;
