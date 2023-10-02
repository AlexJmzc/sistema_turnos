const baseURL = "http://localhost:3014/";

const baseServicio = "ServiciosTurnos.svc";

const urlTotal = baseURL + baseServicio;

export class Estados {
    listaEstados = "/ListaEstados";
    estadoID = "/Estado?id=";
    estadoNombre = "/EstadoNombre?nombre=";
    nuevoEstado = "/EstadoNombre?nombre=";
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

    crearNuevoEstado(nombre) {
        const url = urlTotal + this.nuevoEstado + nombre;
        return url;
    }

    actualizarEstadoPorID(id, nombre) {
        const url = urlTotal + this.actualizarEstado + "?id_Estado=" + id + "&nombre=" + nombre;
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

    crearNuevoRol(nombre, estado) {
        const url = urlTotal + "?nombre=" + nombre + "&estado=" + estado;
        return url;
    }
    actualizarRolPorID(id, nombre, estado) {
        const url = urlTotal + "?id_Rol=" + id + "&nombre=" + nombre + "&estado=" + estado;
        return url;
    }

    eliminarRolPorID(id, estado) {
        const url = urlTotal + "?id_Rol=" + id + "&estado=" + estado;
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

    crearNuevoTipoConsulta(nombre, estado) {
        const url = urlTotal + this.nuevoTipoConsulta + "?nombre=" + nombre + "&estado=" + estado;
        return url;
    }

    actualizarTipoConsultaPorID(id, nombre, estado) {
        const url = urlTotal+ this.actualizarTipoConsulta + "?id_Tipo_Consulta=" + id + "&nombre=" + nombre + "&estado=" + estado;
        return url;
    }

    eliminarTipoConsultaPorID(id, estado) {
        const url = urlTotal + this.eliminarTipoConsulta + "?id_Tipo_Consulta=" + id + "&estado=" + estado;
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

    crearNuevaSucursal(nombre, numero, estado) {
        const url = urlTotal + this.nuevaSucursal + "?nombre=" + nombre + "&numero=" + numero + "&estado=" + estado;
        return url;
    }

    actualizarSucursalPorID(id, nombre, numero, estado) {
        const url = urlTotal + this.actualizarSucursal + "?id_Sucursal=" + id + "&nombre=" + nombre + "&numero=" + numero + "&estado=" + estado;
        return url;
    }

    eliminarSucursalPorID(id, estado) {
        const url = urlTotal + this.eliminarSucursal + "?id_Sucursal=" + id + "&estado=" + estado;
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

    crearNuevoTrabajador(cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha, estado) {
        const url = urlTotal + this.nuevoTrabajador + "?cedula=" + cedula + "&primer_nombre=" + primer_nombre + "&segundo_nombre=" + segundo_nombre + "&primer_apellido=" + primer_apellido + "&segundo_apellido=" + segundo_apellido + "&fecha_nacimiento=" + fecha + "&estado=" + estado;
        return url;
    }

    actualizarTrabajadorPorID(id, cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha, estado) {
        const url = urlTotal + this.actualizarTrabajador + "?id_Trabajador" + id + "&cedula=" + cedula + "&primer_nombre=" + primer_nombre + "&segundo_nombre=" + segundo_nombre + "&primer_apellido=" + primer_apellido + "&segundo_apellido=" + segundo_apellido + "&fecha_nacimiento=" + fecha + "&estado=" + estado;
        return url;
    }

    eliminarTrabajadorPorID(id, estado) {
        const url = urlTotal + this.eliminarTrabajador + "?id_Trabajador=" + id + "&estado=" + estado;
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

    listarUsuarios() {
        const url = urlTotal + this.listaUsuarios;
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

    crearNuevoUsuario(nombre, clave, id_Trabajador, id_Rol, estado) {
        const url = urlTotal + this.nuevoUsuario + "?nombre=" + nombre + "&clave=" + clave + "&id_Trabajador=" + id_Trabajador + "&id_Rol=" + id_Rol + "&estado=" + estado;
        return url;
    }

    actualizarUsuarioPorID(id, nombre, clave, id_Trabajador, id_Rol, estado) {
        const url = urlTotal + this.nuevoUsuario + "?id_Usuario=" + id + "&nombre=" + nombre + "&clave=" + clave + "&id_Trabajador=" + id_Trabajador + "&id_Rol=" + id_Rol + "&estado=" + estado;
        return url;
    }

    eliminarUsuarioPorID(id, estado) {
        const url = urlTotal + this.eliminarUsuario + "?id_Usuario=" + id + "&estado=" + estado;
        return url;
    }
}

export class Turnos {
    listaTurnos = "/ListaTurnos";
    turnoID = "/TurnoID?id=";
    turnosIDSucursal = "/TurnosIDSucursal?id=";
    turnosSucursalEstado = "/TurnosSucursalEstado";
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

    crearNuevoTurno(id_Tipo_Consulta, id_Sucursal, fecha, numero_Turno, estado) {
        const url = urlTotal + this.nuevoTurno + "?id_Tipo_Consulta=" + id_Tipo_Consulta + "&id_Sucursal=" + id_Sucursal + "&fecha=" + fecha + "&numero_turno=" + numero_Turno + "&estado=" +  estado;
        return url; 
    }

    actualizarTurnoPorID(id_Tipo_Consulta, id_Sucursal, fecha, numero_Turno, estado) {
        const url = urlTotal + this.nuevoTurno + "?id_Tipo_Consulta=" + id_Tipo_Consulta + "&id_Sucursal=" + id_Sucursal + "&fecha=" + fecha + "&numero_turno=" + numero_Turno + "&estado=" +  estado;
        return url; 
    }

    actualizarEstadoTurnoPorID(id, estado) {
        const url = urlTotal + this.actualizarEstadoTurno + "?id_Turno=" + id + "&estado=" + estado;
        return url;
    }
}

export class Atenciones {
    listaAtenciones = "/ListaAtenciones";
    listaDatosAtenciones = "/ListaDatosAtenciones";
    atencionIDTurno = "/AtencionIDTurno?id=";
    atencionesEstado = "/AtencionesEstado?estado=";
    nuevaAtencionPOST = "/NuevaAtencion/nueva";
    nuevaAtencionGET = "/NuevaAtencion";
    actualizarAtencion = "/ActualizarAtencion";
    eliminarAtencion = "/EliminaAtencion";

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

    crearNuevaAtencionGET(id_Turno, id_Usuario, ventanilla, estado, fecha_Inicio, fecha_Final, observacion) {
        const url = urlTotal + this.nuevaAtencionGET + "?id_Turno=" + id_Turno + "&id_Usuario=" + id_Usuario + "&ventanilla=" + ventanilla + "&estado=" + estado + "&fecha_Inicio=" + fecha_Inicio + "&fecha_Final=" + fecha_Final + "&observacion=" + observacion;
        return url; 
    }

    actualizarAtencionPorID(id_Atencion, id_Turno, id_Usuario,  ventanilla, estado, fecha_Inicio, fecha_Final, observacion) {
        const url = urlTotal + this.actualizarAtencion + "?id_Atencion=" + id_Atencion + "&id_Turno=" + id_Turno + "&id_Usuario=" + id_Usuario + "&ventanilla=" + ventanilla + "&estado=" + estado + "&fecha_Inicio=" + fecha_Inicio + "&fecha_Final=" + fecha_Final + "&observacion=" + observacion;
        return url; 
    }

    eliminarAtencionPorID(id_Turno) {
        const url = urlTotal + "?id_Turno=" + id_Turno;
        return url;
    }
}

export class Calificaciones {
    listaCalificaciones = "/ListaCalificaciones";
    calificacionID = "/CalificacionIDAtencion?id=";
    nuevaCalificacion = "/NuevaCalificacion";
    actualizarCalificacion = "/ActualizarCalificacion";

    listarCalificaciones() {
        const url = urlTotal + this.listaCalificaciones;
        return url;
    }

    calificacionPorID(id) {
        const url = urlTotal + this.calificacionID + id;
        return url;
    }

    crearNuevaCalificacion(id_Atencion, pregunta_1, pregunta_2, pregunta_3, valoracion) {
        const url = urlTotal + this.nuevaCalificacion + "?id_Atencion=" + id_Atencion + "&pregunta_1=" + pregunta_1 + "&pregunta_2=" + pregunta_2 + "&pregunta_3=" + pregunta_3 + "&valoracion=" + valoracion;
        return url;
    }

    actualizarCalificacionPorID(id_Atencion, pregunta_1, pregunta_2, pregunta_3, valoracion) {
        const url = urlTotal + this.actualizarCalificacion + "?id_Atencion=" + id_Atencion + "&pregunta_1=" + pregunta_1 + "&pregunta_2=" + pregunta_2 + "&pregunta_3=" + pregunta_3 + "&valoracion=" + valoracion;
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

    crearContador(id_Sucursal, id_Consulta) {
        const url = urlTotal + this.nuevoContador + "?id_Sucursal=" + id_Sucursal + "&id_Tipo_Consulta=" + id_Consulta + "&numero=1";
        return url; 
    }

    actualizarContadorNumero(id_Sucursal, id_Consulta, numero) {
        const url = urlTotal + this.actualizarContador + "?id_Sucursal=" + id_Sucursal + "&id_Tipo_Consulta=" + id_Consulta + "&numero=" + numero;
        return url; 
    }
}