import React, { useState, useEffect } from "react";
import { Atenciones, Calificaciones, Sucursales, head } from "../../api/urls";
import axios from "axios";
import "./calificacion.css";

const Calificacion = () => {
  //? INSTANCIAS DE LAS CLASES DE LAS API
  const sucursalesAPI = new Sucursales();
  const atencionesAPI = new Atenciones();
  const calificacionesAPI = new Calificaciones();

  //? VARIABLES DE LA VENTANA
  const [ventanilla, setVentanilla] = useState(
    0 || localStorage.getItem("ventanilla")
  );
  const sucursalID = localStorage.getItem("sucursal");
  const [sucursal, setSucursal] = useState([]);
  const [arrayNumeros, setArray] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [atencionCalificada, setAtencionCalificada] = useState({});

  //? VALORES PREGUNTAS
  const [pregunta1, setPregunta1] = useState(0);
  const [pregunta2, setPregunta2] = useState(0);
  const [pregunta3, setPregunta3] = useState(0);
  const [pregunta4, setPregunta4] = useState(0);

  //! URL
  const apiUrlSucursal = sucursalesAPI.sucursalPorID(sucursalID);
  const apiUrlAtenciones = atencionesAPI.listarDatosAtenciones();

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
    if (ventanilla !== null && ventanilla > 0) {
      closeModal();
    } else {
      abrirModal();
    }
  }, [ventanilla]);

  //! LLENAR ARRAY DE SUCURSALES
  const array = (n) => {
    const num = [];
    for (let i = 1; i <= n; i++) {
      num.push(i);
    }

    return num;
  };

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
  };

  //TODO: CERRAR MODAL
  const closeModal = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

  //TODO: OBTENER ATENCION
  const obtenerAtencion = () => {
    const suc = parseInt(sucursalID);
    const ven = parseInt(ventanilla);

    if (atenciones.length > 0) {
      const ate = atenciones.filter((item) => {
        return item.Sucursal === suc && item.Ventanilla === ven;
      });

      if (ate[0] != null) {
        return ate[ate.length - 1];
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  };

  //TODO: NUMERO DE TURNO
  const obtenerNumeroTurno = () => {
    const suc = parseInt(sucursalID);
    const ven = parseInt(ventanilla);

    if (atenciones.length > 0) {
      const ate = atenciones.filter((item) => {
        return item.Sucursal === suc && item.Ventanilla === ven;
      });

      if (ate[ate.length - 1] != null) {
        return ate[ate.length - 1].Numero_Turno;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  };


  const cambioPregunta1 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta1(valor);
  };

  const cambioPregunta2 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta2(valor);
  };

  const cambioPregunta3 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta3(valor);
  };

  const cambioPregunta4 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta4(valor);
  };

  const siguiente1 = () => {
    if (pregunta1 === 0) {
      alert("Debe seleccionar una opción");
    } else {
      let formulario1 = document.getElementById("Form1");
      let formulario2 = document.getElementById("Form2");
      formulario1.style.display = "none";
      formulario2.style.display = "flex";
    }
  };

  const siguiente2 = () => {
    if (pregunta2 === 0) {
      alert("Debe seleccionar una opción");
    } else {
      let formulario2 = document.getElementById("Form2");
      let formulario3 = document.getElementById("Form3");
      formulario2.style.display = "none";
      formulario3.style.display = "flex";
    }
  };

  const siguiente3 = () => {
    if (pregunta3 === 0) {
      alert("Debe seleccionar una opción");
    } else {
      let formulario3 = document.getElementById("Form3");
      let formulario4 = document.getElementById("Form4");
      formulario3.style.display = "none";
      formulario4.style.display = "flex";
    }
  };

  const siguiente4 = () => {
    if (pregunta4 === 0) {
      alert("Debe seleccionar una opción");
    } else {
      let formulario4 = document.getElementById("Form4");
      let formulario5 = document.getElementById("Form5");
      formulario4.style.display = "none";
      formulario5.style.display = "block";
    }
  };

  const reinicio = () => {
    setPregunta1(0);
    setPregunta2(0);
    setPregunta3(0);
    setPregunta4(0);
    let formulario1 = document.getElementById("Form1");
    let formulario5 = document.getElementById("Form5");
    formulario5.style.display = "none";
    formulario1.style.display = "flex";
  };

  //TODO: ACTUALIZAR CALIFICACION DE ATENCION
  const calificar = (e) => {
    const calificacion = e.target.textContent.toUpperCase();
    const atencion = obtenerAtencion();

    if (atencion.ID_Atencion === atencionCalificada.ID_Atencion) {
      alert("Esta atención ya fue calificada");
      reinicio();
    } else {
      const nuevaAtencion = {
        id_Atencion: atencion.ID_Atencion,
        pregunta_1: pregunta1,
        pregunta_2: pregunta2,
        pregunta_3: pregunta3,
        pregunta_4: pregunta4,
        valoracion: calificacion,
      };

      const urlActualizarCalificacion = calificacionesAPI.actualizarCalificacionPorID();
      if (atencion.ID_Atencion !== undefined) {
        axios
          .put(urlActualizarCalificacion, nuevaAtencion, head)
          .then((response) => {
            setAtencionCalificada(response.data.ActualizarCalificacionResult);
            reinicio();
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  };

  return (
    <div className="Main">
      <div className="Main-body-cal">
        <h1>TURNO {obtenerNumeroTurno()}</h1>
        <div className="Formulario">
          <div className="Form1" id="Form1">
            <h1>
              ¿El trato del personal del balcón de servicios e información con
              los usuarios es cordial y respetuoso?
            </h1>
            <h1>
              Valore teniendo en cuenta 1 Nada Satisfecho y 5 Muy Satisfecho
            </h1>
            <div className="check">
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion11"
                  value="1"
                  onChange={cambioPregunta1}
                />
                <label for="opcion11">
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion12"
                  value="2"
                  onChange={cambioPregunta1}
                />
                <label for="opcion12">
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion13"
                  value="3"
                  onChange={cambioPregunta1}
                />
                <label for="opcion13">
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion14"
                  value="14"
                  onChange={cambioPregunta1}
                />
                <label for="opcion14">
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion15"
                  value="15"
                  onChange={cambioPregunta1}
                />
                <label for="opcion15">
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente1}>
              Siguiente
            </button>
          </div>

          <div className="Form2" id="Form2">
            <h1>
              ¿Es adecuado el tiempo de espera para ser atendido en el balcón de
              servicios e información?
            </h1>
            <h1>
              Valore teniendo en cuenta 1 Nada Satisfecho y 5 Muy Satisfecho
            </h1>
            <div className="check">
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion21"
                  value="1"
                  onClick={cambioPregunta2}
                />
                <label for="opcion21">
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion22"
                  value="2"
                  onClick={cambioPregunta2}
                />
                <label for="opcion22">
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion23"
                  value="3"
                  onClick={cambioPregunta2}
                />
                <label for="opcion23">
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion24"
                  value="4"
                  onClick={cambioPregunta2}
                />
                <label for="opcion24">
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion25"
                  value="5"
                  onClick={cambioPregunta2}
                />
                <label for="opcion25">
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente2}>
              Siguiente
            </button>
          </div>

          <div className="Form3" id="Form3">
            <h1>
              ¿El personal del balcón de servicios e información que atiende sus
              requerimientos o reclamos, muestra estar capacitado para brindarle
              soluciones?
            </h1>
            <h1>
              Valore teniendo en cuenta 1 Nada Satisfecho y 5 Muy Satisfecho
            </h1>
            <div className="check">
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion31"
                  value="1"
                  onChange={cambioPregunta3}
                />
                <label for="opcion31">
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion32"
                  value="2"
                  onChange={cambioPregunta3}
                />
                <label for="opcion32">
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion33"
                  value="3"
                  onChange={cambioPregunta3}
                />
                <label for="opcion33">
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion34"
                  value="4"
                  onChange={cambioPregunta3}
                />
                <label for="opcion34">
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion35"
                  value="5"
                  onChange={cambioPregunta3}
                />
                <label for="opcion35">
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente3}>
              Siguiente
            </button>
          </div>

          <div className="Form4" id="Form4">
            <h1>
              ¿Se le informa adecuadamente cuanto tiempo tomará la atención del
              trámite solicitado?
            </h1>
            <h1>
              Valore teniendo en cuenta 1 Nada Satisfecho y 5 Muy Satisfecho
            </h1>
            <div className="check">
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion41"
                  value="1"
                  onChange={cambioPregunta4}
                />
                <label for="opcion41">
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion42"
                  value="2"
                  onChange={cambioPregunta4}
                />
                <label for="opcion42">
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion43"
                  value="3"
                  onChange={cambioPregunta4}
                />
                <label for="opcion43">
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion44"
                  value="4"
                  onChange={cambioPregunta4}
                />
                <label for="opcion44">
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input
                  type="radio"
                  name="opcion"
                  id="opcion45"
                  value="5"
                  onChange={cambioPregunta4}
                />
                <label for="opcion45">
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente4}>
              Siguiente
            </button>
          </div>

          <div className="Form5" id="Form5">
            <h1>Califica esta atención</h1>
            <div className="botonesCal">
              <button className="btnBuena" onClick={calificar}>
                BUENA
              </button>
              <button className="btnRegular" onClick={calificar}>
                REGULAR
              </button>
              <button className="btnMala" onClick={calificar}>
                MALA
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="myModal" className="modalCal">
        <div className="modal-content">
          <div className="modal-body">
            <h1>Seleccione el número de ventanilla</h1>
            <select id="ventanilla" onChange={cambioVentanilla}>
              <option value="0">Selecciona la ventanilla</option>
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
  );
};

export default Calificacion;
