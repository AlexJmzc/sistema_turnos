import React, { useState, useEffect } from 'react';
import './tablaAdminUsuarios.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Usuarios, Trabajadores, Estados, Roles } from '../../../../api/urls';
    
const TablaAdminUsuarios = () => {
    //? INSTANCIAS DE LAS CLASES DE LAS API
    const usuariosAPI = new Usuarios();
    const trabajadoresAPI = new Trabajadores();
    const estadosAPI = new Estados();
    const rolesAPI = new Roles();

    //? VARIABLES DE LA VENTANA
    const [datosUsuario, setDatosUsuario] = useState(['']);
    const [trabajadores, setTrabajadores] = useState(['']);
    const [usuarios, setUsuarios] = useState(['']);
    const [estados, setEstados] = useState(['']);
    const [roles, setRoles] = useState(['']);

    //? VARIABLES DE BUSQUEDA
    const [rol, setRol] = useState(0);
    const [estado, setEstado] = useState(0);
    const [cadena, setCadena] = useState('');

    //! URL
    const apiUrlUsuarios = usuariosAPI.listaDatosUsuarios();
    const apiUrlTrabajadores = trabajadoresAPI.listaTrabajadores();
    const apiUrlEstados = estadosAPI.listarEstados();
    const apiUrlRoles = rolesAPI.listarRoles();

    //! NAVEGACION
    const navigate = useNavigate();

    const fetchData = async (url, setData) => {
        try {
          
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error('Error al cargar la API:', error);
        }
    };

    //! COMPROBACIÓN DE TOKEN Y ROL
    useEffect(() => {
        const token = localStorage.getItem("token");
        const rol = localStorage.getItem("rol");

        if(token !== "" && rol === "1") {
        
        } else {
        navigate("/");
        }

    }, [])

    //! CARGA DE USUARIOS, ESTADOS Y ROLES
    useEffect(() => {
        fetchData(apiUrlUsuarios, setUsuarios);
        fetchData(apiUrlEstados, setEstados);
        fetchData(apiUrlRoles, setRoles);
    }, [usuarios, estados, roles]);

    //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
    useEffect(() => {
        const filtered = usuarios.filter(item => {
            const matchesRol = rol === 0 || item.ID_Rol === rol;
            const matchesEstado = estado === 0 || item.Estado === estado;
            const matchesCadena = cadena === '' || 
                    item.Nombre.toLowerCase().includes(cadena.toLowerCase()) ||
                    item.Nombre_Trabajador.toLowerCase().includes(cadena.toLowerCase()) ||
                    item.Cedula.toLowerCase().includes(cadena.toLowerCase());
      
            return matchesRol && matchesEstado && matchesCadena;
          });
           
        setDatosUsuario(filtered);
        
        
    }, [usuarios, rol, estado, cadena]);

    

     //! CARGA LOS TRABAJADORES
    useEffect(() => {
      axios
        .get(apiUrlTrabajadores)
        .then((response) => {
            setTrabajadores(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, [trabajadores, apiUrlTrabajadores])

    //TODO: OBTENER TRABAJADOR
    const obtenerTrabajador = (id) => {
        if(trabajadores.length > 0) {
        const trabajador = trabajadores.filter((item) => item.ID_Trabajador === id);  
            if(trabajador[0] != null) {
                let tr = {
                    Cedula: trabajador[0].Cedula,
                    Nombre: trabajador[0].Primer_Nombre + " " + trabajador[0].Segundo_Nombre + " " + trabajador[0].Primer_Apellido + " " + trabajador[0].Segundo_Apellido
                }
                return tr;
            } else {
            return 1;
            }
       }
    }

    //TODO: OBTENER ROL
    const obtenerRol = (id) => {
        if(roles.length > 0) {
        const rol = roles.filter((item) => item.ID_Rol === id);  
            if(rol[0] != null) {
                return rol[0].Nombre;
            } else {
            return 1;
            }
       }
    }

    //TODO: OBTENER ESTADO
    const obtenerEstado = (id) => {
        if(estados.length > 0) {
        const estado = estados.filter((item) => item.ID_Estado === id);  
            if(estado[0] != null) {
                return estado[0].Nombre;
            } else {
            return 1;
            }
       }
    }

    //TODO: CAMBIO DE ESTADO SELECT ROLES
    const cambioRol = (e) => {
        const dato = parseInt(e.target.value);
        setRol(dato);
    }

    //TODO: CAMBIO DE ESTADO SELECT ESTADOS 
    const cambioEstado = (e) => {
        const dato = parseFloat(e.target.value);
        setEstado(dato);
    }

    //TODO: CAMBIO DE ESTADO INPUT CADENA
    const cambioCadena = (e) => {
        const dato = e.target.value;
        setCadena(dato);
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
        <div className="Main-titulo">
            <h1>Tabla de administración de usuarios</h1>
            <button className='btnLogout' onClick={logout}>Cerrar Sesión</button>
        </div>
        <div className="Main-buscador">
            <select className="estados" id="estados" onChange={cambioEstado}>
                <option value="0">Estado</option>
                {estados.slice(0,2).map((estado) => (
                    <option value={estado.ID_Estado}>{estado.Nombre}</option>
                ))}
            </select>

            <select className="roles" id="roles" onChange={cambioRol}>
                <option value="0">Roles</option>
                {roles.map((rol) => (
                    <option value={rol.ID_Rol}>{rol.Nombre}</option>
                ))}
            </select>

            <input type="text" className='buscador' id='buscador' placeholder='Buscar' onChange={cambioCadena}/>
        </div>
        <table className="styled-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Clave</th>
                    <th>Cedula</th>
                    <th>Nombre Trabajador</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {datosUsuario.map((item) => (
                    <tr>
                        <td>{item.Nombre}</td>
                        <td>{item.Clave}</td>
                        <td>{item.Cedula}</td>
                        <td>{item.Nombre_Trabajador}</td>
                        <td>{obtenerRol(item.ID_Rol)}</td>
                        <td>{obtenerEstado(item.Estado)}</td>
                        <td>
                            <button>Editar</button>
                        </td>
                        <td>
                            <button>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default TablaAdminUsuarios;