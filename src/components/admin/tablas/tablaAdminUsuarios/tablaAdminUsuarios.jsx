import React, { useState, useEffect } from 'react';
import './tablaAdminUsuarios.css';
    
const TablaAdminUsuarios = () => {
    const apiUrlUsuarios = 'http://localhost:3014/ServiciosTurnos.svc/ListaUsuarios';
    const apiUrlEstados = 'http://localhost:3014/ServiciosTurnos.svc/ListaEstados';
    const apiUrlRoles = 'http://localhost:3014/ServiciosTurnos.svc/ListaRoles';
    const apiTrabajadorID = 'http://localhost:3014/ServiciosTurnos.svc/Trabajador';

    const [datosUsuario, setDatosUsuario] = useState(['']);
    const [usuarios, setUsuarios] = useState(['']);
    const [estados, setEstados] = useState(['']);
    const [roles, setRoles] = useState(['']);
    const [busqueda, setBusqueda] = useState(['']);

    const fetchData = async (url, setData) => {
        try {
          
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error('Error al cargar la API:', error);
        }
    };

    const cedulasUsuarios = async() => {
        const datosUsuarios = [];
        for(let i = 0; i < usuarios.length; i++){
            const usu = usuarios[i];
            const cedula = await obtenerDatosTrabajador(apiTrabajadorID, usu.ID_Trabajador);

            datosUsuarios.push({
                id_Usuario: usu.ID_Usuario,
                nombre: usu.Nombre,
                clave: usu.Clave,
                cedula: cedula.Cedula,
                estado: parseInt(usu.Estado),
                id_Rol: usu.ID_Rol
            });
        }

        setDatosUsuario(datosUsuarios);
        setBusqueda(datosUsuario);
    }

    async function obtenerDatosTrabajador(url, valor) {
        try {
          const response = await fetch(url + '?id=' + valor);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error al obtener datos');
          return {};
        }
      }

    useEffect(() => {
        fetchData(apiUrlUsuarios, setUsuarios);
        fetchData(apiUrlEstados, setEstados);
        fetchData(apiUrlRoles, setRoles);
        cedulasUsuarios();
    }, [busqueda]);

    const buscar = () => {
        let estado = document.getElementById('estados').value;
        let est = 0, r = 0;

        if(estado > 0) {
            est = 1;
        }

        let rol = document.getElementById('roles').value;
        
        if(rol > 0) {
            r = 1;
        }

        let cedula = document.getElementById('buscador').value;

        let cadena = est.toString() + r.toString();
        
        let datosFiltrados = [];
        switch(cadena) {
            case '00':
                if(cedula !== '') {
                    datosFiltrados = busqueda.filter(item => item.cedula === cedula);
                    setBusqueda(datosFiltrados);
                    console.log(datosFiltrados);
                }

                break;

            case '01':
                datosFiltrados = busqueda.filter(item => item.id_Rol === parseInt(rol));

                if(cedula !== '') { 
                    datosFiltrados = datosFiltrados.filter(item => item.cedula === cedula);
                }

                setBusqueda(datosFiltrados);
                console.log(datosFiltrados);

                break;

            case '10':
                datosFiltrados = busqueda.filter(item => item.estado === parseInt(estado));

                if(cedula !== '') {
                    datosFiltrados = datosFiltrados.filter(item => item.cedula === cedula);
                }

                setBusqueda(datosFiltrados);

                console.log(datosFiltrados);

                break;

            case '11':
                datosFiltrados = busqueda.filter(item => item.id_Rol === parseInt(rol));

                datosFiltrados = busqueda.filter(item => item.estado === parseInt(estado));

                if(cedula !== '') {
                    datosFiltrados = datosFiltrados.filter(item => item.cedula === cedula);
                }

                setBusqueda(datosFiltrados);

                console.log(datosFiltrados);
                break;

            default:

                break;
        }
    }


  return (
    <div className="Main">
        <h1>Tabla de Administración</h1>
        <div className="Main-buscador">
            <select className="estados" id="estados">
                <option value="0">Estado</option>
                {estados.map((estado) => (
                    <option value={estado.ID_Estado}>{estado.Nombre}</option>
                ))}
            </select>

            <select className="roles" id="roles">
                <option value="0">Roles</option>
                {roles.map((rol) => (
                    <option value={rol.ID_Rol}>{rol.Nombre}</option>
                ))}
            </select>

            <input type="text" className='buscador' id='buscador' placeholder='Buscar'/>

            <button className='buscarButton' id='buscarButton' onClick={buscar}>Buscar</button>
        </div>
        <table className="styled-table">
            <thead>
                <tr>
                    <th>ID Usuario</th>
                    <th>Nombre</th>
                    <th>Clave</th>
                    <th>Trabajador</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {busqueda.map((item) => (
                    <tr>
                        <td>{item.id_Usuario}</td>
                        <td>{item.nombre}</td>
                        <td>{item.clave}</td>
                        <td>{item.cedula}</td>
                        <td>{item.id_Rol}</td>
                        <td>{item.estado}</td>
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