import React from 'react';
import login from '../../assets/img/login.png';
import './admin.css';
import { useNavigate } from 'react-router-dom';

const Admin = () => {

    //!Navegacion
  const navigate = useNavigate();

    const redirect = () => {
        navigate('../tablaAdminUsuarios');
    }

  return (
    <div className="Main">
        <div className='Main-titulo'>
            <h1>ADMINISTRADOR</h1>
        </div>

        <div className="Main-body-admin">
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
              <p>TURNOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='turnos'>VER</button>
          </div>

          <div className='item'>
              <p>ESTADOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='estados'>VER</button>
          </div>

          <div className='item'>
              <p>ATENCIONES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='atenciones'>VER</button>
          </div>
      </div>
    </div>
  )
}

export default Admin