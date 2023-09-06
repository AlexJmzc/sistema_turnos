import React, {useState, useEffect} from 'react';
import './trabajador.css';
import { useValue } from "../contexto";
import axios from 'axios';

const Trabajador = () => {
  const [turnos, setTurnos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const { selectedValue } = useValue();
  const [sucursal, setSucursal] = useState([]);

  const apiUrlTurnos = "http://localhost:3014/ServiciosTurnos.svc/TurnosIDSucursal?id=";
  const apiUrlSucursal = "http://localhost:3014/ServiciosTurnos.svc/Sucursal?id=" + selectedValue;
  const apiUrlConsultas = "http://localhost:3014/ServiciosTurnos.svc/ListaTiposConsulta";

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

  const obtenerTipo = (id) => {
      if(tipos.length > 0) {
        const tConsulta = tipos.filter((item) => item.ID_Tipo_Consulta === id);
      
        return tConsulta[0].Nombre;
      } else {
        return 1;
      }
      
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
                        <td>{item.Estado}</td>
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