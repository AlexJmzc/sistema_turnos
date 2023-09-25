import React, {useState, useEffect} from 'react';
import './trabajador.css';
import { urlSucursales } from '../../api/urls';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Trabajador = () => {
  //? CONSTANTES DE LA VENTANA
  const token = localStorage.getItem('token');
  const ventanilla = localStorage.getItem('ventanilla');
  const [turnos, setTurnos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [selectedValue] = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState([]);
  const [turno, setTurno] = useState({});
  const [fechaInicio, setFecha] = useState();

  //! NAVEGACION
  const navigate = useNavigate();

  //! URL API
  const apiUrlTurnos = "http://localhost:3014/ServiciosTurnos.svc/TurnosSucursalEstado?";
  const apiUrlSucursal = urlSucursales.obtenerSucursal + selectedValue;
  const apiUrlConsultas = "http://localhost:3014/ServiciosTurnos.svc/ListaTiposConsulta";
  const apiUrlEstados = "http://localhost:3014/ServiciosTurnos.svc/ListaEstados";
  const apiUrlActualizarTurno = "http://localhost:3014/ServiciosTurnos.svc/EliminarTurno?id_Turno=";
  const apiUrlNuevaAtencion = "http://localhost:3014/ServiciosTurnos.svc/NuevaAtencion";
  const apiUrlActualizarAtencion = "http://localhost:3014/ServiciosTurnos.svc/ActualizarAtencion";
  const apiUrlEliminarAtencion = "http://localhost:3014/ServiciosTurnos.svc/EliminarAtencion";
  
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
      .get(apiUrlTurnos + "id=" + selectedValue + "&idEstado=3")
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
  }, [tipos]);

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
  }, [estados]);

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
      Observacion: "NINGUNA",
      Calificacion: "NO CALIFICADO"
    }
    
    axios
    .get(apiUrlNuevaAtencion + "?id_Turno=" + atencion.ID_Turno + "&id_Usuario=" + atencion.ID_Usuario + "&ventanilla=" + atencion.Ventanilla + "&estado=" + atencion.Estado + "&fecha_Inicio=" + atencion.Fecha_Inicio + "&fecha_Final=" + atencion.Fecha_Final + "&observacion=" + atencion.Observacion + "&calificacion=" + atencion.Calificacion)
    .then((response) => {
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

    axios
      .get(apiUrlActualizarTurno + item.ID_Turno + "&estado=4")
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setTurno(item);
  }

  //TODO: CERRAR MODAL
  const closeModal = (e) => {
    axios
      .get(apiUrlActualizarTurno + turno.ID_Turno + "&estado=3")
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get(apiUrlEliminarAtencion + "?id_Turno=" + turno.ID_Turno)
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });


    let modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  //TODO: FINALIZAR ATENCION
  const completarAtencion = (e) => {
    let observacion = document.getElementById('observaciones').value;

    if(observacion === '') {
      observacion = 'Ninguna';
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
      ID_Usuario: userID,
      ID_Turno: turnoID,
      Ventanilla: ventanilla,
      Estado: estado,
      Fecha_Inicio: fechaInicio,
      Fecha_Final: fechaFormateada,      
      Observacion: observacion,
      Calificacion: "NO CALIFICADO"
    }
    
    axios
    .get(apiUrlActualizarAtencion + "?id_Turno=" + atencion.ID_Turno + "&id_Usuario=" + atencion.ID_Usuario + "&ventanilla=" + atencion.Ventanilla + "&estado=" + atencion.Estado + "&fecha_Inicio=" + atencion.Fecha_Inicio + "&fecha_Final=" + atencion.Fecha_Final + "&observacion=" + atencion.Observacion + "&calificacion=" + atencion.Calificacion)
    .then((response) => {
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    
    axios
    .get(apiUrlActualizarTurno + atencion.id_Turno + "&estado=5")
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
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-body">
                <header>SUCURSAL {sucursal.Nombre}</header>
                <p id="">MOTIVO: {obtenerTipo(turno.ID_Tipo_Consulta)}</p>
                <p id="">TURNO NÚMERO {turno.Numero_Turno}</p>
                <textarea type="text" rows="4" className='observaciones' id='observaciones' placeholder='Ingrese las observaciones' maxLength='200'/>
                <br/>
                <div className="botones">
                  <button className="btnCancelar" onClick={closeModal}>CANCELAR</button>
                  <button className="btnAceptar" onClick={completarAtencion}>ACEPTAR</button>
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Trabajador