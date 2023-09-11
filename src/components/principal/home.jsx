import React, { useEffect, useState } from 'react';
import login from '../../assets/img/login.png';
import logo from '../../assets/img/Logo.png';
import ticket from '../../assets/img/ticket.png';
import './home.css';
import { useValue } from '../contexto';
import { useNavigate } from 'react-router-dom';
import { urlSucursales } from '../../api/urls';
import axios from 'axios';

const Home = () => {
  //!URL API
  const apiUrl = urlSucursales.obtenerTodasLasSucursales;

  //!Navegacion
  const navigate = useNavigate();

  //!Contexto
  const { setSelectedValue } = useValue();
  const [selectedOption, setSelectedOption] = useState('');

  //!Sucursales
  const [sucursales, setSucursales] = useState([]);

  //!Consumo API Sucursales
  useEffect(() => {
    axios.get(apiUrl)
    .then(response => {
      setSucursales(response.data);
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  //!Metodo para seleccionar sucursal
  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setSelectedValue(value);
  };

  //!Redireccionamiento
  const handleRedirect = (event) => {
    const btn = event.target.id;

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
                {sucursales.map(item => (
                    <option value={item.ID_Sucursal}>{item.Nombre}</option>
                ))}
              </select>
            </span>
          </div>
      </div>
    </div>
  )
}

export default Home;