import React, { useState }from 'react';
import logo from '../../assets/img/Logo.png';
import './login.css';
import { useValue } from '../contexto';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { urlUsuarios } from '../../api/urls';


const Login = () => {
  //URL API
  const apiUrl = urlUsuarios.login;

  //Logeo
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');

  //Usuario
  const [usuario, setUsuario] = useState([]);

  const nombreChange = (e) => {
    setNombre(e.target.value);
  }

  const claveChange = (e) => {
    setClave(e.target.value);
  }


  //Contexto
  const { selectedValue } = localStorage.getItem("sucursal");

  //Navegacion
  const navigate = useNavigate();

  //Login
  const Logeo = async () => {
    const response = await axios.get(apiUrl + "?nombre=" + nombre + "&clave=" + clave);

    const user = response.data;

    if(user.Clave != null) {
      setUsuario(user);
      localStorage.setItem("user", JSON.stringify(user.ID_Usuario));
      localStorage.setItem("token", JSON.stringify(user.Token));
      localStorage.setItem("rol", JSON.stringify(user.ID_Rol));
      Redireccion(user.ID_Rol);
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
            <h1>LOGIN</h1>
        </div>

        <div className='Main-formulario'>
            <div className='formulario'>
                <input type="text" placeholder='Usuario' onChange={nombreChange}/>

                <input type="password" placeholder='Clave' onChange={claveChange}/>
                
                <button className='Btn' onClick={Logeo}>Login</button>
                
            </div>
        </div>
    </div>
  )
}

export default Login;