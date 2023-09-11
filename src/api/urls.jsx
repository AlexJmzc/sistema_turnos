export const baseURL = "http://localhost:3014/";

export const baseServicio = "ServiciosTurnos.svc/";

export const urlUsuarios = {
    login: baseURL + baseServicio + "Usuario"
}

export const urlSucursales = {
    obtenerTodasLasSucursales: baseURL + baseServicio + "ListaSucursales",
    obtenerSucursal: baseURL + baseServicio + "Sucursal?id=",
}