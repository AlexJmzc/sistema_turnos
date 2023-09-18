import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const TablaAdminAtenciones = () => {
  const apiUrlAtenciones = 'http://localhost:3014/ServiciosTurnos.svc/ListaDatosAtenciones';
  const apiUrlSucursales = 'http://localhost:3014/ServiciosTurnos.svc/ListaSucursales';

  const [atenciones, setAtenciones] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [datosAtenciones, setDatosAtenciones] = useState(['']);

  //? VALORES DE BUSQUEDA
  const [sucursal, setSucursal] = useState(0);
  const [cadena, setCadena] = useState('');

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
      navigate("../login");
    }

  }, [])

  //! CARGA DE ATENCIONES, ESTADOS
  useEffect(() => {
    fetchData(apiUrlAtenciones, setAtenciones);
  }, [atenciones]);

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
        const matchesCadena = cadena === '' || 
                item.Nombre_Usuario.toLowerCase().includes(cadena.toLowerCase()) ||
                item.Nombre_Trabajador.toLowerCase().includes(cadena.toLowerCase()) ||
                item.Numero_Turno.toLowerCase().includes(cadena.toLowerCase());

        const fecha = obtenerHora(item.Fecha);
        const matchesFecha = cadena === '' || 
                fecha.toLowerCase().includes(cadena.toLowerCase());

  
        return matchesSucursal && (matchesCadena || matchesFecha);
      });
       
    setDatosAtenciones(filtered);
    
}, [atenciones, sucursal, cadena]);

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

  //TODO: CAMBIO DE ESTADO SELECT ROLES
  const cambioSucursal = (e) => {
    const dato = parseInt(e.target.value);
    setSucursal(dato);
  }

  //TODO: CAMBIO DE ESTADO SELECT ESTADOS 
  const cambioCadena = (e) => {
    const dato = e.target.value;
    setCadena(dato);
  }

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
    const datos = datosAtenciones.map(item => [item.Numero_Turno, item.Nombre_Usuario, item.Nombre_Trabajador, obtenerHora(item.Fecha), obtenerSucursal(item.Sucursal)]);

    const doc = new jsPDF();
    doc.text('Tabla de Atenciones', 10, 10);

    const headers = ['Numero Turno', 'Usuario', 'Trabajador', 'Fecha', 'Sucursal'];

    doc.autoTable({ head: [headers], body: datos });

    doc.save('Reporte_Atenciones.pdf');
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosAtenciones.map(item => [item.Numero_Turno, item.Nombre_Usuario, item.Nombre_Trabajador, obtenerHora(item.Fecha), obtenerSucursal(item.Sucursal)]);
    const headers = ['Numero Turno', 'Usuario', 'Trabajador', 'Fecha', 'Sucursal'];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws['!cols'] = wsCols;

    XLSX.writeFile(wb, 'Reporte_Atenciones.xlsx');
  };

  return (
    <div className="Main">
        <div className="Main-titulo">
            <h1>Tabla de administración de atenciones</h1>
            <button className='btnLogout' onClick={logout}>Cerrar Sesión</button>
        </div>
        <div className="Main-buscador">
            <select className="sucursales" id="sucursales" onChange={cambioSucursal}>
                <option value="0">Sucursales</option>
                {sucursales.map((sucursal) => (
                    <option value={sucursal.ID_Sucursal}>{sucursal.Nombre}</option>
                ))}
            </select>

            <input type="text" className='buscador' id='buscador' placeholder='Buscar' onChange={cambioCadena}/>
        </div>
        <table className="styled-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Numero Turno</th>
                    <th>Usuario</th>
                    <th>Trabajador</th>
                    <th>Fecha</th>
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
                        <td>{obtenerHora(item.Fecha)}</td>
                        <td>{obtenerSucursal(item.Sucursal)}</td>
                        <td>
                            <button>Ver observación</button>
                        </td>
                        <td>
                            <button>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="reportes">
            <button onClick={generatePDF}>PDF</button>
            <button onClick={generateExcel}>EXCEL</button>
        </div>
    </div>
  )
}

export default TablaAdminAtenciones