import React, {useState, useEffect} from 'react';
import './trabajador.css';
import { Sucursales, Turnos, Tipos_Consulta, Estados, Atenciones, Calificaciones, head, Usuarios } from '../../api/urls';
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
  const usuariosAPI = new Usuarios();

  //? CONSTANTES DE LA VENTANA
  const token = localStorage.getItem('token');
  const ventanilla = localStorage.getItem('ventanilla') || 0;
  const [turnos, setTurnos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [selectedValue] = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState([]);
  const [turno, setTurno] = useState({});
  const [fechaInicio, setFecha] = useState();
  const [atencionActual, setAtencion] = useState([]);
  const [turnoActual, setTurnoActual] = useState([]);

  //!FECHA
  let fechaActual = new Date();
  let año = fechaActual.getFullYear();
  let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
  let dia = fechaActual.getDate().toString().padStart(2, '0');
  let fechaFormateada = `${año}-${mes}-${dia}`;

  //! NAVEGACION
  const navigate = useNavigate();

  //! URL API
  const apiUrlSucursal = sucursalesAPI.sucursalPorID(selectedValue);
  const apiUrlConsultas = consultasAPI.listarTiposConsulta();
  const apiUrlEstados = estadosAPI.listarEstados();
  const apiUrlEliminarAtencion = atencionesAPI.eliminarAtencionPorID();
  const apiUrlEliminarCalificacion = calificacionesAPI.eliminarCalificacionPorID();
  const apiUrlValidacionToken = usuariosAPI.validarToken(token, 'TRABAJADOR');
  const apiUrlTurnos = turnosAPI.turnosPorSucursalEstadoDia(selectedValue, 3, fechaFormateada);
  
  //! COMPROBACIÓN DE TOKEN Y ROL
  useEffect(() => {
    axios
      .get(apiUrlValidacionToken, head)
      .then((response) => {
        if(!response.data) {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

  }, [])

  //! CARGA LOS TURNOS SACADOS EN DICHA SUCURSAL EN ESE DIA Y CON ESTADO EN ESPERA
  useEffect(() => {
    axios
      .get(apiUrlTurnos)
      .then((response) => {
        setTurnos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turnos, selectedValue])

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

      var horaFormateada = hora + 6  + ':' + (minutos < 10 ? '0' : '') + minutos;

      return horaFormateada;
  }

  //TODO: ATENDER TURNO
  const atender = (item) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";

    let fecha = new Date();

    let ml = fecha.getTime();

    const horas = 5 * 60 * 60 * 1000;

    const nuevaFecha = ml - horas;
    const fechaFormateada = `\/Date(${nuevaFecha})\/`;

    setFecha(fechaFormateada);

    const estado = 4;

    let userID = localStorage.getItem("user") || 0;

    let turnoID = item.ID_Turno;

    setTurnoActual(turnoID);

    const atencion = {
      id_Usuario: parseInt(userID),
      id_Turno: parseInt(turnoID),
      ventanilla: ventanilla,
      estado: estado,
      fecha_Inicio: fechaFormateada,
      fecha_Final: fechaFormateada,      
      observacion: "NINGUNA"
    }


    const urlNuevaAtencion = atencionesAPI.crearNuevaAtencionPOST();
    
    axios
      .post(urlNuevaAtencion, atencion, head)
      .then((response) => {
          setAtencion(response.data.NuevaAtencionResult);

          const nuevaCalificacion = {
            id_Atencion: response.data.NuevaAtencionResult,
            pregunta_1: 0,
            pregunta_2: 0,
            pregunta_3: 0,
            valoracion: 'NO CALIFICADO'
          }
          const urlNuevaCalificacion = calificacionesAPI.crearNuevaCalificacion();
    
          axios
              .post(urlNuevaCalificacion, nuevaCalificacion, head)
              .then((response) => {
                console.log("NUEVA CAL")
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
              });
              })
      .catch((error) => {
        console.error("Error fetching data:", error);
    });


    const urlActualizarTurno = turnosAPI.actualizarEstadoTurnoPorID();
    const nuevoTurno = {
      id_Turno: item.ID_Turno,
      estado: 4
    }

    axios
      .put(urlActualizarTurno, nuevoTurno, head)
      .then(() => {
        console.log("cambiado estado")
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

    let ml = fecha.getTime();


    const horas = 5 * 60 * 60 * 1000;

    const nuevaFecha = ml - horas;
    const fechaFormateada = `\/Date(${nuevaFecha})\/`;

    const estado = 5;

    let userID = JSON.parse(localStorage.getItem("user"));

    let turnoID = turnoActual;

    let atencion = {
      id_Atencion: atencionActual,
      id_Usuario: userID,
      id_Turno: turnoID,
      ventanilla: ventanilla,
      estado: estado,
      fecha_Inicio: fechaInicio,
      fecha_Final: fechaFormateada,      
      observacion: observacion
    }
    
    const urlActualizarAtencion = atencionesAPI.actualizarAtencionPorID();
    axios
    .put(urlActualizarAtencion, atencion, head)
    .then(() => {
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    
    const urlActualizarTurno = turnosAPI.actualizarEstadoTurnoPorID();

    const nuevoTurno = {
      id_Turno: turnoActual,
      estado: 5
    }

    axios
    .put(urlActualizarTurno, nuevoTurno, head)
    .then(() => {
      document.getElementById('observaciones').value = "";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

    let modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  const cancelarAtencion = () => {
    let modal = document.getElementById("myModal");

    const urlActualizarTurno = turnosAPI.actualizarEstadoTurnoPorID();

    const nuevoTurno = {
      id_Turno: turnoActual,
      estado: 3
    }

    const id = {
      id_Atencion: atencionActual
    }

    axios
    .delete(apiUrlEliminarCalificacion, {data: {id_Atencion: id.id_Atencion}, headers: {
      'Content-Type': 'application/json',
    }})
    .then(() => {
      document.getElementById('observaciones').value = "";
        axios
        .delete(apiUrlEliminarAtencion, {data: {id_Atencion: id.id_Atencion}, headers: {
          'Content-Type': 'application/json',
        }})
        .then(() => {
            axios.put(urlActualizarTurno, nuevoTurno, head)
            .then(() => {
              modal.style.display = "none";
             })
            .catch((error) => {
              console.error("Error fetching data:", error);
             })
            
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
        })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
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
                  <button className="btnCancelar" onClick={cancelarAtencion}>CANCELAR</button>
                  <button className="btnAceptar" onClick={completarAtencion}>ACEPTAR</button>
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Trabajador