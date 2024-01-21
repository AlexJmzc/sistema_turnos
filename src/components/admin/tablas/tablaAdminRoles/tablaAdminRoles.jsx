import React, { useState, useEffect } from "react";
import { Roles, Estados, head, Usuarios } from "../../../../api/urls";
import axios from "axios";
import { useNavigate } from "react-router";
import "./tablaAdminRoles.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const TablaAdminRoles = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const rolesAPI = new Roles();
  const estadosAPI = new Estados();
  const usuariosAPI = new Usuarios();

  //? VARIABLES DE LA VENTANA
  const token = localStorage.getItem('token');
  const [roles, setRoles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [rol, setRol] = useState([]);

  //? VARIABLES DE BUSQUEDA
  const [datosRoles, setDatosRoles] = useState([]);
  const [estado, setEstado] = useState(0);
  const [cadena, setCadena] = useState("");

  //? VARIABLES DE ROL
  const [nombre, setNombre] = useState("");

  //! URL
  const apiUrlRoles = rolesAPI.listarRoles();
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

  //! CARGA DE ROLES Y ESTADOS
  useEffect(() => {
    fetchData(apiUrlRoles, setRoles);
    fetchData(apiUrlEstados, setEstados);
  }, []);

  //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
  useEffect(() => {
    const filtered = roles.filter((item) => {
      const matchesEstado = estado === 0 || item.Estado === estado;
      const matchesCadena =
        cadena === "" ||
        item.Nombre.toLowerCase().includes(cadena.toLowerCase());

      return matchesEstado && matchesCadena;
    });

    setDatosRoles(filtered);
  }, [estado, cadena, roles]);

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
      return "¿Quiere desactivar este rol?";
    } else {
      return "¿Quiere activar este rol?";
    }
  };

  //TODO: ABRIR MODAL EDITAR
  const editar = (item) => {
    setRol(item);

    setNombre(item.Nombre);

    let modal = document.getElementById("modalEditar");
    modal.style.display = "block";
  };

  //TODO: CAMBIO NOMBRE
  const cambioNombre = (e) => {
    setNombre(e.target.value);
  };

  //TODO: ACTUALIZAR ROL
  const actualizarRol = () => {
    if (nombre === "") {
      alert("Ingrese un nombre");
    } else {
      const r = {
        id_Rol: rol.ID_Rol,
        nombre: nombre,
        estado: rol.Estado
      };

      axios
        .put(rolesAPI.actualizarRolPorID(), r, head)
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
    setRol(item);

    let modal = document.getElementById("modalDesactivar");
    modal.style.display = "block";
  };

  //TODO: CERRAR MODAL DESACTIVAR
  const cerrarModalDesactivar = () => {
    let modal = document.getElementById("modalDesactivar");
    modal.style.display = "none";
  };

  //TODO: ACTIVAR O DESACTIVAR ROL
  const cambiarEstado = () => {
    const estado = obtenerEstado(rol.Estado);
    let id = 0;

    if (estado === "ACTIVO") {
      id = 2;
    } else {
      id = 1;
    }

    const datos = {
      id_Rol: rol.ID_Rol,
      estado: id,
    };

    axios
      .put(rolesAPI.eliminarRolPorID(), datos, head)
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
    setRol("");
    setNombre("");
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "block";
  };

  //TODO: CERRAR MODAL NUEVO
  const cerrarModalNuevo = () => {
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "none";
  };

  //TODO: NUEVO ROL
  const nuevoRol = () => {

    if (nombre === "") {
      alert("Ingrese un nombre");
    } else {
      const r = {
        nombre: nombre,
        estado: 1,
      };

      axios
        .post(rolesAPI.crearNuevoRol(), r, head)
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
    const datos = datosRoles.map((item) => [
      item.Nombre,
      obtenerEstado(item.Estado),
    ]);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.text("Tabla de Roles", 10, 10);

    const headers = ["Nombre", "Estado"];

    doc.autoTable({ head: [headers], body: datos });

    doc.save("Reporte_Roles.pdf");
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosRoles.map((item) => [
      item.Nombre,
      obtenerEstado(item.Estado),
    ]);

    const headers = ["Nombre", "Estado"];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws["!cols"] = wsCols;

    XLSX.writeFile(wb, "Reporte_Roles.xlsx");
  };

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>Tabla de administración de roles</h1>
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
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datosRoles.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.Nombre}</td>
              <td>{obtenerEstado(item.Estado)}</td>
              <td>
                <button className="btnObservacion" onClick={() => editar(item)}>
                  Editar
                </button>
              </td>
              <td>
                <button className="btnEliminar" onClick={() => desactivar(item)}>{motivo(item)}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="nuevo">
        <button className="btnNuevo" onClick={nuevo}>NUEVO ROL</button>
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
            <h1>Actualizar rol</h1>
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
            <div className="btnModal">
              <button className='btnCancelar' onClick={cerrarModalEditar}>
                CERRAR
              </button>
              <button className="btnAceptar" onClick={actualizarRol}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="modalDesactivar" className="modal">
        <div className="modal-content">
          <div className="modal-body">
            <h1>{mensaje(rol)}</h1>
            <h1>{rol.Nombre}</h1>
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
            <h1>Nuevo rol</h1>
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
            <div className="btnModal">
              <button className='btnCancelar' onClick={cerrarModalNuevo}>
                CERRAR
              </button>
              <button className="btnAceptar" onClick={nuevoRol}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaAdminRoles;
