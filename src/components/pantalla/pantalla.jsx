import React, {useState, useEffect, useRef} from 'react';
import './pantalla.css';
import video from '../../assets/video/emapa.mp4';
import axios from 'axios';
import { Atenciones, Turnos, Sucursales } from '../../api/urls'; 

const Pantalla = () => {
  //? INSTANCIAS DE LAS CLASES DE LA API
  const atencionesAPI = new Atenciones();
  const turnosAPI = new Turnos();
  const sucursalesAPI = new Sucursales();

  //? CONSTANTES DE LA VENTANA
  const [turnos, setTurnos] = useState([]);
  const [turnosAtendiendo, setTurnosAtendiendo] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [selectedValue] = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState({});
  const [texto, setTexto] = useState('');
  const [listaVideos, setListaVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const synthesis = window.speechSynthesis;
  const folderPath = "http://localhost:8020/Vid/";

  //!FECHA
  let fechaActual = new Date();
  let año = fechaActual.getFullYear();
  let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
  let dia = fechaActual.getDate().toString().padStart(2, '0');
  let fechaFormateada = `${año}-${mes}-${dia}`;

  //! URL API
  const apiUrlAtenciones = atencionesAPI.listarAtenciones();
  const apiUrlTurnosEspera = turnosAPI.turnosPorSucursalEstadoDia(selectedValue, 3, fechaFormateada);
  const apiUrlTurnosAtendiendo = turnosAPI.turnosPorSucursalEstadoDia(selectedValue, 4, fechaFormateada);
  const apiUrlSucursales = sucursalesAPI.sucursalPorID(selectedValue); 

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
  }, [atenciones, apiUrlAtenciones])

  //! CARGA LOS TURNOS SACADOS POR SUCURSAL Y CON ESTADO EN ESPERA
  useEffect(() => {
    axios
      .get(apiUrlTurnosEspera)
      .then((response) => {
        setTurnos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turnos, selectedValue, apiUrlTurnosEspera])

  //! CARGA SUCURSAL
  useEffect(() => {
    axios
      .get(apiUrlSucursales)
      .then((response) => {
        setSucursal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sucursal, selectedValue, apiUrlSucursales])

  //! CARGA LOS TURNOS SACADOS POR SUCURSAL Y CON ESTADO ATENDIENDO
  useEffect(() => {
    axios
      .get(apiUrlTurnosAtendiendo)
      .then((response) => {
        setTurnosAtendiendo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turnosAtendiendo, selectedValue, apiUrlTurnosAtendiendo])

  //! CARGA LOS VIDEOS
  useEffect(() => {
    fetchVideosFromFolder(folderPath);

    
    const timeoutId = setTimeout(() => {
      if(videoRef.current)  {
        handlePlayButtonClick(videoRef.current);
      }
    }, 1000);

   
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchVideosFromFolder = async (folderPath) => {
    try {
      const videoNames = ['Vid1.mp4', 'Vid2.mp4']; 
      let videoList = videoNames.map((videoName) => ({
        name: videoName,
        url: `${folderPath}${videoName}`,
      }));

      setListaVideos(videoList);
    } catch (error) {
      console.error('Error al obtener la lista de videos', error);
    }
  };

  const playNextVideo = () => {
    if (currentVideoIndex < listaVideos.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const handleVideoEnded = () => {
    playNextVideo();
  };

  const handlePlayButtonClick = (element) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  };

  useEffect(() => {
    if (videoRef.current && listaVideos.length > 0) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentVideoIndex, listaVideos]);

  
  function reproducirSonido(texto) {
    try {
      const textoCompleto = "ATENCION TURNO " + texto;
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
            {listaVideos.length > 0 && (
              <video
              ref={videoRef}
              width="700"
              height="450"
              controls
              onEnded={handleVideoEnded}
              autoPlay
              muted
            >
              <source src={listaVideos[currentVideoIndex].url} type="video/mp4" />
            </video>
            )}
          </div>
      </div>
    </div>
  )
}

export default Pantalla;