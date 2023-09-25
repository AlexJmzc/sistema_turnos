import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import Home from './components/principal/home';
import Clientes from './components/clientes/clientes';
import Admin from './components/admin/admin';
import Trabajador from './components/trabajador/trabajador';
import TablaAdminUsuarios from './components/admin/tablas/tablaAdminUsuarios/tablaAdminUsuarios';
import TablaAdminAtenciones from './components/admin/tablas/tablaAdminAtenciones/tablaAdminAtenciones';
import Pantalla from './components/pantalla/pantalla';
import Calificacion from './components/calificacion/calificacion';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/login" Component={Login} />
            <Route path='/clientes' Component={Clientes} />
            <Route path='/admin' Component={Admin}/>
            <Route path='/trabajador' Component={Trabajador}/>
            <Route path='/pantalla' Component={Pantalla}/>
            <Route path='/calificacion' Component={Calificacion}/>
            <Route path='/tablaAdminUsuarios' Component={TablaAdminUsuarios}/>
            <Route path='/tablaAdminAtenciones' Component={TablaAdminAtenciones}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
