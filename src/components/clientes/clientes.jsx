import React, { useEffect, useState } from "react";
import "./clientes.css";
import boleto from "../../assets/img/boleto.png";
import consulta from "../../assets/img/consulta.png";
import { Sucursales, Tipos_Consulta, Turnos, Contadores, head } from "../../api/urls";
import axios from "axios";

const Clientes = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS APIS
  const sucursales = new Sucursales();
  const consultas = new Tipos_Consulta();
  const turnos = new Turnos();
  const contadores = new Contadores();

  //? CONSTANTES DE LA VENTANA
  const [ selectedValue ] = localStorage.getItem("sucursal");
  const [tipos, setTipos] = useState([""]);
  const [turno , setTurno] = useState({});
  const [sucursal, setSucursal] = useState(null);

  //!URL API
  const apiUrlConsultas = consultas.listarTiposConsulta();
  const apiUrlSucursal = sucursales.sucursalPorID(selectedValue);

  //! CARGA DE CONSULTAS
  useEffect(() => {
    axios
      .get(apiUrlConsultas)
      .then((response) => {
        setTipos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //! CARGA DE SUCURSAL
  useEffect(() => {
    axios
      .get(apiUrlSucursal)
      .then((response) => {
        setSucursal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  //TODO: INCREMENTAR CONTADOR
  function incrementarContador(id_Consulta, id_Sucursal, numero) {
    let nuevoNumero = numero + 1;
    const url = contadores.actualizarContadorNumero(id_Sucursal, id_Consulta, nuevoNumero);
      axios
      .get(url)
      .then((response) => {
          
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  //TODO: GET CONTADOR
  async function getContador(id_Consulta, id_Sucursal) {
    let contador = {};
    const urlGetContador = contadores.contadorPorID(id_Sucursal, id_Consulta);
    const urlNuevoContador = contadores.crearContador(id_Sucursal, id_Consulta);
    try {
      const response = await axios.get(urlGetContador);
      contador = response.data;
  
      if (contador.ID_Sucursal === 0) {
        const nuevoContadorResponse = await axios.get(urlNuevoContador);
        contador = nuevoContadorResponse.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
    return contador;
  }

  //TODO: ABRIR MODAL
  const showModal = (e) => {

    let idConsulta = e.target.id;

    let parrafos = document.getElementsByTagName('p');

    let tipoConsulta = "";

    for (const parrafo of parrafos) {
      if (parrafo.id === idConsulta) {
          tipoConsulta = parrafo.textContent;
      }
    }

    getContador(idConsulta, sucursal.ID_Sucursal)
      .then((contador) => {
        let n = contador.Numero;

        let numero = tipoConsulta.substring(0,2) + n;

        let modal = document.getElementById("myModal");

        if(sucursal != null) {
          //!FECHA
          let fecha = new Date();

          const milisegundos = fecha.getTime();
          const fechaFormateada = `\/Date(${milisegundos})\/`;

          let ticket = {
            id_Consulta: idConsulta,
            id_Sucursal: selectedValue,
            fecha: fechaFormateada,
            estado: 3,
            sucursal: sucursal.Nombre,
            tipo: tipoConsulta,
            num: n,
            numeroTurno: numero
          }
          setTurno(ticket);
          modal.style.display = "block";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //TODO: CERRAR MODAL
  const closeModal = (e) => {
    let modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  //TODO: CERRAR MODAL TURNO ALERTA
  const abrirModalTurno = (e) => {
    let modal = document.getElementById("modalTurnoGenerado");

    modal.style.display = "block";
 }

   //TODO: CERRAR MODAL TURNO ALERTA
   const closeModalTurno = (e) => {
      let modal = document.getElementById("modalTurnoGenerado");

      modal.style.display = "none";
   }

  //TODO: SACAR TURNO
  const sacarTurno = (e) => {
    const nuevoTurno = {
      id_Tipo_Consulta: turno.id_Consulta,
      id_Sucursal: turno.id_Sucursal,
      fecha: turno.fecha,
      numero_turno: turno.numeroTurno,
      estado: turno.estado
    }

    const urlNuevoTurno = turnos.crearNuevoTurno();
  
    axios
    .post(urlNuevoTurno, nuevoTurno , head)
    .then((response) => {
      incrementarContador(turno.id_Consulta, turno.id_Sucursal, turno.num);
      closeModal();
      abrirModalTurno();
      //imprimirTicket();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

  //TODO: IMPRESION DE TICKET
  function imprimirTicket() {
    const contenidoTicket = `
                <div style="text-align: center;">
                    <h1>EP-EMAPA-A</h1>
                    <p>${turno.sucursal}</p>
                    <hr>
                    <p>TURNO:</p>
                    <ul>
                        <li>${turno.tipo}</li>
                        <li>${turno.numeroTurno}</li>
                    </ul>
                </div>
            `;

        //printJS({ printable: contenidoTicket, type: 'html' });
  }

  return (
    <div className="Main">
      <div className="Main-titulo">
        <h1>TURNOS</h1>
      </div>

      <div className="Main-body-clientes">
        {tipos.map((tipo) => (
          <div className="item">
            <p id={tipo.ID_Tipo_Consulta}>{tipo.Nombre}</p>
            <img src={boleto} alt=""></img>
            <button className="Btn" id={tipo.ID_Tipo_Consulta} onClick={showModal}>
              TURNO
            </button>
          </div>
        ))}

        <div className="item">
          <p>CONSULTA PLANILLA DE AGUA</p>
          <img src={consulta} alt=""></img>
          <a href="http://186.42.184.58:8989/Consulta/consultar.aspx">
            <button className="Btn" id="planilla">
              CONSULTA
            </button>
          </a>
        </div>

        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" on onClick={closeModal}>&times;</span>
            <div className="modal-body">
                <header>SUCURSAL {turno.sucursal}</header>
                <p id="">SACAR TURNO PARA {turno.tipo}</p>
                <p id="">TURNO NÚMERO {turno.numeroTurno}</p>
                <div className="botones">
                  <button className="btnCancelar" onClick={closeModal}>CANCELAR</button>
                  <button className="btnAceptar" onClick={sacarTurno}>ACEPTAR</button>
                </div>
            </div>
          </div>
        </div>

        <div id="modalTurnoGenerado" className="modal">
          <div className="modal-content">
            <span className="close" on onClick={closeModalTurno}>&times;</span>
            <div className="modal-body">
                <header>TURNO GENERADO</header>
                <div className="botones">
                  <button className="btnAceptar" onClick={closeModalTurno}>ACEPTAR</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
