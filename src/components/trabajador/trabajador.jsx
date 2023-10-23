import React, {useState, useEffect} from 'react';
import './trabajador.css';
import { Sucursales, Turnos, Tipos_Consulta, Estados, Atenciones, Calificaciones, head } from '../../api/urls';
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
  const ventanilla = localStorage.getItem('ventanilla') || 0;
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
  const apiUrlEliminarAtencion = atencionesAPI.eliminarAtencionPorID();
  const apiUrlEliminarCalificacion = calificacionesAPI.eliminarCalificacionPorID();
  
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

      var horaFormateada = hora - 5 + ':' + (minutos < 10 ? '0' : '') + minutos;

      return horaFormateada;
  }

  //TODO: ATENDER TURNO
  const atender = (item) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";

    let fecha = new Date();

    let ml = fecha.getTime();

    const fechaFormateada = `\/Date(${ml})\/`;

    setFecha(fechaFormateada);

    const estado = 4;

    let userID = localStorage.getItem("user") || 0;

    let turnoID = item.ID_Turno;

    let atencion = {
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
          id_Atencion: response.data.NuevaAtencionResult.ID_Atencion,
          pregunta_1: 0,
          pregunta_2: 0,
          pregunta_3: 0,
          valoracion: 'NO CALIFICADO'
        }
        const urlNuevaCalificacion = calificacionesAPI.crearNuevaCalificacion();
   
        axios
            .post(urlNuevaCalificacion, nuevaCalificacion, head)
            .then((response) => {
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

    let ml = fecha.getTime();

    const fechaFormateada = `\/Date(${ml})\/`;

    const estado = 5;

    let userID = JSON.parse(localStorage.getItem("user"));

    let turnoID = turno.ID_Turno;

    let atencion = {
      id_Atencion: atencionActual.ID_Atencion,
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
    .then((response) => {
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    
    const urlActualizarTurno = turnosAPI.actualizarEstadoTurnoPorID();

    const nuevoTurno = {
      id_Turno: atencion.id_Turno,
      estado: 5
    }

    axios
    .put(urlActualizarTurno, nuevoTurno, head)
    .then((response) => {
      console.log("Actualizado")
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

    let modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  const cancelarAtencion = () => {
    let modal = document.getElementById("myModal");
    const id = {
      id_Atencion: atencionActual.ID_Atencion
    }

    axios
    .delete(apiUrlEliminarCalificacion, {data: {id_Atencion: id.id_Atencion}, headers: {
      'Content-Type': 'application/json',
    }})
    .then((response) => {
        axios
        .delete(apiUrlEliminarAtencion, {data: {id_Atencion: id.id_Atencion}, headers: {
          'Content-Type': 'application/json',
        }})
        .then((response) => {
            console.log(response.data);
            modal.style.display = "none";
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