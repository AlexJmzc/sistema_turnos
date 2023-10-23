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
import TablaAdminTrabajadores from './components/admin/tablas/tablaAdminTrabajadores/tablaAdminTrabajadores';
import TablaAdminSucursales from './components/admin/tablas/tablaAdminSucursales/tablaAdminSucursales';
import TablaAdminRoles from './components/admin/tablas/tablaAdminRoles/tablaAdminRoles';
import TablaAdminConsultas from './components/admin/tablas/tablaAdminConsultas/tablaAdminConsultas';
import TablaAdminTurnos from './components/admin/tablas/tablaAdminTurnos/tablaAdminTurnos';

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
            <Route path='/tablaAdminTrabajadores' Component={TablaAdminTrabajadores}/>
            <Route path='/tablaAdminSucursales' Component={TablaAdminSucursales}/>
            <Route path='/tablaAdminRoles' Component={TablaAdminRoles}/>
            <Route path='/tablaAdminConsultas' Component={TablaAdminConsultas}/>
            <Route path='/tablaAdminTurnos' Component={TablaAdminTurnos}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
