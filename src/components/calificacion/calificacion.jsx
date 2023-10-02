import React, { useState, useEffect } from "react";
import { Atenciones, Calificaciones, Sucursales } from "../../api/urls";
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

  //? VALORES PREGUNTAS
  const [pregunta1, setPregunta1] = useState(0);
  const [pregunta2, setPregunta2] = useState(0);
  const [pregunta3, setPregunta3] = useState(0);

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
        return (
          item.Sucursal === suc &&
          item.Ventanilla === ven
        );
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
        return (
          item.Sucursal === suc &&
          item.Ventanilla === ven
        );
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

  //TODO: OBTENER LA FECHA Y HORA
  const obtenerHora = (f) => {
    if (f) {
      const match = f.match(/\/Date\((\d+)([+-]\d{4})\)\//);

      if (match) {
        const timestamp = parseInt(match[1], 10);
        const timeZoneOffset = -5 * 60 * 60;

        const date = new Date(timestamp + timeZoneOffset);

        const fechaFormateada = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`;

        return fechaFormateada;
      }
    } else {
      return 1;
    }
  };

  const cambioPregunta1 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta1(valor);
  }

  const cambioPregunta2 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta2(valor);
  }

  const cambioPregunta3 = (e) => {
    const valor = parseInt(e.target.value);
    setPregunta3(valor);
  }

  const siguiente1 = () => {
    if(pregunta1 === 0) {
      alert("Debe seleccionar una opción")
    } else {
      let formulario1 = document.getElementById("Form1");
      let formulario2 = document.getElementById("Form2");
      formulario1.style.display = "none";
      formulario2.style.display = "flex";
    }
  }

  const siguiente2 = () => {
    if(pregunta2 === 0) {
      alert("Debe seleccionar una opción")
    } else {
      let formulario2 = document.getElementById("Form2");
      let formulario3 = document.getElementById("Form3");
      formulario2.style.display = "none";
      formulario3.style.display = "flex";
    }
  }

  const siguiente3 = () => {
    if(pregunta3 === 0) {
      alert("Debe seleccionar una opción")
    } else {
      let formulario3 = document.getElementById("Form3");
      let formulario4 = document.getElementById("Form4");
      formulario3.style.display = "none";
      formulario4.style.display = "flex";
    }
  }

  const reinicio = () => {
    setPregunta1(0);
    setPregunta2(0);
    setPregunta3(0);
    let formulario1 = document.getElementById("Form1");
    let formulario4 = document.getElementById("Form4");
    formulario4.style.display = "none";
    formulario1.style.display = "flex";
  }

  //TODO: ACTUALIZAR CALIFICACION DE ATENCION
  const calificar = (e) => {
    const calificacion = e.target.textContent.toUpperCase();
    const atencion = obtenerAtencion();

    const urlActualizarCalificacion = calificacionesAPI.actualizarCalificacionPorID(atencion.ID_Atencion, pregunta1, pregunta2, pregunta3, calificacion);
    if(atencion.ID_Atencion !== undefined) {
        axios
        .get(urlActualizarCalificacion)
        .then((response) => {
          reinicio();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      }
  };

  return (
    <div className="Main">
      <div className="Main-body-cal">
        <h1>TURNO {obtenerNumeroTurno()}</h1>
        <div className="Formulario">
          <div className="Form1" id="Form1">
            <h1>¿Está satisfecho con esta atención?</h1>
            <h1>Valore con 1 el valor más bajo y 5 el valor más alto</h1>
            <div className="check">
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion1" value="1" onChange={cambioPregunta1}/>
                <label>
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion2" value="2" onChange={cambioPregunta1}/>
                <label>
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion3" value="3" onChange={cambioPregunta1}/>
                <label>
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion4" value="4" onChange={cambioPregunta1}/>
                <label>
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion5" value="5" onChange={cambioPregunta1}/>
                <label>
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente1}>Siguiente</button>
          </div>

          <div className="Form2" id="Form2">
            <h1>¿El agente mostró conocimiento sobre el tema?</h1>
            <h1>Valore con 1 el valor más bajo y 5 el valor más alto</h1>
            <div className="check">
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion1" value="1" onClick={cambioPregunta2}/>
                <label>
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion2" value="2" onClick={cambioPregunta2}/>
                <label>
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion3" value="3" onClick={cambioPregunta2}/>
                <label>
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion4" value="4" onClick={cambioPregunta2}/>
                <label>
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion5" value="5" onClick={cambioPregunta2}/>
                <label>
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente2}>Siguiente</button>
          </div>

          <div className="Form3" id="Form3">
            <h1>¿El tiempo fue adecuado?</h1>
            <h1>Valore con 1 el valor más bajo y 5 el valor más alto</h1>
            <div className="check">
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion1" value="1" onChange={cambioPregunta3}/>
                <label>
                  <span>1</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion2" value="2" onChange={cambioPregunta3}/>
                <label>
                  <span>2</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion3" value="3" onChange={cambioPregunta3}/>
                <label>
                  <span>3</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion4" value="4" onChange={cambioPregunta3}/>
                <label>
                  <span>4</span>
                </label>
              </div>
              <div className="round-checkbox">
                <input type="radio" name="opcion" id="opcion5" value="5" onChange={cambioPregunta3}/>
                <label>
                  <span>5</span>
                </label>
              </div>
            </div>
            <button className="btnBuena" onClick={siguiente3}>Siguiente</button>
          </div>

          <div className="Form4" id="Form4">
            <h1>Califica esta atención</h1>
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
