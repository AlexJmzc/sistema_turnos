import React, { useState, useEffect } from 'react';
import { urlSucursales } from '../../api/urls';
import axios from 'axios';
import './calificacion.css';

const Calificacion = () => {
  const [ventanilla, setVentanilla] = useState(0 || localStorage.getItem("ventanilla"));
  const sucursalID = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState([]);
  const [arrayNumeros, setArray] = useState([]);
  const [atenciones, setAtenciones] = useState([]);

  //! URL
  const apiUrlSucursal = urlSucursales.obtenerSucursal + sucursalID;
  const apiUrlAtenciones = 'http://localhost:3014/ServiciosTurnos.svc/ListaDatosAtenciones';
  const apiUrlActualizarAtencion = "http://localhost:3014/ServiciosTurnos.svc/ActualizarAtencion";

  //! CARGA LA SUCURSAL ACTUAL
  useEffect(() => {
    axios
      .get(apiUrlSucursal)
      .then((response) => {
        setSucursal(response.data);
        setArray(array(response.data.Numero_Ventanillas));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sucursal, apiUrlSucursal]);


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
  }, [atenciones, apiUrlAtenciones]);

  //! CONTROL DE MODAL
  useEffect(() => {
    if(ventanilla !== null && ventanilla > 0) {
      closeModal();
    } else {
      abrirModal();
    }
  
  }, [ventanilla])

  //! LLENAR ARRAY DE SUCURSALES
  const array = (n) => {
    const num = [];
    for (let i = 1; i <= n; i++) {
      num.push(i);
    }

    return num;
  }

  //TODO: CAMBIO SELECT VENTANILLA
  const cambioVentanilla = (event) => {
    const value = event.target.value;
    setVentanilla(value);
    localStorage.setItem("ventanilla", value);
  };

  //TODO: ATENDER TURNO
  const abrirModal = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

   //TODO: CERRAR MODAL
   const closeModal = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
   }

   //TODO: OBTENER ATENCION
   const obtenerAtencion = () => {
     const suc = parseInt(sucursalID);
     const estado = 4;
     const ven = parseInt(ventanilla);
     const cal = "NO CALIFICADO";

     if(atenciones.length > 0) {
        const ate = atenciones.filter((item) => {
          return item.Sucursal === suc && item.Ventanilla === ven && item.Estado === estado && item.Calificacion === cal;
        });

        if(ate[0] != null) {
            return ate[0];
        } else {
            return 1;
        }
      }

   }

   //TODO: OBTENER LA FECHA Y HORA
  const obtenerHora = (f) => {
    if(f) {
      const match = f.match(/\/Date\((\d+)([+-]\d{4})\)\//);

      if (match) {
        const timestamp = parseInt(match[1], 10);
        const timeZoneOffset = -5 * 60 * 60; 
  
        const date = new Date(timestamp + timeZoneOffset);
  
        const fechaFormateada = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
  
        return fechaFormateada;
      
      } 
    } else {
      return 1;
    }
    
   }

   //TODO: ACTUALIZAR CALIFICACION DE ATENCION
   const calificar = (e) => {
      const calificacion = e.target.textContent.toUpperCase();
      const atencion = obtenerAtencion();
      
      if(atencion.ID_Turno !== undefined) {
        axios
        .get(apiUrlActualizarAtencion + "?id_Turno=" + atencion.ID_Turno + "&id_Usuario=" + atencion.ID_Usuario + "&ventanilla=" + atencion.Ventanilla + "&estado=" + atencion.Estado + "&fecha_Inicio=" + obtenerHora(atencion.Fecha_Inicio) + "&fecha_Final=" + obtenerHora(atencion.Fecha_Final) + "&observacion=" + atencion.Observacion + "&calificacion=" + calificacion)
        .then((response) => {
          
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      } 
   }

  return (
    <div className="Main">
        <div className="Main-body-cal">
          <h1>CALIFICA ESTA ATENCIÓN</h1>
          <button className='btnBuena' onClick={calificar}>BUENA</button>
          <button className='btnRegular' onClick={calificar}>REGULAR</button>
          <button className='btnMala' onClick={calificar}>MALA</button>
        </div>

      <div id="myModal" className="modalCal">
        <div className="modal-content">
          <div className="modal-body">
            <h1>Seleccione el número de ventanilla</h1>
            <select id="ventanilla" onChange={cambioVentanilla}>
              <option value='0'>Selecciona la ventanilla</option>
              {arrayNumeros.map((numero) => (
                <option key={numero} value={numero}>
                  {numero}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calificacion;