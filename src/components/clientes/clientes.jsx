import React from 'react';
import './clientes.css';
import { useValue } from '../contexto';
import login from '../../assets/img/Logo.png';

const Clientes = () => {
  const { selectedValue } = useValue();

  return (
    <div className="Main">
      <div className='Main-titulo'>
        <h1>TURNOS</h1>
      </div>

      <div className="Main-body-clientes">
          <div className='item'>
              <p>QUEJAS Y RECLAMOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='queja'>TURNO</button>
          </div>

          <div className='item'>
              <p>CAMBIOS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='cambios'>TURNO</button>
          </div>

          <div className='item'>
              <p>CONSULTAS</p>
              <img src={login} alt=''></img>
              <button className='Btn' id='consulta'>TURNO</button>
          </div>

          <div className='item'>
              <p>CONSULTA PLANILLA DE AGUA</p>
              <img src={login} alt=''></img>
              <a href="http://186.42.184.58:8989/Consulta/consultar.aspx">
                <button className='Btn' id='planilla'>CONSULTA</button>
              </a>
          </div>
      </div>
    </div>
  )
}

export default Clientes;