import React, {useState, useEffect} from 'react';
import './trabajador.css';
import axios from 'axios';

const Trabajador = () => {

  const [usuarios, setUsuarios] = useState([]);
  const apiUrl = 'http://localhost:3014/ServiciosTurnos.svc/ListaUsuarios';

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setUsuarios(response.data);
      }).catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  
  return (
    <div className="Main">
        <div className="Main-titulo">
            ATENCIÓN DE TURNOS
        </div>

        <ul>
        {usuarios.map(item => (
          <li>{item.Nombre} {item.ID_Usuario} {item.Clave}</li>
        ))}
      </ul>
    </div>
  )
}

export default Trabajador