import React, { useState, useEffect } from "react";
import { Sucursales, Estados, head, Usuarios } from "../../../../api/urls";
import axios from "axios";
import { useNavigate } from "react-router";
import "./tablaAdminSucursales.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const TablaAdminSucursales = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const sucursalesAPI = new Sucursales();
  const estadosAPI = new Estados();
  const usuariosAPI = new Usuarios();

  //? VARIABLES DE LA VENTANA
  const token = localStorage.getItem('token');
  const [sucursales, setSucursales] = useState([]);
  const [estados, setEstados] = useState([]);
  const [sucursal, setSucursal] = useState([]);

  //? VARIABLES DE BUSQUEDA
  const [datosSucursales, setDatosSucursales] = useState([]);
  const [estado, setEstado] = useState(0);
  const [cadena, setCadena] = useState("");

  //? VARIABLES DE SUCURSAL
  const [nombre, setNombre] = useState("");
  const [ventanillas, setVentanillas] = useState("");

  //! URL
  const apiUrlSucursales = sucursalesAPI.listarSucursales();
  const apiUrlEstados = estadosAPI.listarEstados();
  const apiUrlValidacionToken = usuariosAPI.validarToken(token, 'ADMIN');

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
    axios
      .get(apiUrlValidacionToken, head)
      .then((response) => {
        if(!response.data) {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //! CARGA DE SUCURSALES Y ESTADOS
  useEffect(() => {
    fetchData(apiUrlSucursales, setSucursales);
    fetchData(apiUrlEstados, setEstados);
  }, []);

  //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
  useEffect(() => {
    const filtered = sucursales.filter((item) => {
      const matchesEstado = estado === 0 || item.Estado === estado;
      const matchesCadena =
        cadena === "" ||
        item.Nombre.toLowerCase().includes(cadena.toLowerCase());

      return matchesEstado && matchesCadena;
    });

    setDatosSucursales(filtered);
  }, [estado, cadena, sucursales]);

  //TODO: OBTENER ESTADO
  const obtenerEstado = (id) => {
    if (estados.length > 0) {
      const estado = estados.filter((item) => item.ID_Estado === id);
      if (estado[0] != null) {
        return estado[0].Nombre;
      } else {
        return 1;
      }
    }
  };

  //TODO: CAMBIO DE ESTADO SELECT ESTADOS
  const cambioEstado = (e) => {
    const dato = parseFloat(e.target.value);
    setEstado(dato);
  };

  //TODO: CAMBIO DE ESTADO INPUT CADENA
  const cambioCadena = (e) => {
    const dato = e.target.value;
    setCadena(dato);
  };

  //TODO: RESETEAR FILTROS
  const resetear = () => {
    setCadena("");
    setEstado(0);
  };

  //TODO: LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Sucursal");
    localStorage.removeItem("rol");
    localStorage.removeItem("user");
    navigate("/");
  };

  //TODO: MOTIVO ACTIVAR/DESACTIVAR
  const motivo = (item) => {
    const estado = obtenerEstado(item.Estado);

    if (estado === "ACTIVO") {
      return "DESACTIVAR";
    } else {
      return "ACTIVAR";
    }
  };

  //TODO: MENSAJE
  const mensaje = (item) => {
    const estado = obtenerEstado(item.Estado);

    if (estado === "ACTIVO") {
      return "¿Quiere desactivar esta sucursal?";
    } else {
      return "¿Quiere activar esta sucursal?";
    }
  };

  //TODO: ABRIR MODAL EDITAR
  const editar = (item) => {
    setSucursal(item);

    setNombre(item.Nombre);
    setVentanillas(item.Numero_Ventanillas);

    let modal = document.getElementById("modalEditar");
    modal.style.display = "block";
  };

  //TODO: CAMBIO NOMBRE
  const cambioNombre = (e) => {
    setNombre(e.target.value);
  };

  //TODO: CAMBIO NUMERO DE VENTANILLAS
  const cambioVentanillas = (e) => {
    setVentanillas(e.target.value);
  };

  //TODO: ACTUALIZAR SUCURSAL
  const actualizarSucursal = () => {
    const patron = /^[0-9]+$/;

    if (nombre === "") {
      alert("Ingrese un nombre");
    } else if (!patron.test(ventanillas) && ventanillas !== '') {
      alert("No se permiten letras en el número de ventanillas");
    } else {
      const suc = {
        id_Sucursal: sucursal.ID_Sucursal,
        nombre: nombre,
        numero_ventanillas: parseInt(ventanillas),
      };

      axios
        .put(sucursalesAPI.actualizarSucursalPorID(), suc, head)
        .then(() => {
          cerrarModalEditar();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  //TODO: CERRAR MODAL EDITAR
  const cerrarModalEditar = () => {
    let modal = document.getElementById("modalEditar");
    modal.style.display = "none";
  };

  //TODO: ABRIR MODAL DESACTIVAR
  const desactivar = (item) => {
    setSucursal(item);

    let modal = document.getElementById("modalDesactivar");
    modal.style.display = "block";
  };

  //TODO: CERRAR MODAL DESACTIVAR
  const cerrarModalDesactivar = () => {
    let modal = document.getElementById("modalDesactivar");
    modal.style.display = "none";
  };

  //TODO: ACTIVAR O DESACTIVAR SUCURSAL
  const cambiarEstado = () => {
    const estado = obtenerEstado(sucursal.Estado);
    let id = 0;

    if (estado === "ACTIVO") {
      id = 2;
    } else {
      id = 1;
    }

    const datos = {
      id_Sucursal: sucursal.ID_Sucursal,
      estado: id,
    };

    axios
      .put(sucursalesAPI.eliminarSucursalPorID(), datos, head)
      .then(() => {
        cerrarModalDesactivar();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  //TODO: ABRIR MODAL NUEVO
  const nuevo = () => {
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "block";
  };

  //TODO: CERRAR MODAL NUEVO
  const cerrarModalNuevo = () => {
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "none";
  };

  //TODO: NUEVA SUCURSAL
  const nuevaSucursal = () => {
    const patron = /^[0-9]+$/;

    if (nombre === "") {
      alert("Ingrese un nombre");
    } else if (!patron.test(ventanillas) && ventanillas !== '') {
      alert("No se permiten letras en el número de ventanillas");
    } else {
      const suc = {
        nombre: nombre,
        numero: parseInt(ventanillas),
        estado: 1,
      };
      
      axios
        .post(sucursalesAPI.crearNuevaSucursal(), suc, head)
        .then(() => {
          cerrarModalNuevo();
          resetear();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  //TODO: GENERAR PDF
  const generatePDF = () => {
    const datos = datosSucursales.map((item) => [
      item.Nombre,
      obtenerEstado(item.Estado),
      item.Numero_Ventanillas,
    ]);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.text("Tabla de Sucursales", 10, 10);

    const headers = ["Nombre", "Estado", "Número de ventanillas"];

    doc.autoTable({ head: [headers], body: datos });

    doc.save("Reporte_Sucursales.pdf");
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosSucursales.map((item) => [
      item.Nombre,
      obtenerEstado(item.Estado),
      item.Numero_Ventanillas,
    ]);

    const headers = ["Nombre", "Estado", "Número de ventanillas"];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws["!cols"] = wsCols;

    XLSX.writeFile(wb, "Reporte_Sucursales.xlsx");
  };

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>Tabla de administración de sucursales</h1>
        <button className="btnLogout" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
      <div className="Main-buscador">
        <select
          className="estados"
          id="estados"
          onChange={cambioEstado}
          value={estado}
        >
          <option value="0">Estado</option>
          {estados.slice(0, 2).map((estado) => (
            <option value={estado.ID_Estado}>{estado.Nombre}</option>
          ))}
        </select>

        <input
          type="text"
          className="buscador"
          id="buscador"
          placeholder="Buscar"
          value={cadena}
          onChange={cambioCadena}
        />

        <button className="btnResetear" onClick={resetear}>
          Resetear
        </button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Ventanillas</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datosSucursales.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.Nombre}</td>
              <td>{obtenerEstado(item.Estado)}</td>
              <td>{item.Numero_Ventanillas}</td>
              <td>
                <button className="btnObservacion" onClick={() => editar(item)}>
                  Editar
                </button>
              </td>
              <td>
                <button
                  className="btnEliminar"
                  onClick={() => desactivar(item)}
                >
                  {motivo(item)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="nuevo">
        <button className="btnNuevo" onClick={nuevo}>NUEVA SUCURSAL</button>
      </div>

      <div className="reportes">
        <button className="btnPDF slide_diagonal" onClick={generatePDF}>
          PDF
        </button>
        <button className="btnExcel slide_diagonal" onClick={generateExcel}>
          EXCEL
        </button>
      </div>

      <div id="modalEditar" className="modal">
        <div className="modal-content">
          <div className="modal-body">
            <h1>Actualizar sucursal</h1>
            <label>Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              onChange={cambioNombre}
              value={nombre}
              required
            />
            <br /> <br />
            <label>Numero de ventanillas:</label>
            <input
              type="text"
              id="ventanillas"
              name="ventanillas"
              onChange={cambioVentanillas}
              value={ventanillas}
              required
            />
            <br /> <br />
            <div className="btnModal">
              <button className='btnCancelar' onClick={cerrarModalEditar}>
                CERRAR
              </button>
              <button className="btnAceptar" onClick={actualizarSucursal}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="modalDesactivar" className="modal">
        <div className="modal-content">
          <div className="modal-body">
            <h1>{mensaje(sucursal)}</h1>
            <h1>{sucursal.Nombre}</h1>
            <div className="btnModal">
              <button className='btnCancelar' onClick={cerrarModalDesactivar}>
                CERRAR
              </button>
              <button className="btnAceptar" onClick={cambiarEstado}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="modalNuevo" className="modal">
        <div className="modal-content">
          <div className="modal-body">
            <h1>Nueva sucursal</h1>
            <label>Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              onChange={cambioNombre}
              value={nombre}
              required
            />
            <br /> <br />
            <label>Numero de ventanillas:</label>
            <input
              type="text"
              id="ventanillas"
              name="ventanillas"
              onChange={cambioVentanillas}
              value={ventanillas}
              required
            />
            <br /> <br />
            <div className="btnModal">
              <button className='btnCancelar' onClick={cerrarModalNuevo}>
                CERRAR
              </button>
              <button className="btnAceptar" onClick={nuevaSucursal}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaAdminSucursales;
