import React, {useState, useEffect} from 'react';
import './pantalla.css';
import video from '../../assets/video/emapa.mp4';
import axios from 'axios';

const Pantalla = () => {
  //? CONSTANTES DE LA VENTANA
  const [turnos, setTurnos] = useState([]);
  const [turnosAtendiendo, setTurnosAtendiendo] = useState([]);
  const [selectedValue] = localStorage.getItem("sucursal");

  //! URL API
  const apiUrlTurnos = "http://localhost:3014/ServiciosTurnos.svc/TurnosSucursalEstado?";

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

  //! CARGA LOS TURNOS SACADOS EN DICHA SUCURSAL Y CON ESTADO EN ESPERA
  useEffect(() => {
    axios
      .get(apiUrlTurnos + "id=" + selectedValue + "&idEstado=4")
      .then((response) => {
        setTurnosAtendiendo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turnosAtendiendo, selectedValue])

  return (
    <div className="Main">
        <h1>EP-EMAPA-A</h1>
        <div className="Main-container">
            <div className="Main-izquierda">
                <h1>Siguientes:</h1>
                {turnos.slice(0,5).map((item) => (
                    <h1>{item.Numero_Turno}</h1>
                ))}

                <h1 className='atendiendo'>Atendiendo:</h1>
                {turnosAtendiendo.slice(-1).map((item) => (
                    <h1>{item.Numero_Turno}</h1>
                ))}
            </div>

            <div className="Main-derecha">
                <video autoPlay loop muted>
                     <source src={video} type="video/mp4" />
                </video>
            </div>
        </div>
    </div>
  )
}

export default Pantalla;