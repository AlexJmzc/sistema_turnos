import React, { useState, useEffect } from "react";
import "./tablaAdminUsuarios.css";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  Usuarios,
  Trabajadores,
  Estados,
  Roles,
  head,
} from "../../../../api/urls";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const TablaAdminUsuarios = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const usuariosAPI = new Usuarios();
  const trabajadoresAPI = new Trabajadores();
  const estadosAPI = new Estados();
  const rolesAPI = new Roles();

  //? VARIABLES DE LA VENTANA
  const [datosUsuario, setDatosUsuario] = useState([""]);
  const [trabajadores, setTrabajadores] = useState([""]);
  const [usuarios, setUsuarios] = useState([""]);
  const [estados, setEstados] = useState([""]);
  const [roles, setRoles] = useState([""]);
  const [usuario, setUsuario] = useState([]);

  //? VARIABLES DE BUSQUEDA
  const [rol, setRol] = useState(0);
  const [estado, setEstado] = useState(0);
  const [cadena, setCadena] = useState("");

  //? VARIABLES DE ACTUALIZACION
  const [nomUsu, setNomUsu] = useState("");
  const [claveUsu, setClaveUsu] = useState("");

  //! URL
  const apiUrlUsuarios = usuariosAPI.listarDatosUsuarios();
  const apiUrlTrabajadores = trabajadoresAPI.listarTrabajadores();
  const apiUrlEstados = estadosAPI.listarEstados();
  const apiUrlRoles = rolesAPI.listarRoles();

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

  //! CARGA DE USUARIOS, ESTADOS Y ROLES
  useEffect(() => {
    fetchData(apiUrlUsuarios, setUsuarios);
    fetchData(apiUrlEstados, setEstados);
    fetchData(apiUrlRoles, setRoles);
  }, [usuarios, estados, roles]);

  //! ACTUALIZACIÓN DE DATOS DE BUSQUEDA
  useEffect(() => {
    const filtered = usuarios.filter((item) => {
      const matchesRol = rol === 0 || item.ID_Rol === rol;
      const matchesEstado = estado === 0 || item.Estado === estado;
      const matchesCadena =
        cadena === "" ||
        item.Nombre.toLowerCase().includes(cadena.toLowerCase()) ||
        item.Nombre_Trabajador.toLowerCase().includes(cadena.toLowerCase()) ||
        item.Cedula.toLowerCase().includes(cadena.toLowerCase());

      return matchesRol && matchesEstado && matchesCadena;
    });

    setDatosUsuario(filtered);
  }, [usuarios, rol, estado, cadena]);

  //! CARGA LOS TRABAJADORES
  useEffect(() => {
    axios
      .get(apiUrlTrabajadores)
      .then((response) => {
        setTrabajadores(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [trabajadores, apiUrlTrabajadores]);

  //TODO: OBTENER TRABAJADOR
  const obtenerTrabajador = (id) => {
    if (trabajadores.length > 0) {
      const trabajador = trabajadores.filter(
        (item) => item.ID_Trabajador === id
      );
      if (trabajador[0] != null) {
        return trabajador[0].Cedula;
      } else {
        return 1;
      }
    }
  };

  //TODO: RESETEAR FILTROS
  const resetear = () => {
    setCadena("");
    setRol(0);
    setEstado(0);
  };

  //TODO: OBTENER ROL
  const obtenerRol = (id) => {
    if (roles.length > 0) {
      const rol = roles.filter((item) => item.ID_Rol === id);
      if (rol[0] != null) {
        return rol[0].Nombre;
      } else {
        return 1;
      }
    }
  };

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

  //TODO: CAMBIO DE ESTADO SELECT ROLES
  const cambioRol = (e) => {
    const dato = parseInt(e.target.value);
    setRol(dato);
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
      return "¿Quiere desactivar este usuario?";
    } else {
      return "¿Quiere activar este usuario?";
    }
  };

  //TODO: ABRIR MODAL EDITAR
  const editar = (item) => {
    setUsuario(item);
    setNomUsu(item.Nombre);
    setClaveUsu(item.Clave);
    let modal = document.getElementById("modalEditar");
    modal.style.display = "block";
  };

  //TODO: ABRIR MODAL DESACTIVAR
  const desactivar = (item) => {
    setUsuario(item);
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

  //TODO: CERRAR MODAL DESACTIVAR
  const cerrarModalNuevo = () => {
    let modal = document.getElementById("modalNuevo");
    modal.style.display = "none";
  };

  //TODO: CAMBIO NOMBRE USUARIO
  const cambioNombreUsuario = (e) => {
    setNomUsu(e.target.value);
  };

  //TODO: CAMBIO CLAVE USUARIO
  const cambioClaveUsuario = (e) => {
    setClaveUsu(e.target.value);
  };

  //TODO: ACTUALIZAR USUARIO
  const actualizarUsuario = () => {
    const rol = document.getElementById("rol").value;
    const trabajador = document.getElementById("trabajador").value;

    if(rol === '0') {
      alert('Seleccione un Rol Valido');
    } else if(trabajador === '0') {
      alert('Seleccione un Trabajador Valido')
    } else if(nomUsu === ''){
      alert('El Nombre de Usuario no puede quedar vacio')
    } else if(claveUsu === '') {
      alert('La Clave no puede quedar vacia')
    } else {
      const usu = {
        nombre: nomUsu,
        clave: claveUsu,
        id_Trabajador: trabajador,
        id_Rol: rol,
        estado: 1,
      };
  
      axios
      .put(usuariosAPI.actualizarUsuarioPorID(), usu, head)
      .then(() => {
        cerrarModalEditar();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  };

  //TODO: ACTIVAR O DESACTIVAR USUARIO
  const cambiarEstado = () => {
    const estado = obtenerEstado(usuario.Estado);
    let id = 0;

    if (estado === "ACTIVO") {
      id = 2;
    } else {
      id = 1;
    }

    const datos = {
      id_Usuario: usuario.ID_Usuario,
      estado: id,
    };

    axios
      .put(usuariosAPI.eliminarUsuarioPorID(), datos, head)
      .then(() => {
        cerrarModalDesactivar();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  //TODO: NUEVO USUARIO
  const nuevoUsuario = () => {
    const rol = document.getElementById("rolNuevo").value;
    const trabajador = document.getElementById("trabajadorNuevo").value;

    if(rol === '0') {
      alert('Seleccione un Rol Valido');
    } else if(trabajador === '0') {
      alert('Seleccione un Trabajador Valido')
    } else if(nomUsu === ''){
      alert('El Nombre de Usuario no puede quedar vacio')
    } else if(claveUsu === '') {
      alert('La Clave no puede quedar vacia')
    } else {
      const usu = {
        nombre: nomUsu,
        clave: claveUsu,
        id_Trabajador: trabajador,
        id_Rol: rol,
        estado: 1,
      };
  
      axios
        .post(usuariosAPI.crearNuevoUsuario(), usu, head)
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
    const datos = datosUsuario.map((item) => [
      item.Nombre,
      item.Cedula,
      item.Nombre_Trabajador,
      obtenerRol(item.ID_Rol),
      obtenerEstado(item.Estado),
    ]);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    doc.text("Tabla de Atenciones", 10, 10);

    const headers = ["Nombre", "Cedula", "Trabajador", "Rol", "Estado"];

    doc.autoTable({ head: [headers], body: datos });

    doc.save("Reporte_Usuarios.pdf");
  };

  //TODO: GENERAR EXCEL
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const datos = datosUsuario.map((item) => [
      item.Nombre,
      item.Cedula,
      item.Nombre_Trabajador,
      obtenerRol(item.ID_Rol),
      obtenerEstado(item.Estado),
    ]);
    const headers = ["Nombre", "Cedula", "Trabajador", "Rol", "Estado"];

    const wsData = [headers, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const wsCols = headers.map((header, index) => ({
      wch: header.length + 20,
    }));
    ws["!cols"] = wsCols;

    XLSX.writeFile(wb, "Reporte_Usuarios.xlsx");
  };

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>Tabla de administración de usuarios</h1>
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

        <select className="roles" id="roles" onChange={cambioRol} value={rol}>
          <option value="0">Roles</option>
          {roles.map((rol) => (
            <option value={rol.ID_Rol}>{rol.Nombre}</option>
          ))}
        </select>

        <input
          type="text"
          className="buscador"
          id="buscador"
          placeholder="Buscar"
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
            <th>Clave</th>
            <th>Cedula</th>
            <th>Nombre Trabajador</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {datosUsuario.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.Nombre}</td>
              <td>{item.Clave}</td>
              <td>{item.Cedula}</td>
              <td>{item.Nombre_Trabajador}</td>
              <td>{obtenerRol(item.ID_Rol)}</td>
              <td>{obtenerEstado(item.Estado)}</td>
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
        <button className="btnNuevo" onClick={nuevo}>NUEVO USUARIO</button>
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
            <h1>Actualizar usuario</h1>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              id="nombreUsuario"
              name="nombreUsuario"
              value={nomUsu}
              onChange={cambioNombreUsuario}
              required
            />
            <br /> <br />
            <label>Clave:</label>
            <input
              type="text"
              id="clave"
              name="clave"
              value={claveUsu}
              onChange={cambioClaveUsuario}
              required
            />
            <br /> <br />
            <label>Rol:</label>
            <select className="roles" id="rol">
              {roles.map((rol) => (
                <option
                  value={rol.ID_Rol}
                  selected={rol.ID_Rol === usuario.ID_Rol}
                >
                  {rol.Nombre}
                </option>
              ))}
            </select>
            <br /> <br />
            <label>Trabajador:</label>
            <select className="trabajadores" id="trabajador">
              {trabajadores.map((trabajador) => (
                <option
                  value={trabajador.ID_Trabajador}
                  selected={
                    trabajador.Cedula ===
                    obtenerTrabajador(usuario.ID_Trabajador)
                  }
                >
                  {trabajador.Primer_Nombre} {trabajador.Segundo_Nombre}{" "}
                  {trabajador.Primer_Apellido} {trabajador.Segundo_Apellido}{" "}
                </option>
              ))}
            </select>
            <br /> <br />
            <button className="btnAceptar" onClick={actualizarUsuario}>
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
            <h1>{mensaje(usuario)}</h1>
            <h1>{usuario.Nombre}</h1>
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
            <h1>Crear nuevo usuario</h1>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              id="nombreUsuario"
              name="nombreUsuario"
              value={nomUsu}
              onChange={cambioNombreUsuario}
              required
            />
            <br /> <br />
            <label>Clave:</label>
            <input
              type="text"
              id="clave"
              name="clave"
              value={claveUsu}
              onChange={cambioClaveUsuario}
              required
            />
            <br /> <br />
            <label>Rol:</label>
            <select className="roles" id="rolNuevo">
              <option value='0' selected>ROL</option>
              {roles.map((rol) => (
                <option
                  value={rol.ID_Rol}
                >
                  {rol.Nombre}
                </option>
              ))}
            </select>
            <br /> <br />
            <label>Trabajador:</label>
            <select className="trabajadores" id="trabajadorNuevo">
              <option value='0' selected>TRABAJADOR</option>
              {trabajadores.map((trabajador) => (
                <option
                  value={trabajador.ID_Trabajador}
                >
                  {trabajador.Primer_Nombre} {trabajador.Segundo_Nombre}{" "}
                  {trabajador.Primer_Apellido} {trabajador.Segundo_Apellido}{" "}
                </option>
              ))}
            </select>
            <br /> <br />
            <button className="btnAceptar" onClick={nuevoUsuario}>
              GUARDAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaAdminUsuarios;
