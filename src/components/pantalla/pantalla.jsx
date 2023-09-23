import React, {useState, useEffect} from 'react';
import './pantalla.css';
import video from '../../assets/video/emapa.mp4';
import axios from 'axios';
import sonido from '../../assets/sonido/alerta.mp3';
import logo from '../../assets/img/Logo.png';

const Pantalla = () => {
  //? CONSTANTES DE LA VENTANA
  const [turnos, setTurnos] = useState([]);
  const [turnosAtendiendo, setTurnosAtendiendo] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [selectedValue] = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState({});
  const [texto, setTexto] = useState('');
  const synthesis = window.speechSynthesis;

  //! URL API
  const apiUrlTurnos = "http://localhost:3014/ServiciosTurnos.svc/TurnosSucursalEstado?";
  const apiUrlAtenciones = "http://localhost:3014/ServiciosTurnos.svc/ListaAtenciones";
  const apiUrlSucursal = "http://localhost:3014/ServiciosTurnos.svc/Sucursal";


  //! CARGA LAS ATENCIONES
  useEffect(() => {
    axios
      .get(apiUrlAtenciones)
      .then((response) => {
        setAtenciones(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [atenciones])

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

  //! CARGA SUCURSAL
  useEffect(() => {
    axios
      .get(apiUrlSucursal + "?id=" + selectedValue)
      .then((response) => {
        setSucursal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sucursal, selectedValue, apiUrlSucursal])

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

  
  function reproducirSonido(texto) {
    try {
      const textoCompleto = "TURNO TURNO " + texto;
      const mensaje = new SpeechSynthesisUtterance((textoCompleto));     
    
      synthesis.speak(mensaje);
    } catch (error) {
      console.error("Error durante la síntesis de voz:", error);
    }
  }

  // Agrega un evento al elemento h1 para detectar cambios en su contenido
  useEffect(() => { 
    const id = "h1_" + sucursal.Numero_Ventanillas;
    const h1Element = document.getElementById(id);

    if(h1Element) {
      setTexto(h1Element.textContent);
      if(texto !== '') {
        if(texto !== h1Element.textContent) {
          reproducirSonido(h1Element.textContent);
          setTexto(h1Element.textContent);
        }
      }
    }

  }, [sucursal, texto]);


  const obtenerAtencion = (id) => {
    if(atenciones.length > 0) {
      const atencion = atenciones.filter((item) => item.ID_Turno === id);  
          if(atencion[0] != null) {
              return atencion[0].Ventanilla;
          } else {
          return 1;
          }
    }
  }

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>EP-EMAPA-A</h1>
      </div> 
      <div className="Main-container">
          <div className="Main-izquierda">
              <h1>Siguientes:</h1>
              {turnos.slice(0,4).map((item) => (
                  <h1>{item.Numero_Turno}</h1>
              ))}

              <h1 className='atendiendo'>Atendiendo:</h1>

              {turnosAtendiendo.slice(-sucursal.Numero_Ventanillas).map((item, index) => (
                  <h1 key={index} id={`h1_${index + 1}`}>{item.Numero_Turno} EN VENTANILLA {obtenerAtencion(item.ID_Turno)}</h1>
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