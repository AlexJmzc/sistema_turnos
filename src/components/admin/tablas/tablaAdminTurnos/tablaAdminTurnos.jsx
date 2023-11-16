import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./tablaAdminTurnos.css";
import {
  Estados,
  Sucursales,
  Tipos_Consulta,
  Turnos,
} from "../../../../api/urls";
import ReactPaginate from 'react-paginate';

const TablaAdminTurnos = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const sucursalesAPI = new Sucursales();
  const turnosAPI = new Turnos();
  const consultasAPI = new Tipos_Consulta();
  const estadosAPI = new Estados();

  //? VARIABLES DE LA VENTANA
  const [turnos, setTurnos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [estados, setEstados] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [datosTurnos, setDatosTurnos] = useState([""]);

  //? VALORES DE BUSQUEDA
  const [sucursal, setSucursal] = useState(0);
  const [consulta, setConsulta] = useState(0);
  const [estado, setEstado] = useState(0);
  const [cadena, setCadena] = useState("");
  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  //? VARIABLES PAGINADOR
  const itemsPorPagina = 10;
  const [numeroPagina, setNumeroPagina] = useState(0);
  const startIndex = numeroPagina * itemsPorPagina;
  const endIndex = startIndex + itemsPorPagina;
  const dispData = datosTurnos.slice(startIndex, endIndex);

  //! URL
  const apiUrlTurnos = turnosAPI.listarTurnos();
  const apiUrlSucursales = sucursalesAPI.listarSucursales();
  const apiUrlConsultas = consultasAPI.listarTiposConsulta();
  const apiUrlEstados = estadosAPI.listarEstados();

  //! NAVEGACION
  const navigate = useNavigate();

  const fetchData = async (url, setData) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error al cargar la API:", error);
    }
  };

  //! COMPROBACIÓN DE TOKEN Y ROL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (token !== "" && rol === "1") {
    } else {
      navigate("/");
    }
  }, []);

  //! CARGA DE TURNOS, ESTADOS
  useEffect(() => {
    fetchData(apiUrlTurnos, setTurnos);
    fetchData(apiUrlEstados, setEstados);
    fetchData(apiUrlSucursales, setSucursales);
  }, [turnos, estados]);

  //! CARGA LOS TIPOS DE CONSULTA
  useEffect(() => {
    axios
      .get(apiUrlConsultas)
      .then((response) => {
        setConsultas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [consultas, apiUrlConsultas]);

  //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
  useEffect(() => {
    const filtered = turnos.filter((item) => {
      const matchesSucursal = sucursal === 0 || item.ID_Sucursal === sucursal;
      const matchesTipo = consulta === 0 || item.ID_Tipo_Consulta === consulta;
      const matchesEstado = estado === 0 || item.Estado === estado;
      const matchesCadena =
        cadena === "" ||
        item.Numero_Turno.toLowerCase().includes(cadena.toLowerCase());

      const fecha = obtenerFecha(item.Fecha);
      let matchesFecha = [];
      if (fechaInicial !== null && fechaFinal === null) {
        const fechaInicialFiltro = new Date(fechaInicial);
        const fechaFormateada = fechaInicialFiltro.toISOString().split("T")[0];

        matchesFecha = fechaInicial === null || fecha === fechaFormateada;
      } else if (fechaFinal !== null && fechaInicial !== null) {
        const partesFecha = fecha.split("-");
        const año = parseInt(partesFecha[0]);
        const mes = parseInt(partesFecha[1]);
        const dia = parseInt(partesFecha[2]);
        const fechaItem = new Date(Date.UTC(año, mes - 1, dia + 1));
        fechaItem.setHours(0, 0, 0, 0);

        matchesFecha =
          (!fechaInicial || fechaItem >= fechaInicial) &&
          (!fechaFinal || fechaItem <= fechaFinal);
      }

      return (
        matchesSucursal &&
        matchesCadena &&
        matchesTipo &&
        matchesFecha &&
        matchesEstado
      );
    });

    setDatosTurnos(filtered);
  }, [turnos, sucursal, cadena, consulta, fechaInicial, fechaFinal, estado]);

  //TODO: OBTENER SUCURSAL
  const obtenerSucursal = (id) => {
    if (sucursales.length > 0) {
      const sucursal = sucursales.filter((item) => item.ID_Sucursal === id);
      if (sucursal[0] != null) {
        return sucursal[0].Nombre;
      } else {
        return 1;
      }
    }
  };

  //TODO: OBTENER SUCURSAL
  const obtenerEstado = (id) => {
    if (estados.length > 0) {
      const est = estados.filter((item) => item.ID_Estado === id);
      if (est[0] != null) {
        return est[0].Nombre;
      } else {
        return 1;
      }
    }
  };

  //TODO: OBTENER TIPO DE CONSULTA
  const obtenerConsulta = (id) => {
    if (consultas.length > 0) {
      const con = consultas.filter((item) => item.ID_Tipo_Consulta === id);
      if (con[0] != null) {
        return con[0].Nombre;
      } else {
        return 1;
      }
    }
  };

  //TODO: OBTENER LA FECHA
  const obtenerFecha = (f) => {
    if (f) {
      const match = f.match(/\/Date\((\d+)([+-]\d{4})\)\//);

      if (match) {
        const timestamp = parseInt(match[1], 10);
        const timeZoneOffset = -5 * 60 * 60;

        const date = new Date(timestamp + timeZoneOffset);

        const fechaFormateada = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        return fechaFormateada;
      }
    } else {
      return 1;
    }
  };

  //TODO: CAMBIO DE ESTADO SELECT SUCURSALES
  const cambioSucursal = (e) => {
    const dato = parseInt(e.target.value);
    setSucursal(dato);
  };

  //TODO: CAMBIO DE ESTADO SELECT ESTADOS
  const cambioEstado = (e) => {
    const dato = parseInt(e.target.value);
    setEstado(dato);
  };

  //TODO: CAMBIO DE ESTADO SELECT TIPOS DE CONSULTA
  const cambioConsulta = (e) => {
    const dato = parseInt(e.target.value);
    setConsulta(dato);
  };

  //TODO: CAMBIO DE ESTADO SELECT ESTADOS
  const cambioCadena = (e) => {
    const dato = e.target.value;
    setCadena(dato);
  };

  const handleStartDateChange = (date) => {
    setFechaInicial(date);
  };

  const handleEndDateChange = (date) => {
    setFechaFinal(date);
  };

  const handlePageChange = (e) => {
    setNumeroPagina(e.selected);
  }

  //TODO: LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Sucursal");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    navigate("/");
  };

  //TODO: GENERAR PDF
  const generatePDF = () => {
    const datos = datosTurnos.map((item) => [
      item.Numero_Turno,
      obtenerEstado(item.Estado),
      obtenerFecha(item.Fecha),
      obtenerConsulta(item.ID_Tipo_Consulta),
      obtenerSucursal(item.ID_Sucursal),
    ]);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.text("Tabla de Turnos", 10, 10);

    const headers = [
      "Numero Turno",
      "Estado",
      "Fecha",
      "Motivo de Consulta",
      "Sucursal",
    ];

    doc.autoTable({ head: [headers], body: datos });

    doc.save("Reporte_Turnos.pdf");
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosTurnos.map((item) => [
      item.Numero_Turno,
      obtenerEstado(item.Estado),
      obtenerFecha(item.Fecha),
      obtenerConsulta(item.Fecha),
      obtenerSucursal(item.Sucursal),
    ]);

    const headers = [
      "Numero Turno",
      "Estado",
      "Fecha",
      "Motivo de Consulta",
      "Sucursal",
    ];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws["!cols"] = wsCols;

    XLSX.writeFile(wb, "Reporte_Turnos.xlsx");
  };

  //TODO: RESETEAR FILTROS
  const resetear = () => {
    setSucursal(0);
    setFechaInicial(null);
    setFechaFinal(null);
    setCadena("");
    setConsulta(0);
    setEstado(0);
  };

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>Tabla de administración de atenciones</h1>
        <button className="btnLogout" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
      <div className="Main-buscador">
        <select
          className="sucursales"
          id="sucursales"
          onChange={cambioSucursal}
          value={sucursal}
        >
          <option value="0">Sucursales</option>
          {sucursales.map((sucursal) => (
            <option value={sucursal.ID_Sucursal}>{sucursal.Nombre}</option>
          ))}
        </select>

        <select
          className="consultas"
          id="consultas"
          onChange={cambioConsulta}
          value={consulta}
        >
          <option value="0">Tipo de consulta</option>
          {consultas.map((con) => (
            <option value={con.ID_Tipo_Consulta}>{con.Nombre}</option>
          ))}
        </select>

        <select
          className="estados"
          id="estados"
          onChange={cambioEstado}
          value={estado}
        >
          <option value="0">Estados</option>
          {estados.map((est) => (
            <option value={est.ID_Estado}>{est.Nombre}</option>
          ))}
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

        <input
          type="text"
          className="buscador"
          id="buscador"
          placeholder="Buscar"
          onChange={cambioCadena}
          value={cadena}
        />

        <button className="btnResetear" onClick={resetear}>
          Resetear
        </button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th></th>
            <th>Numero Turno</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Motivo de Consulta</th>
            <th>Sucursal</th>
          </tr>
        </thead>
        <tbody>
          {dispData.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.Numero_Turno}</td>
              <td>{obtenerEstado(item.Estado)}</td>
              <td>{obtenerFecha(item.Fecha)}</td>
              <td>{obtenerConsulta(item.ID_Tipo_Consulta)}</td>
              <td>{obtenerSucursal(item.ID_Sucursal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='pag'>
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={Math.ceil(datosTurnos.length / itemsPorPagina)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
        </div>

      <div className="reportes">
        <button className="btnPDF slide_diagonal" onClick={generatePDF}>
          PDF
        </button>
        <button className="btnExcel slide_diagonal" onClick={generateExcel}>
          EXCEL
        </button>
      </div>
    </div>
  );
};

export default TablaAdminTurnos;
