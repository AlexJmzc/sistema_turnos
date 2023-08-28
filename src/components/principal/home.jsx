import React, { useState } from 'react';
import login from '../../assets/img/login.png';
import logo from '../../assets/img/Logo.png';
import ticket from '../../assets/img/ticket.png';
import './home.css';
import { useValue } from '../contexto';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  //Navegacion
  const navigate = useNavigate();

  //Contexto
  const { setSelectedValue } = useValue();
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setSelectedValue(value);
  };

  const handleRedirect = (event) => {
    const btn = event.target.id;
    console.log(btn);
    if(selectedOption === '') {
      console.log('Seleccione una sucursal');
      alert('Seleccione una sucursal');
    } else {
      switch(btn){
        case 'login':
          navigate('login');
          break;

        case 'clientes':
          navigate('clientes');
          break;

        default:
          break;
      }
    }
  };

  return (
    <div className="Main">
      <div className='Main-titulo'>
        <h1>SISTEMA DE GESTIÓN DE TURNOS</h1>
      </div>
      <div className="Main-header">
          <img src={logo} alt='Logo EMAPA'></img>
      </div>
      <div className="Main-body">
          <div className='card'>
              <img src={login} alt=''></img>
              <button className='Btn' id='login' onClick={handleRedirect}>LOGIN</button>
          </div>

          <div className='card'>
              <img src={ticket} alt=''></img>
              
              <button className='Btn' id='clientes' onClick={handleRedirect}>CLIENTES</button>
          </div>

          <div className='card'>
            <span className="custom-dropdown">
              <select id='sucursales' className='sucursales' value={selectedOption} onChange={handleSelectChange}>
                <option value=''>Selecciona una sucursal</option>
                <option value='1'>SUCURSAL 1</option>
                <option value='2'>SUCURSAL 2</option>
              </select>
            </span>
          </div>
      </div>
    </div>
  )
}

export default Home;