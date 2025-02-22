import React, { useState, useEffect }from 'react';
import logo from '../../assets/img/Logo.png';
import './login.css';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Usuarios, Sucursales } from '../../api/urls';

const Login = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const sucursalesAPI = new Sucursales();
  const usuariosAPI = new Usuarios();

  //? Sucursal
  const [ selectedValue ] = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState();
  const [ventanilla, setVentanilla] = useState(0);

  const [arrayNumeros, setArray] = useState([]);

  //URL API
  const apiUrlSucursal = sucursalesAPI.sucursalPorID(selectedValue);

  //Logeo
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');


  //Usuario
  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    const sucursal = localStorage.getItem("sucursal");

    if(sucursal !== "" || sucursal !== null) {
      
    } else {
      navigate("/");
    }

  }, []);

  //! CARGA LA SUCURSAL ACTUAL
  useEffect(() => {
    axios
      .get(apiUrlSucursal)
      .then((response) => {
        setSucursal(response.data);
        setArray(array(response.data.Numero_Ventanillas));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sucursal, apiUrlSucursal]);

  const array = (n) => {
    const num = [];
    for (let i = 1; i <= n; i++) {
      num.push(i);
    }

    return num;
  }

  const nombreChange = (e) => {
    setNombre(e.target.value);
  }

  const claveChange = (e) => {
    setClave(e.target.value);
  }

  //!Metodo para seleccionar ventanilla
  const cambioVentanilla = (event) => {
    const value = event.target.value;
    setVentanilla(value);
    localStorage.setItem("ventanilla", value);
  };


  //Navegacion
  const navigate = useNavigate();

  //Login
  const Logeo = async () => {
    const url = usuariosAPI.logeo(nombre, clave);
    const response = await axios.get(url);

    const user = response.data;

    if(user.ID_Rol !== 0) {
      if(user.ID_Rol === 1) {
        setUsuario(user);
        localStorage.setItem("user", user.ID_Usuario);
        localStorage.setItem("token", user.Token);
        localStorage.setItem("rol", user.ID_Rol);
        Redireccion(user.ID_Rol);
      } else if(user.ID_Rol !== 1 && ventanilla === 0) {
        alert("Selecciona la ventanilla");
      } else {
        setUsuario(user);
        localStorage.setItem("user", user.ID_Usuario);
        localStorage.setItem("token", user.Token);
        localStorage.setItem("rol", user.ID_Rol);
        localStorage.setItem("ventanilla", ventanilla);
        Redireccion(user.ID_Rol);
      }
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
        navigate('/');
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

                <select id="ventanilla" onChange={cambioVentanilla}>
                  <option value='0'>Selecciona la ventanilla</option>
                  {arrayNumeros.map((numero) => (
                    <option key={numero} value={numero}>
                      {numero}
                    </option>
                  ))}
                </select>
                
                <button className='Btn' onClick={Logeo}>Login</button>
                
            </div>
        </div>
    </div>
  )
}

export default Login;