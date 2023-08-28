import React, { useState }from 'react';
import logo from '../../assets/img/Logo.png';
import './login.css';
import { useValue } from '../contexto';
import { useNavigate } from 'react-router';
import axios from 'axios';


const Login = () => {
  const apiUrl = 'http://localhost:3014/ServiciosTurnos.svc/Usuario';

  //Logeo
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');

  //Usuario
  const [usuario, setUsuario] = useState('');

  //Contexto
  const { selectedValue } = useValue();
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/trabajador');
  }
  const Logeo = (event) => {
      e
      axios.get(apiUrl + "")
      .then(response => {
        setUsuarios(response.data);
      }).catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <div className='Main'>
        <div className="Main-header">
            <img src={logo} alt="" />
            <h1>{selectedValue}</h1>
        </div>

        <div className='Main-formulario'>
            <form action="" className='formulario'>
                <input type="text" placeholder='Usuario'/>

                <input type="password" placeholder='Clave'/>

                
                <button className='Btn' type='submit' onClick={Logeo}>Login</button>
                
            </form>
        </div>
    </div>
  )
}

export default Login;