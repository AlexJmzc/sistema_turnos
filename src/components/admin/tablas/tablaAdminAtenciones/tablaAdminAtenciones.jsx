import React, {useEffect, useState} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './tablaAdminAtenciones.css';
import { Sucursales, Atenciones } from '../../../../api/urls';

const TablaAdminAtenciones = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const sucursalesAPI = new Sucursales();
  const atencionesAPI = new Atenciones();

  //? VARIABLES DE LA VENTANA
  const [atenciones, setAtenciones] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [datosAtenciones, setDatosAtenciones] = useState(['']);
  const [atencion, setAtencion] = useState({});

  //? VALORES DE BUSQUEDA
  const [sucursal, setSucursal] = useState(0);
  const [valoracion, setValoracion] = useState("");
  const [cadena, setCadena] = useState('');
  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  //! URL
  const apiUrlAtenciones = atencionesAPI.listarDatosAtenciones();
  const apiUrlSucursales = sucursalesAPI.listarSucursales();

  

  //! NAVEGACION
  const navigate = useNavigate();

  const fetchData = async (url, setData) => {
    try {
      
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error al cargar la API:', error);
    }
  };

  //! COMPROBACIÓN DE TOKEN Y ROL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if(token !== "" && rol === "1") {
      
    } else {
      navigate("/");
    }

  }, [])

  //! CARGA DE ATENCIONES, ESTADOS
  useEffect(() => {
    fetchData(apiUrlAtenciones, setAtenciones);
  }, [atenciones, apiUrlAtenciones]);

  //! CARGA LOS TRABAJADORES
  useEffect(() => {
    axios
      .get(apiUrlSucursales)
      .then((response) => {
          setSucursales(response.data);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      });
  }, [sucursales, apiUrlSucursales]);

  //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
  useEffect(() => {
    const filtered = atenciones.filter(item => {
        const matchesSucursal = sucursal === 0 || item.Sucursal === sucursal;
        const matchesValoracion = valoracion === "" || item.Valoracion === valoracion;
        const matchesCadena = cadena === '' || 
                item.Nombre_Usuario.toLowerCase().includes(cadena.toLowerCase()) ||
                item.Nombre_Trabajador.toLowerCase().includes(cadena.toLowerCase()) ||
                item.Numero_Turno.toLowerCase().includes(cadena.toLowerCase());

        const fecha = obtenerFecha(item.Fecha_Turno);
        let matchesFecha = [];
        if(fechaInicial !== null && fechaFinal === null) {
          const fechaInicialFiltro = new Date(fechaInicial);
          const fechaFormateada = fechaInicialFiltro.toISOString().split('T')[0];
  
          matchesFecha = fechaInicial === null || 
                  fecha === fechaFormateada;
        } else if(fechaFinal !== null && fechaInicial !== null) {
          //! FECHA DE ATENCION
          const partesFecha = fecha.split('-');
          const año = parseInt(partesFecha[0]);
          const mes = parseInt(partesFecha[1]);
          const dia = parseInt(partesFecha[2]);
          const fechaItem = new Date(Date.UTC(año, mes - 1, dia + 1));
          fechaItem.setHours(0,0,0,0);

          matchesFecha = (!fechaInicial || fechaItem >= fechaInicial) &&
                  (!fechaFinal || fechaItem <= fechaFinal);
        }
  
        return matchesSucursal && matchesCadena && matchesValoracion && matchesFecha;
      });
       
    setDatosAtenciones(filtered);
    
}, [atenciones, sucursal, cadena, valoracion, fechaInicial, fechaFinal]);

  //TODO: OBTENER SUCURSAL
  const obtenerSucursal = (id) => {
    if(sucursales.length > 0) {
    const sucursal = sucursales.filter((item) => item.ID_Sucursal === id);  
        if(sucursal[0] != null) {
            return sucursal[0].Nombre;
        } else {
        return 1;
        }
    }
  }

  //TODO: OBTENER HORA
  const obtenerHora = (f) => {
    if(f) {
      const match = f.match(/\/Date\((\d+)([+-]\d{4})\)\//);

      if (match) {
        const timestamp = parseInt(match[1], 10);
        const timeZoneOffset = -5 * 60 * 60; 
  
        const date = new Date(timestamp + timeZoneOffset);
  
        const fechaFormateada = `${String(date.getHours() - 5).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
        return fechaFormateada;
      
      } 
    } else {
      return 1;
    }
  }

  //TODO: OBTENER LA FECHA
  const obtenerFecha = (f) => {
    if(f) {
      const match = f.match(/\/Date\((\d+)([+-]\d{4})\)\//);

      if (match) {
        const timestamp = parseInt(match[1], 10);
        const timeZoneOffset = -5 * 60 * 60; 
  
        const date = new Date(timestamp + timeZoneOffset);
  
        const fechaFormateada = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
        return fechaFormateada;
      
      } 
    } else {
      return 1;
    }
  }

  //TODO: CAMBIO DE ESTADO SELECT SUCURSALES
  const cambioSucursal = (e) => {
    const dato = parseInt(e.target.value);
    setSucursal(dato);
  }

  //TODO: CAMBIO DE ESTADO SELECT VALORACIONES
  const cambioValoracion = (e) => {
    const dato = e.target.value;
    setValoracion(dato);
  }

  //TODO: CAMBIO DE ESTADO SELECT ESTADOS 
  const cambioCadena = (e) => {
    const dato = e.target.value;
    setCadena(dato);
  }

  const handleStartDateChange = (date) => {
   setFechaInicial(date);
  };

  const handleEndDateChange = (date) => {
    setFechaFinal(date);
  };

  //TODO: LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Sucursal");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    navigate("/");
  }

  //TODO: GENERAR PDF
  const generatePDF = () => {
    const datos = datosAtenciones.map(item => [item.Numero_Turno, item.Nombre_Usuario, item.Nombre_Trabajador, obtenerFecha(item.Fecha_Turno), obtenerHora(item.Fecha_Turno), obtenerHora(item.Fecha_Inicio), obtenerHora(item.Fecha_Final), obtenerSucursal(item.Sucursal), item.Observacion, item.Pregunta_1, item.Pregunta_2, item.Pregunta_3, item.Valoracion]);

    const doc = new jsPDF({
      orientation:'landscape',
      unit: 'mm',
      format: [297, 210],
    });

    doc.text('Tabla de Atenciones', 10, 10);

    const headers = ['Numero Turno', 'Usuario', 'Trabajador', 'Fecha', 'Hora Turno', 'Hora Inicio', 'Hora Final', 'Sucursal', 'Observacion', 'Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Valoracion'];

    doc.autoTable({ head: [headers], body: datos });

    doc.save('Reporte_Atenciones.pdf');
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosAtenciones.map(item => [item.Numero_Turno, item.Nombre_Usuario, item.Nombre_Trabajador, obtenerFecha(item.Fecha_Turno), obtenerHora(item.Fecha_Turno), obtenerHora(item.Fecha_Inicio), obtenerHora(item.Fecha_Final), obtenerSucursal(item.Sucursal), item.Observacion, item.Pregunta_1, item.Pregunta_2, item.Pregunta_3, item.Valoracion]);
    const headers = ['Numero Turno', 'Usuario', 'Trabajador', 'Fecha', 'Hora Turno', 'Hora Inicio', 'Hora Final', 'Sucursal', 'Observacion', 'Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Valoracion'];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws['!cols'] = wsCols;

    XLSX.writeFile(wb, 'Reporte_Atenciones.xlsx');
  };

  //TODO: VER CALIFICACION
  const abrirModalCalificacion = (item) => {
    setAtencion(item);
    let modal = document.getElementById("modalCalificacion");
    modal.style.display = "block";
  }

  //TODO: VER OBSERVACION
  const abrirModalObservacion = (item) => {
    setAtencion(item);
    let modal = document.getElementById("modalObservacion");
    modal.style.display = "block";
  }

   //TODO: CERRAR MODAL CALIFICACION
   const closeModalCalificacion = () => {
    let modal = document.getElementById("modalCalificacion");
    modal.style.display = "none";
   }

   //TODO: CERRAR MODAL CALIFICACION
   const closeModalObservacion = () => {
    let modal = document.getElementById("modalObservacion");
    modal.style.display = "none";
   }

   //TODO: RESETEAR FILTROS
   const resetear = () => {
      setSucursal(0);
      setFechaInicial(null);
      setFechaFinal(null);
      setCadena('');
      setValoracion("");
   }

  return (
    <div className="Main">
        <div className="Main-titulo">
            <h1>Tabla de administración de atenciones</h1>
            <button className='btnLogout' onClick={logout}>Cerrar Sesión</button>
        </div>
        <div className="Main-buscador">
            <select className="sucursales" id="sucursales" onChange={cambioSucursal} value={sucursal}>
                <option value="0">Sucursales</option>
                {sucursales.map((sucursal) => (
                    <option value={sucursal.ID_Sucursal}>{sucursal.Nombre}</option>
                ))}
            </select>

            <select className="valoracion" id="valoracion" onChange={cambioValoracion} value={valoracion}>
                <option value="">Valoracion</option>
                <option value="BUENA">BUENA</option>
                <option value="REGULAR">REGULAR</option>
                <option value="MALA">MALA</option>
                <option value="NO CALIFICADO">NO CALIFICADO</option>
            </select>

            <DatePicker
              selected={fechaInicial}
              onChange={handleStartDateChange}
              selectsStart
              startDate={fechaInicial}
              endDate={fechaFinal}
              placeholderText="Fecha de inicio"
            />
            <DatePicker
              selected={fechaFinal}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={fechaInicial}
              endDate={fechaFinal}
              minDate={fechaInicial}
              placeholderText="Fecha de fin"
            />

            <input type="text" className='buscador' id='buscador' placeholder='Buscar' onChange={cambioCadena} value={cadena}/>

            <button className='btnResetear' onClick={resetear}>Resetear</button>
        </div>
        <table className="styled-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Numero Turno</th>
                    <th>Usuario</th>
                    <th>Trabajador</th>
                    <th>Fecha</th>
                    <th>Hora Turno</th>
                    <th>Hora Inicio</th>
                    <th>Hora Final</th>
                    <th>Sucursal</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {datosAtenciones.map((item, index) => (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.Numero_Turno}</td>
                        <td>{item.Nombre_Usuario}</td>
                        <td>{item.Nombre_Trabajador}</td>
                        <td>{obtenerFecha(item.Fecha_Turno)}</td>
                        <td>{obtenerHora(item.Fecha_Turno)}</td>
                        <td>{obtenerHora(item.Fecha_Inicio)}</td>
                        <td>{obtenerHora(item.Fecha_Final)}</td>
                        <td>{obtenerSucursal(item.Sucursal)}</td>
                        <td>
                            <button className='btnCalificacion' onClick={() => abrirModalCalificacion(item)}>Calificacion</button>
                        </td>
                        <td>
                            <button className='btnObservacion' onClick={() => abrirModalObservacion(item)}>Observación</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div id="modalCalificacion" className="modal">
          <div className="modal-content">
            <span className="close" on onClick={closeModalCalificacion}>&times;</span>
            <div className="modal-body">
              <h1>¿El trato del personal del balcón de servicios e información con
              los usuarios es cordial y respetuoso?: {atencion.Pregunta_1}
              </h1>
              <h1>¿Es adecuado el tiempo de espera para ser atendido en el balcón de
              servicios e información?: {atencion.Pregunta_2}
              </h1>
              <h1>¿El personal del balcón de servicios e información que atiende sus
              requerimientos o reclamos, muestra estar capacitado para brindarle
              soluciones?: {atencion.Pregunta_3}
              </h1>
              <h1>¿Se le informa adecuadamente cuanto tiempo tomará la atención del
              trámite solicitado?: {atencion.Pregunta_4}
              </h1>
              <h1>Valoracion: {atencion.Valoracion}</h1>
            </div>
          </div>
        </div>

        <div id="modalObservacion" className="modal">
          <div className="modal-content">
            <span className="close" on onClick={closeModalObservacion}>&times;</span>
            <div className="modal-body">
              <h1>Observación: {atencion.Observacion}</h1>
            </div>
          </div>
        </div>

        <div className="reportes">
            <button className='btnPDF slide_diagonal' onClick={generatePDF}>PDF</button>
            <button className='btnExcel slide_diagonal' onClick={generateExcel}>EXCEL</button>
        </div>
    </div>
  )
}

export default TablaAdminAtenciones