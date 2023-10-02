import React, {useState, useEffect} from 'react';
import './trabajador.css';
import { Sucursales, Turnos, Tipos_Consulta, Estados, Atenciones, Calificaciones } from '../../api/urls';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Trabajador = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS APIS
  const sucursalesAPI = new Sucursales();
  const turnosAPI = new Turnos();
  const consultasAPI = new Tipos_Consulta();
  const estadosAPI = new Estados();
  const atencionesAPI = new Atenciones();
  const calificacionesAPI = new Calificaciones();

  //? CONSTANTES DE LA VENTANA
  //const token = localStorage.getItem('token');
  const ventanilla = localStorage.getItem('ventanilla');
  const [turnos, setTurnos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [selectedValue] = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState([]);
  const [turno, setTurno] = useState({});
  const [fechaInicio, setFecha] = useState();
  const [atencionActual, setAtencion] = useState([]);

  //! NAVEGACION
  const navigate = useNavigate();

  //! URL API
  const apiUrlTurnos = turnosAPI.turnosPorSucursalEstado(selectedValue, 3);
  const apiUrlSucursal = sucursalesAPI.sucursalPorID(selectedValue);
  const apiUrlConsultas = consultasAPI.listarTiposConsulta();
  const apiUrlEstados = estadosAPI.listarEstados();
  
  //! COMPROBACIÓN DE TOKEN Y ROL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if(token !== "" && rol === "2") {
      
    } else {
      navigate("/");
    }

  }, [])

  //! CARGA LOS TURNOS SACADOS EN DICHA SUCURSAL Y CON ESTADO EN ESPERA
  useEffect(() => {
    axios
      .get(apiUrlTurnos)
      .then((response) => {
        setTurnos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turnos, selectedValue, apiUrlTurnos])

  //! CARGA LA SUCURSAL ACTUAL
  useEffect(() => {
    axios
      .get(apiUrlSucursal)
      .then((response) => {
        setSucursal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sucursal, apiUrlSucursal]);

  //! CARGA LISTA DE TIPOS DE CONSULTA
  useEffect(() => {
    axios
      .get(apiUrlConsultas)
      .then((response) => {
        setTipos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [tipos, apiUrlConsultas]);

  //! CARGA LISTA DE ESTADOS
  useEffect(() => {
    axios
      .get(apiUrlEstados)
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [estados, apiUrlEstados]);

  //TODO: OBTENER TIPO DE CONSULTA
  const obtenerTipo = (id) => {
      if(tipos.length > 0) {
        const tConsulta = tipos.filter((item) => item.ID_Tipo_Consulta === id);  

        if(tConsulta[0] != null) {
          return tConsulta[0].Nombre;
        }

      } else {
        return 1;
      }
  }

  //TODO: OBTENER ESTADO DE TURNO
  const obtenerEstado = (id) => {
    if(estados.length > 0) {
      const tEstado = estados.filter((item) => item.ID_Estado === id);
      return tEstado[0].Nombre;
    } else {
      return 1;
    }
  }

  //TODO: OBTENER LA HORA DEL TURNO
  const obtenerHora = (f) => {
      var timestamp = parseInt(f.match(/\d+/)[0]);
      var fecha = new Date(timestamp);
      var hora = fecha.getHours();
      var minutos = fecha.getMinutes();

      var horaFormateada = hora + ':' + (minutos < 10 ? '0' : '') + minutos;

      return horaFormateada;
  }

  //TODO: ATENDER TURNO
  const atender = (item) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";

    let fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const dia = String(fecha.getDate()).padStart(2, '0'); 
    const hora = String(fecha.getHours()).padStart(2, '0'); 
    const minutos = String(fecha.getMinutes()).padStart(2, '0'); 

    const fechaF = `${anio}-${mes}-${dia} ${hora}:${minutos}`;

    //let ml = fecha.getTime();

    //const fechaFormateada = `\\/Date(${ml})\\/`;

    setFecha(fechaF);

    const estado = 4;

    let userID = JSON.parse(localStorage.getItem("user"));

    let turnoID = item.ID_Turno;

    let atencion = {
      ID_Usuario: userID,
      ID_Turno: turnoID,
      Ventanilla: ventanilla,
      Estado: estado,
      Fecha_Inicio: fechaF,
      Fecha_Final: fechaF,      
      Observacion: "NINGUNA"
    }

    const urlNuevaAtencion = atencionesAPI.crearNuevaAtencionGET(atencion.ID_Turno, atencion.ID_Usuario, atencion.Ventanilla, atencion.Estado, atencion.Fecha_Inicio, atencion.Fecha_Final, atencion.Observacion);
    let nuevaAtencion = [];
    axios
    .get(urlNuevaAtencion)
    .then((response) => {
        nuevaAtencion = response.data;
        setAtencion(nuevaAtencion);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

    const urlNuevaCalificacion = calificacionesAPI.crearNuevaCalificacion(atencionActual.ID_Atencion, 0, 0, 0, 'NO CALIFICADO');
    axios
    .get(urlNuevaCalificacion)
    .then((response) => {
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });


    const urlActualizarTurno = turnosAPI.actualizarEstadoTurnoPorID(item.ID_Turno, 4);
    axios
      .get(urlActualizarTurno)
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setTurno(item);
  }

  //TODO: FINALIZAR ATENCION
  const completarAtencion = (e) => {
    let observacion = document.getElementById('observaciones').value;

    if(observacion === '') {
      observacion = 'NINGUNA';
    }

    let fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const dia = String(fecha.getDate()).padStart(2, '0'); 
    const hora = String(fecha.getHours()).padStart(2, '0'); 
    const minutos = String(fecha.getMinutes()).padStart(2, '0'); 

    const fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minutos}`;


    //let ml = fecha.getTime();

    //const fechaFormateada = `\\/Date(${ml})\\/`;

    const estado = 5;

    let userID = JSON.parse(localStorage.getItem("user"));

    let turnoID = turno.ID_Turno;

    let atencion = {
      ID_Atencion: atencionActual.ID_Atencion,
      ID_Usuario: userID,
      ID_Turno: turnoID,
      Ventanilla: ventanilla,
      Estado: estado,
      Fecha_Inicio: fechaInicio,
      Fecha_Final: fechaFormateada,      
      Observacion: observacion
    }
    
    const urlActualizarAtencion = atencionesAPI.actualizarAtencionPorID(atencion.ID_Atencion, atencion.ID_Turno, atencion.ID_Usuario, atencion.Ventanilla, atencion.Estado, atencion.Fecha_Inicio, atencion.Fecha_Final, atencion.Observacion);
    axios
    .get(urlActualizarAtencion)
    .then((response) => {
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    
    const urlActualizarTurno = turnosAPI.actualizarEstadoTurnoPorID(atencion.ID_Turno, 5);
    axios
    .get(urlActualizarTurno)
    .then((response) => {
      setEstados(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

    let modal = document.getElementById("myModal");

    modal.style.display = "none";
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
            <h1>ATENCIÓN DE TURNOS</h1>
            <button className='btnLogout' onClick={logout}>Cerrar Sesión</button>
        </div>

        <table className="styled-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Sucursal</th>
                    <th>Motivo Consulta</th>
                    <th>Numero de Turno</th>
                    <th>Estado</th>
                    <th>Hora</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {turnos.map((item, index) => (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{sucursal.Nombre}</td>
                        <td>{obtenerTipo(item.ID_Tipo_Consulta)}</td>
                        <td>{item.Numero_Turno}</td>
                        <td>{obtenerEstado(item.Estado)}</td>
                        <td>{obtenerHora(item.Fecha)}</td>
                        <td>
                            {index === 0 ? (
                              <button className='btnAtencion slide_diagonal' onClick={() => atender(item)}>ATENDER</button>
                            ) : null}
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-body">
                <header>SUCURSAL {sucursal.Nombre}</header>
                <p id="">MOTIVO: {obtenerTipo(turno.ID_Tipo_Consulta)}</p>
                <p id="">TURNO NÚMERO {turno.Numero_Turno}</p>
                <textarea type="text" rows="4" className='observaciones' id='observaciones' placeholder='Ingrese las observaciones' maxLength='200'/>
                <br/>
                <div className="botones">
                  <button className="btnAceptar" onClick={completarAtencion}>ACEPTAR</button>
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Trabajador