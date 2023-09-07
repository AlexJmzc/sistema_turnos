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

  const apiUrlTurnos = "http://localhost:3014/ServiciosTurnos.svc/TurnosIDSucursal?id=";
  const apiUrlSucursal = "http://localhost:3014/ServiciosTurnos.svc/Sucursal?id=" + selectedValue;
  const apiUrlConsultas = "http://localhost:3014/ServiciosTurnos.svc/ListaTiposConsulta";
  const apiUrlEstados = "http://localhost:3014/ServiciosTurnos.svc/ListaEstados";

  //TODO: CARGA LOS TURNOS SACADOS EN DICHA SUCURSAL
  useEffect(() => {
    axios
      .get(apiUrlTurnos + selectedValue)
      .then((response) => {
        setTurnos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turnos])

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
  }, [sucursal]);

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
                {turnos.map((item) => (
                    <tr>
                        <td>{item.ID_Turno}</td>
                        <td>{sucursal.Nombre}</td>
                        <td>{obtenerTipo(item.ID_Tipo_Consulta)}</td>
                        <td>{item.Numero_Turno}</td>
                        <td>{obtenerEstado(item.Estado)}</td>
                        <td>{obtenerHora(item.Fecha)}</td>
                        <td>
                            <button className='btnAtencion slide_diagonal'>ATENDER</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Trabajador