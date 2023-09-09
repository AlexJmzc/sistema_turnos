import React, {useState, useEffect} from 'react';
import './trabajador.css';
import { useValue } from "../contexto";
import axios from 'axios';

const Trabajador = () => {
  const [turnos, setTurnos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const { selectedValue } = useValue();
  const [sucursal, setSucursal] = useState([]);

  const apiUrlTurnos = "http://localhost:3014/ServiciosTurnos.svc/TurnosSucursalEstado?";
  const apiUrlSucursal = "http://localhost:3014/ServiciosTurnos.svc/Sucursal?id=" + selectedValue;
  const apiUrlConsultas = "http://localhost:3014/ServiciosTurnos.svc/ListaTiposConsulta";
  const apiUrlEstados = "http://localhost:3014/ServiciosTurnos.svc/ListaEstados";
  const apiUrlActualizarTurno = "http://localhost:3014/ServiciosTurnos.svc/EliminarTurno?id_Turno=";
  

  //TODO: CARGA LOS TURNOS SACADOS EN DICHA SUCURSAL Y CON ESTADO EN ESPERA
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

  //TODO: CARGA LA SUCURSAL ACTUAL
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

  //TODO: CARGA LISTA DE TIPOS DE CONSULTA
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

  //TODO: CARGA LISTA DE ESTADOS
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

  const obtenerTipo = (id) => {
      if(tipos.length > 0) {
        const tConsulta = tipos.filter((item) => item.ID_Tipo_Consulta === id);
        return tConsulta[0].Nombre;
      } else {
        return 1;
      }
  }

  const obtenerEstado = (id) => {
    if(estados.length > 0) {
      const tEstado = estados.filter((item) => item.ID_Estado === id);
      return tEstado[0].Nombre;
    } else {
      return 1;
    }
  }

  const obtenerHora = (f) => {
      var timestamp = parseInt(f.match(/\d+/)[0]);
      var fecha = new Date(timestamp);
      var hora = fecha.getHours();
      var minutos = fecha.getMinutes();

      var horaFormateada = hora + ':' + (minutos < 10 ? '0' : '') + minutos;

      return horaFormateada;
  }

  const atender = (item) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";

    axios
      .get(apiUrlActualizarTurno + item.ID_Turno + "&estado=4")
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  const closeModal = (e) => {
    let modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  return (
    <div className="Main">
        <div className="Main-titulo">
            <h1>ATENCIÓN DE TURNOS</h1>
        </div>

        <table className="styled-table">
            <thead>
                <tr>
                    <th>ID Turno</th>
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
                        <td>{item.ID_Turno}</td>
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
                <header>SUCURSAL</header>
                <p id="">SACAR TURNO PARA</p>
                <p id="">TURNO NÚMERO</p>
                <div className="botones">
                  <button className="btnCancelar" onClick={closeModal}>CANCELAR</button>
                  <button className="btnAceptar" >ACEPTAR</button>
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Trabajador