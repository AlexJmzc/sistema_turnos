import React from 'react';
import login from '../../assets/img/login.png';
import './admin.css';

const Admin = () => {
  return (
    <div className="Main">
        <div className='Main-titulo'>
            <h1>ADMINISTRADOR</h1>
        </div>

        <div className="Main-body-admin">
          <div className='item'>
              <p>USUARIOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='queja'>VER</button>
          </div>

          <div className='item'>
              <p>TRABAJADORES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='cambios'>VER</button>
          </div>

          <div className='item'>
              <p>SUCURSALES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='consulta'>VER</button>
          </div>

          <div className='item'>
              <p>TIPOS DE CONSULTA</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='planilla'>VER</button>
          </div>

          <div className='item'>
              <p>ROLES</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='planilla'>VER</button>
          </div>

          <div className='item'>
              <p>TURNOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='planilla'>VER</button>
          </div>
      </div>
    </div>
  )
}

export default Admin