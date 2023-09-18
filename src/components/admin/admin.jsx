import React, {useState, useEffect} from 'react';
import login from '../../assets/img/login.png';
import './admin.css';
import { useNavigate } from 'react-router-dom';

const Admin = () => {

  //!Navegacion
  const navigate = useNavigate();

  //! COMPROBACIÓN DE TOKEN Y ROL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if(token !== "" && rol === "1") {
      
    } else {
      navigate("../login");
    }

  }, [])

  const redirect = (event) => {
    const btn = event.target.id;

    switch(btn) {
        case 'atenciones':
            navigate('../tablaAdminAtenciones');
            break;

        case 'usuarios':
            navigate('../tablaAdminUsuarios');
            break;

        case 'trabajadores':
            navigate('../tablaAdminTrabajadores');
            break;

        case 'sucursales':
            navigate('../tablaAdminSucursales');
            break;

        case 'consultas':
            navigate('../tablaAdminConsultas');
            break;

        case 'roles':
            navigate('../tablaAdminRoles');
            break;

        case 'turnos':
            navigate('../tablaAdminTurnos');
            break;

        case 'estados':
            navigate('../tablaAdminEstados');
            break;

        default:

    }
  }

  //TODO: LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Sucursal");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="Main">
        <div className='Main-titulo'>
            <h1>ADMINISTRADOR</h1>
            <button className='btnLogout' onClick={logout}>Cerrar Sesión</button>
        </div>

        <div className="Main-body-admin">
          <div className='item'>
              <p>ATENCIONES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='atenciones' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>TURNOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='turnos'>VER</button>
          </div>

          <div className='item'>
              <p>USUARIOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='usuarios' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>TRABAJADORES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='trabajadores'>VER</button>
          </div>

          <div className='item'>
              <p>SUCURSALES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='sucursales'>VER</button>
          </div>

          <div className='item'>
              <p>TIPOS DE CONSULTA</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='consultas'>VER</button>
          </div>

          <div className='item'>
              <p>ROLES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='roles'>VER</button>
          </div>

          <div className='item'>
              <p>ESTADOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='estados'>VER</button>
          </div>
      </div>
    </div>
  )
}

export default Admin