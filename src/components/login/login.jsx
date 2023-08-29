import React, { useState }from 'react';
import logo from '../../assets/img/Logo.png';
import './login.css';
import { useValue } from '../contexto';
import { useNavigate } from 'react-router';
import axios from 'axios';


const Login = () => {
  //URL API
  const apiUrl = 'http://localhost:3014/ServiciosTurnos.svc/Usuario';

  //Logeo
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');

  //Usuario
  const [usuario, setUsuario] = useState('');

  //Contexto
  const { selectedValue } = useValue();

  //Navegacion
  const navigate = useNavigate();

  //Login
  const Logeo = (event) => {
    event.preventDefault();
    axios.get(apiUrl + "?nombre=" + nombre + "&clave=" + clave)
    .then(response => {
      setUsuario(response.data);
    }).catch(error => {
      console.error("Error fetching data:", error);
    });

    if(usuario) {
      Redireccion(usuario.ID_Rol);
    } else {
      alert('Usuario o contraseña incorrectos');
    }

  }

  const Redireccion = (rol) => {
    switch(rol){
      case 1:
        navigate('/admin');
        break;

      case 2:
        navigate('/trabajador');
        break;

      default:
        navigate();
    }
  }

  return (
    <div className='Main'>
        <div className="Main-header">
            <img src={logo} alt="" />
            <h1>{selectedValue}</h1>
        </div>

        <div className='Main-formulario'>
            <form className='formulario'>
                <input type="text" placeholder='Usuario' value={nombre} onChange={(e) => setNombre(e.target.value)}/>

                <input type="text" placeholder='Clave' value={clave} onChange={(e) => setClave(e.target.value)}/>
                
                <button className='Btn' type='submit' onClick={Logeo}>Login</button>
                
            </form>
        </div>
    </div>
  )
}

export default Login;