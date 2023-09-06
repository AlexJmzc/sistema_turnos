import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import Home from './components/principal/home';
import Clientes from './components/clientes/clientes';
import Admin from './components/admin/admin';
import Trabajador from './components/trabajador/trabajador';
import TablaAdminUsuarios from './components/admin/tablas/tablaAdminUsuarios/tablaAdminUsuarios';
import { ValueProvider } from './components/contexto';

function App() {
  return (
    <BrowserRouter>
      <ValueProvider>
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/login" Component={Login} />
            <Route path='/clientes' Component={Clientes} />
            <Route path='/admin' Component={Admin}/>
            <Route path='/trabajador' Component={Trabajador}/>
            <Route path='/tablaAdminUsuarios' Component={TablaAdminUsuarios}/>
        </Routes>
      </ValueProvider>
    </BrowserRouter>
  );
}

export default App;
