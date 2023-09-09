import React, { useEffect, useState } from "react";
import "./clientes.css";
import { useValue } from "../contexto";
import login from "../../assets/img/Logo.png";
import axios from "axios";

const Clientes = () => {
  let contadores = JSON.parse(localStorage.getItem("contadores")) || {};
  const { selectedValue } = useValue();
  const [tipos, setTipos] = useState([""]);
  const [turno , setTurno] = useState({});
  const [sucursal, setSucursal] = useState(null);

  //!URL API
  const apiUrlConsultas = "http://localhost:3014/ServiciosTurnos.svc/ListaTiposConsulta";
  const apiUrlSucursal = "http://localhost:3014/ServiciosTurnos.svc/Sucursal?id=" + selectedValue;
  const apiUrlNuevoTurno = "http://localhost:3014/ServiciosTurnos.svc/NuevoTurno?";

  useEffect(() => {
    axios
      .get(apiUrlConsultas)
      .then((response) => {
        setTipos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [tipos]);

  useEffect(() => {
    axios
      .get(apiUrlSucursal)
      .then((response) => {
        setSucursal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [sucursal]);

  function incrementarContador(nombreContador) {
    if (!contadores[nombreContador]) {
      contadores[nombreContador] = 1;
    } else {
      contadores[nombreContador]++;
    }
    localStorage.setItem("contadores", JSON.stringify(contadores));
  }

  function getContador(nombreContador) {
    if (!contadores[nombreContador]) {
      contadores[nombreContador] = 1;
      localStorage.setItem("contadores", JSON.stringify(contadores));
    }
    
    let n = JSON.parse(localStorage.getItem("contadores"))[nombreContador];
    return n;
  }

  function reiniciarTodosLosContadores() {
    for (const nombreContador in contadores) {
      contadores[nombreContador] = 1;
    }
    localStorage.setItem("contadores", JSON.stringify(contadores));
  }


  const showModal = (e) => {

    let idConsulta = e.target.id;

    let parrafos = document.getElementsByTagName('p');

    let tipoConsulta = "";

    for (const parrafo of parrafos) {
      if (parrafo.id === idConsulta) {
          tipoConsulta = parrafo.textContent;
      }
    }

    let n = getContador(tipoConsulta);

    let numero = tipoConsulta.substring(0,2) + n;

    let modal = document.getElementById("myModal");

    if(sucursal != null) {
        //!FECHA
        let fecha = new Date();

        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
        const dia = String(fecha.getDate()).padStart(2, '0'); 
        const hora = String(fecha.getHours()).padStart(2, '0'); 
        const minutos = String(fecha.getMinutes()).padStart(2, '0'); 

        const fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minutos}`;

        let ticket = {
          id_Consulta: idConsulta,
          id_Sucursal: selectedValue,
          fecha: fechaFormateada,
          estado: 3,
          sucursal: sucursal.Nombre,
          tipo: tipoConsulta,
          numeroTurno: numero
        }
        setTurno(ticket);
        modal.style.display = "block";
      }
      
  }

  const closeModal = (e) => {
    let modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  const sacarTurno = (e) => {
    let url = apiUrlNuevoTurno + "id_Tipo_Consulta=" + turno.id_Consulta + "&id_Sucursal=" + turno.id_Sucursal + "&fecha=" + turno.fecha + "&numero_turno=" + turno.numeroTurno + "&estado=" + turno.estado;
    axios
    .get(url)
    .then((response) => {
      incrementarContador(turno.tipo);
      alert("Turno generado");
      closeModal();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
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
            <img src={login} alt=""></img>
            <button className="Btn" id={tipo.ID_Tipo_Consulta} onClick={showModal}>
              TURNO
            </button>
          </div>
        ))}

        <div className="item">
          <p>CONSULTA PLANILLA DE AGUA</p>
          <img src={login} alt=""></img>
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
      </div>
    </div>
  );
};

export default Clientes;
