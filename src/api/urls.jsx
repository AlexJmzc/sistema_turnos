const baseURL = "http://localhost:4040/";
//const baseURL = "http://192.168.24.62:8010/";

const baseServicio = "ServiciosTurnos.svc";

const urlTotal = baseURL + baseServicio;

export const head = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': '*/*',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
}

export class Estados {
    listaEstados = "/ListaEstados";
    estadoID = "/Estado?id=";
    estadoNombre = "/EstadoNombre?nombre=";
    nuevoEstado = "/EstadoNombre";
    actualizarEstado = "/ActualizarEstado";

    listarEstados() {
        const url = urlTotal + this.listaEstados;
        return url;
    }

    estadoPorID(id) {
        const url = urlTotal + this.estadoID + id;
        return url;
    }

    estadoPorNombre(nombre) {
        const url = urlTotal + this.estadoNombre + nombre;
        return url;
    }

    crearNuevoEstado() {
        const url = urlTotal + this.nuevoEstado;
        return url;
    }

    actualizarEstadoPorID() {
        const url = urlTotal + this.actualizarEstado;
        return url;
    }
}

export class Roles {
    listaRoles = "/ListaRoles";
    rolID = "/Rol?id=";
    rolNombre = "/RolNombre?nombre=";
    rolesEstado = "/RolesEstado?estado=";
    nuevoRol = "/NuevoRol";
    actualizarRol = "/ActualizarRol";
    eliminarRol = "/EliminarRol";

    listarRoles() {
        const url = urlTotal + this.listaRoles;
        return url;
    }

    rolPorID(id) {
        const url = urlTotal+ id;
        return url;
    }

    rolPorNombre(nombre) {
        const url = urlTotal + nombre;
        return url;
    }

    rolesPorEstado(estado) {
        const url = urlTotal + estado;
        return url;
    }

    crearNuevoRol() {
        const url = urlTotal + this.nuevoRol;
        return url;
    }

    actualizarRolPorID() {
        const url = urlTotal + this.actualizarRol;
        return url;
    }

    eliminarRolPorID() {
        const url = urlTotal + this.eliminarRol;
        return url;
    }
}

export class Tipos_Consulta {
    listaTiposConsulta = "/ListaTiposConsulta";
    tipoConsultaID = "/TipoConsulta?id=";
    tipoConsultaNombre = "/TipoConsultaNombre?nombre=";
    tipoConsultaEstado = "/TiposConsultaEstado?estado=";
    nuevoTipoConsulta = "/NuevoTipoConsulta";
    actualizarTipoConsulta = "/ActualizarTipoConsulta";
    eliminarTipoConsulta = "/EliminarTipoConsulta";
    
    listarTiposConsulta() {
        const url = urlTotal + this.listaTiposConsulta;
        return url;
    }

    tipoConsultaPorID(id) {
        const url = urlTotal + this.tipoConsultaID + id;
        return url;
    }

    tipoConsultaPorNombre(nombre) {
        const url = urlTotal + this.tipoConsultaNombre + nombre;
        return url;
    }

    tipoConsultaPorEstado(estado) {
        const url = urlTotal + this.tipoConsultaEstado + estado;
        return url;
    }

    crearNuevoTipoConsulta() {
        const url = urlTotal + this.nuevoTipoConsulta;
        return url;
    }

    actualizarTipoConsultaPorID() {
        const url = urlTotal+ this.actualizarTipoConsulta;
        return url;
    }

    eliminarTipoConsultaPorID() {
        const url = urlTotal + this.eliminarTipoConsulta;
        return url;
    }
}

export class Sucursales {
    listaSucursales = "/ListaSucursales";
    sucursalID = "/Sucursal?id=";
    sucursalNombre = "/SucursalNombre?nombre=";
    sucursalesEstado = "/SucursalesEstado?estado=";
    nuevaSucursal = "/NuevaSucursal";
    actualizarSucursal = "/ActualizarSucursal";
    eliminarSucursal = "/EliminarSucursal";

    listarSucursales() {
        const url = urlTotal + this.listaSucursales;
        return url; 
    }

    sucursalPorID(id) {
        const url = urlTotal + this.sucursalID + id;
        return url;
    }

    sucursalPorNombre(nombre) {
        const url = urlTotal + this.sucursalNombre + nombre;
        return url;
    }

    sucursalesPorEstado(estado) {
        const url = urlTotal + this.sucursalesEstado + estado;
        return url;
    }

    crearNuevaSucursal() {
        const url = urlTotal + this.nuevaSucursal;
        return url;
    }

    actualizarSucursalPorID() {
        const url = urlTotal + this.actualizarSucursal;
        return url;
    }

    eliminarSucursalPorID() {
        const url = urlTotal + this.eliminarSucursal;
        return url;
    }
}

export class Trabajadores {
    listaTrabajadores = "/ListaTrabajadores";
    trabajadorID = "/Trabajador?id=";
    trabajadorCedula = "/TrabajadorCedula?cedula=";
    trabajadoresEstado = "/TrabajadoresEstado?estado=";
    nuevoTrabajador = "/NuevoTrabajador";
    actualizarTrabajador = "/ActualizarTrabajador";
    eliminarTrabajador = "/EliminarTrabajador";

    listarTrabajadores() {
        const url = urlTotal + this.listaTrabajadores;
        return url;
    }

    trabajadorPorID(id) {
        const url = urlTotal + this.trabajadorID + id;
        return url;
    }

    trabajadorPorCedula(cedula) {
        const url = urlTotal + this.trabajadorCedula + cedula;
        return url;
    }

    trabajadoresPorEstado(estado) {
        const url = urlTotal + this.trabajadoresEstado + estado;
        return url;
    }

    crearNuevoTrabajador() {
        const url = urlTotal + this.nuevoTrabajador;
        return url;
    }

    actualizarTrabajadorPorID() {
        const url = urlTotal + this.actualizarTrabajador;
        return url;
    }

    eliminarTrabajadorPorID() {
        const url = urlTotal + this.eliminarTrabajador;
        return url;
    }
}

export class Usuarios {
    listaUsuarios = "/ListaUsuarios";
    listaDatosUsuarios = "/ListaDatosUsuarios";
    login = "/Usuario";
    usuarioID = "/UsuarioID?id=";
    usuariosTrabajador = "/UsuariosTrabajadorID?id=";
    nuevoUsuario = "/NuevoUsuario";
    actualizarUsuario = "/ActualizarUsuario";
    eliminarUsuario = "/EliminarUsuario";
    validacionToken = "/Validacion"

    listarUsuarios() {
        const url = urlTotal + this.listaUsuarios;
        return url;
    }

    validarToken(token, rol) {
        const url = urlTotal + this.validacionToken + "?token=" + token + "&rol=" + rol;
        return url;
    }

    listarDatosUsuarios() {
        const url = urlTotal + this.listaDatosUsuarios;
        return url;
    }

    logeo(nombre, clave) {
        const url = urlTotal + this.login + "?nombre=" + nombre + "&clave=" + clave;
        return url;
    }

    usuarioPorID(id) {
        const url = urlTotal + this.usuarioID + id;
        return url;
    }

    usuariosPorIDTrabajador(id) {
        const url = urlTotal + this.usuariosTrabajador + id;
        return url; 
    }

    crearNuevoUsuario() {
        const url = urlTotal + this.nuevoUsuario;
        return url;
    }

    actualizarUsuarioPorID() {
        const url = urlTotal + this.actualizarUsuario;
        return url;
    }

    eliminarUsuarioPorID() {
        const url = urlTotal + this.eliminarUsuario;
        return url;
    }
}

export class Turnos {
    listaTurnos = "/ListaTurnos";
    turnoID = "/TurnoID?id=";
    turnosIDSucursal = "/TurnosIDSucursal?id=";
    turnosSucursalEstado = "/TurnosSucursalEstado";
    turnosSucursalEstadoDia = "/TurnosSucursalEstadoDia";
    nuevoTurno = "/NuevoTurno";
    actualizarTurno = "/ActualizarTurno";
    actualizarEstadoTurno = "/ActualizarEstadoTurno";

    listarTurnos() {
        const url = urlTotal + this.listaTurnos;
        return url;
    }

    turnoPorID(id) {
        const url = urlTotal + this.turnoID + id;
        return url;
    }

    turnosPorIDSucursal(id) {
        const url = urlTotal + this.turnosIDSucursal + id;
        return url;
    }

    turnosPorSucursalEstado(id, estado) {
        const url =  urlTotal+ this.turnosSucursalEstado + "?id=" + id + "&estado=" + estado;
        return url;
    }

    turnosPorSucursalEstadoDia(id, estado, fecha) {
        const url =  urlTotal+ this.turnosSucursalEstadoDia + "?id=" + id + "&estado=" + estado + "&fecha=" + fecha;
        return url;
    }

    crearNuevoTurno() {
        const url = urlTotal + this.nuevoTurno;
        return url; 
    }

    actualizarTurnoPorID() {
        const url = urlTotal + this.actualizarTurno;
        return url; 
    }

    actualizarEstadoTurnoPorID() {
        const url = urlTotal + this.actualizarEstadoTurno;
        return url;
    }
}

export class Atenciones {
    listaAtenciones = "/ListaAtenciones";
    listaDatosAtenciones = "/ListaDatosAtenciones";
    atencionIDTurno = "/AtencionIDTurno?id=";
    atencionesEstado = "/AtencionesEstado?estado=";
    nuevaAtencionPOST = "/NuevaAtencion";
    actualizarAtencion = "/ActualizarAtencion";
    eliminarAtencion = "/EliminarAtencion";

    listarAtenciones() {
        const url = urlTotal + this.listaAtenciones;
        return url;
    }

    listarDatosAtenciones() {
        const url = urlTotal + this.listaDatosAtenciones;
        return url;
    }

    atencionPorIDTurno(id) {
        const url = urlTotal + this.atencionIDTurno + id;
        return url;
    }

    atencionesPorEstado(estado) {
        const url = urlTotal + this.atencionesEstado + estado;
        return url;
    }

    crearNuevaAtencionPOST() {
        const url = urlTotal + this.nuevaAtencionPOST;
        return url;
    }

    actualizarAtencionPorID() {
        const url = urlTotal + this.actualizarAtencion;
        return url; 
    }

    eliminarAtencionPorID() {
        const url = urlTotal + this.eliminarAtencion;
        return url;
    }
}

export class Calificaciones {
    listaCalificaciones = "/ListaCalificaciones";
    calificacionID = "/CalificacionIDAtencion?id=";
    nuevaCalificacion = "/NuevaCalificacion";
    actualizarCalificacion = "/ActualizarCalificacion";
    eliminarCalificacion = "/EliminarCalificacion";

    listarCalificaciones() {
        const url = urlTotal + this.listaCalificaciones;
        return url;
    }

    calificacionPorID(id) {
        const url = urlTotal + this.calificacionID + id;
        return url;
    }

    crearNuevaCalificacion() {
        const url = urlTotal + this.nuevaCalificacion;
        return url;
    }

    actualizarCalificacionPorID() {
        const url = urlTotal + this.actualizarCalificacion;
        return url;
    }

    eliminarCalificacionPorID() {
        const url = urlTotal + this.eliminarCalificacion;
        return url;
    }
}

export class Contadores {
    listaContadores = "/ListaContadores";
    contador = "/Contador";
    nuevoContador = "/NuevoContador";
    actualizarContador = "/ActualizarContador";

    listarContadores() {
        const url = urlTotal + this.listaContadores;
        return url;
    }

    contadorPorID(id_Sucursal, id_Consulta) {
        const url = urlTotal + this.contador + "?id_Sucursal=" + id_Sucursal + "&id_Consulta=" + id_Consulta;
        return url; 
    }

    crearContador() {
        const url = urlTotal + this.nuevoContador;
        return url; 
    }

    actualizarContadorNumero() {
        const url = urlTotal + this.actualizarContador;
        return url; 
    }
}