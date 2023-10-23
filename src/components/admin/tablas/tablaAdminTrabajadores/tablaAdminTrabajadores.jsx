import React, { useEffect, useState } from "react";
import "./tablaAdminTrabajadores.css";
import { Trabajadores, Estados, head } from "../../../../api/urls";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const TablaAdminTrabajadores = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const trabajadoresAPI = new Trabajadores();
  const estadosAPI = new Estados();

  //? VARIABLES DE LA VENTANA
  const [trabajadores, setTrabajadores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [trabajador, setTrabajador] = useState([]);

  //? VARIABLES DE BUSQUEDA
  const [datosTrabajadores, setDatosTrabajadores] = useState([]);
  const [estado, setEstado] = useState(0);
  const [cadena, setCadena] = useState("");

  //? VARIABLES DE TRABAJADOR
  const [cedula, setCedula] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [fecha, setFecha] = useState(null);

  //! URL
  const apiUrlTrabajadores = trabajadoresAPI.listarTrabajadores();
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

  //! CARGA DE TRABAJADORES Y ESTADOS
  useEffect(() => {
    fetchData(apiUrlTrabajadores, setTrabajadores);
    fetchData(apiUrlEstados, setEstados);
  }, [trabajadores, estados]);

  //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
  useEffect(() => {
    const filtered = trabajadores.filter((item) => {
      const matchesEstado = estado === 0 || item.Estado === estado;
      const matchesCadena =
        cadena === "" ||
        item.Primer_Nombre.toLowerCase().includes(cadena.toLowerCase()) ||
        item.Segundo_Nombre.toLowerCase().includes(cadena.toLowerCase()) ||
        item.Primer_Apellido.toLowerCase().includes(cadena.toLowerCase()) ||
        item.Segundo_Apellido.toLowerCase().includes(cadena.toLowerCase()) ||
        item.Cedula.toLowerCase().includes(cadena.toLowerCase());

      return matchesEstado && matchesCadena;
    });

    setDatosTrabajadores(filtered);
  }, [estado, cadena, trabajadores]);

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
        ).padStart(2, "0")}-${String(date.getDate() + 1).padStart(2, "0")}`;

        return fechaFormateada;
      }
    } else {
      return 1;
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
      return "¿Quiere desactivar este trabajador?";
    } else {
      return "¿Quiere activar este trabajador?";
    }
  };

  //TODO: ABRIR MODAL EDITAR
  const editar = (item) => {
    setTrabajador(item);

    setCedula(item.Cedula);
    setPrimerNombre(item.Primer_Nombre);
    setSegundoNombre(item.Segundo_Nombre);
    setPrimerApellido(item.Primer_Apellido);
    setSegundoApellido(item.Segundo_Apellido);

    const milliseconds = parseInt(item.Fecha_Nacimiento.match(/\d+/)[0], 10);

    const f = new Date(milliseconds);

    setFecha(f);

    let modal = document.getElementById("modalEditar");
    modal.style.display = "block";
  };

  //TODO: CAMBIO CEDULA
  const cambioCedula = (e) => {
    setCedula(e.target.value);
  };

  //TODO: CAMBIO PRIMER NOMBRE
  const cambioPrimerNombre = (e) => {
    setPrimerNombre(e.target.value);
  };

  //TODO: CAMBIO SEGUNDO NOMBRE
  const cambioSegundoNombre = (e) => {
    setSegundoNombre(e.target.value);
  };

  //TODO: CAMBIO PRIMER APELLIDO
  const cambioPrimerApellido = (e) => {
    setPrimerApellido(e.target.value);
  };

  //TODO: CAMBIO SEGUNDO APELLIDO
  const cambioSegundoApellido = (e) => {
    setSegundoApellido(e.target.value);
  };

  //TODO: CAMBIO FECHA
  const cambioFecha = (date) => {
    setFecha(date);
  };

  //TODO: ABRIR MODAL DESACTIVAR
  const desactivar = (item) => {
    setTrabajador(item);

    let modal = document.getElementById("modalDesactivar");
    modal.style.display = "block";
  };

  //TODO: ABRIR MODAL NUEVO
  const nuevo = () => {
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "block";
  };

  //TODO: CERRAR MODAL EDITAR
  const cerrarModalEditar = () => {
    let modal = document.getElementById("modalEditar");
    modal.style.display = "none";
  };

  //TODO: CERRAR MODAL DESACTIVAR
  const cerrarModalDesactivar = () => {
    let modal = document.getElementById("modalDesactivar");
    modal.style.display = "none";
  };

  //TODO: CERRAR MODAL NUEVO
  const cerrarModalNuevo = () => {
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "none";
  };

  //TODO: ACTUALIZAR TRABAJADOR
  const actualizarTrabajador = () => {
    const patron = /^[0-9]+$/;

    const milisegundos = fecha.getTime();
    const fecha_nac = `\/Date(${milisegundos})\/`;

    if (cedula === "") {
      alert("Ingrese la cedula");
    } else if (!patron.test(cedula)) {
      alert("No se permiten letras en la cedula");
    } else if (cedula.length < 10) {
      alert("La cedula debe tener 10 digitos");
    } else if (primerNombre === "" || primerApellido === "") {
      alert("Debe ingresar mínimo un nombre y un apellido");
    } else {
      const tra = {
        id_Trabajador: trabajador.ID_Trabajador,
        cedula: cedula,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        fecha_nacimiento: fecha_nac,
        estado: trabajador.Estado,
      };

      axios
        .put(trabajadoresAPI.actualizarTrabajadorPorID(), tra, head)
        .then(() => {
          cerrarModalEditar();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  //TODO: ACTIVAR O DESACTIVAR TRABAJADOR
  const cambiarEstado = () => {
    const estado = obtenerEstado(trabajador.Estado);
    let id = 0;

    if (estado === "ACTIVO") {
      id = 2;
    } else {
      id = 1;
    }

    const datos = {
      id_Trabajador: trabajador.ID_Trabajador,
      estado: id,
    };

    axios
      .put(trabajadoresAPI.eliminarTrabajadorPorID(), datos, head)
      .then(() => {
        cerrarModalDesactivar();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  //TODO: NUEVO TRABAJADOR
  const nuevoTrabajador = () => {
    const patron = /^[0-9]+$/;

    if (cedula === "") {
      alert("Ingrese la cedula");
    } else if (!patron.test(cedula)) {
      alert("No se permiten letras en la cedula");
    } else if (cedula.length < 10) {
      alert("La cedula debe tener 10 digitos");
    } else if (primerNombre === "" || primerApellido === "") {
      alert("Debe ingresar mínimo un nombre y un apellido");
    } else if (fecha === null) {
      alert("Seleccione la fecha");
    } else {
      const milisegundos = fecha.getTime();
      const fecha_nac = `\/Date(${milisegundos})\/`;

      const tra = {
        cedula: cedula,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        fecha_nacimiento: fecha_nac,
        estado: 1,
      };

      axios
        .post(trabajadoresAPI.crearNuevoTrabajador(), tra, head)
        .then(() => {
          cerrarModalNuevo();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  //TODO: GENERAR PDF
  const generatePDF = () => {
    const datos = datosTrabajadores.map((item) => [
      item.Cedula,
      item.Primer_Nombre +
        " " +
        item.Segundo_Nombre +
        " " +
        item.Primer_Apellido +
        " " +
        item.Segundo_Apellido,
      obtenerEstado(item.Estado),
      obtenerFecha(item.Fecha_Nacimiento),
    ]);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.text("Tabla de Trabajadores", 10, 10);

    const headers = ["Cedula", "Nombre", "Estado", "Fecha de Nacimiento"];

    doc.autoTable({ head: [headers], body: datos });

    doc.save("Reporte_Trabajadores.pdf");
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosTrabajadores.map((item) => [
      item.Cedula,
      item.Primer_Nombre +
        " " +
        item.Segundo_Nombre +
        " " +
        item.Primer_Apellido +
        " " +
        item.Segundo_Apellido,
      obtenerEstado(item.Estado),
      obtenerFecha(item.Fecha_Nacimiento),
    ]);

    const headers = ["Cedula", "Nombre", "Estado", "Fecha de Nacimiento"];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws["!cols"] = wsCols;

    XLSX.writeFile(wb, "Reporte_Trabajadores.xlsx");
  };

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>Tabla de administración de trabajadores</h1>
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
            <th>Cedula</th>
            <th>Estado</th>
            <th>Fecha Nacimiento</th>
            <th>Nombre</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datosTrabajadores.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.Cedula}</td>
              <td>{obtenerEstado(item.Estado)}</td>
              <td>{obtenerFecha(item.Fecha_Nacimiento)}</td>
              <td>
                {item.Primer_Nombre} {item.Segundo_Nombre}{" "}
                {item.Primer_Apellido} {item.Segundo_Apellido}
              </td>
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
        <button className="btnNuevo" onClick={nuevo}>
          NUEVO TRABAJADOR
        </button>
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
          <span className="close" onClick={cerrarModalEditar}>
            &times;
          </span>
          <div className="modal-body">
            <h1>Actualizar trabajador</h1>
            <label>Cedula:</label>
            <input
              type="text"
              id="cedulaTrabajador"
              name="cedulaTrabajador"
              onChange={cambioCedula}
              value={cedula}
              required
            />
            <br /> <br />
            <label>Primer Nombre:</label>
            <input
              type="text"
              id="primerNombre"
              name="primerNombre"
              onChange={cambioPrimerNombre}
              value={primerNombre}
              required
            />
            <br /> <br />
            <label>Segundo Nombre:</label>
            <input
              type="text"
              id="segundoNombre"
              name="segundoNombre"
              onChange={cambioSegundoNombre}
              value={segundoNombre}
              required
            />
            <br /> <br />
            <label>Primer Apellido:</label>
            <input
              type="text"
              id="primerApellido"
              name="primerApellido"
              onChange={cambioPrimerApellido}
              value={primerApellido}
              required
            />
            <br /> <br />
            <label>Segundo Apellido:</label>
            <input
              type="text"
              id="segundoApellido"
              name="segundoApellido"
              onChange={cambioSegundoApellido}
              value={segundoApellido}
              required
            />
            <br /> <br />
            <label>Fecha de nacimiento:</label>
            <DatePicker selected={fecha} onChange={cambioFecha} />
            <br /> <br />
            <button className="btnAceptar" onClick={actualizarTrabajador}>
              GUARDAR
            </button>
          </div>
        </div>
      </div>

      <div id="modalDesactivar" className="modal">
        <div className="modal-content">
          <span className="close" onClick={cerrarModalDesactivar}>
            &times;
          </span>
          <div className="modal-body">
            <h1>{mensaje(trabajador)}</h1>
            <h1>
              {trabajador.Primer_Nombre} {trabajador.Segundo_Nombre}{" "}
              {trabajador.Primer_Apellido} {trabajador.Segundo_Apellido}
            </h1>
            <button className="btnAceptar" onClick={cambiarEstado}>
              GUARDAR
            </button>
          </div>
        </div>
      </div>

      <div id="modalNuevo" className="modal">
        <div className="modal-content">
          <span className="close" onClick={cerrarModalNuevo}>
            &times;
          </span>
          <div className="modal-body">
            <h1>Nuevo trabajador</h1>
            <label>Cedula:</label>
            <input
              type="text"
              id="cedulaTrabajador"
              name="cedulaTrabajador"
              onChange={cambioCedula}
              value={cedula}
              required
            />
            <br /> <br />
            <label>Primer Nombre:</label>
            <input
              type="text"
              id="primerNombre"
              name="primerNombre"
              onChange={cambioPrimerNombre}
              value={primerNombre}
              required
            />
            <br /> <br />
            <label>Segundo Nombre:</label>
            <input
              type="text"
              id="segundoNombre"
              name="segundoNombre"
              onChange={cambioSegundoNombre}
              value={segundoNombre}
              required
            />
            <br /> <br />
            <label>Primer Apellido:</label>
            <input
              type="text"
              id="primerApellido"
              name="primerApellido"
              onChange={cambioPrimerApellido}
              value={primerApellido}
              required
            />
            <br /> <br />
            <label>Segundo Apellido:</label>
            <input
              type="text"
              id="segundoApellido"
              name="segundoApellido"
              onChange={cambioSegundoApellido}
              value={segundoApellido}
              required
            />
            <br /> <br />
            <label>Fecha de nacimiento:</label>
            <DatePicker selected={fecha} onChange={cambioFecha} />
            <br /> <br />
            <button className="btnAceptar" onClick={nuevoTrabajador}>
              GUARDAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaAdminTrabajadores;
