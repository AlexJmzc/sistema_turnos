import React, { useEffect } from 'react';
import login from '../../assets/img/login.png';
import './admin.css';
import { useNavigate } from 'react-router-dom';
import { Usuarios, head } from '../../api/urls';
import axios from 'axios';

const Admin = () => {
  const usuariosAPI = new Usuarios();

  const token = localStorage.getItem('token');

  const apiUrlValidacionToken = usuariosAPI.validarToken(token, 'ADMIN');

  //!Navegacion
  const navigate = useNavigate();

  //! COMPROBACIÓN DE TOKEN Y ROL
  useEffect(() => {
    axios
      .get(apiUrlValidacionToken, head)
      .then((response) => {
        if(!response.data) {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

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
              <button className='Btn' id='turnos' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>USUARIOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='usuarios' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>TRABAJADORES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='trabajadores' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>SUCURSALES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='sucursales' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>TIPOS DE CONSULTA</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='consultas' onClick={redirect}>VER</button>
          </div>

          <div className='item'>
              <p>ROLES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='roles' onClick={redirect}>VER</button>
          </div>
      </div>
    </div>
  )
}

export default Admin