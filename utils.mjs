import {readFile, writeFile, access} from "fs/promises"
import {constants} from "fs"
import readline from 'readline';

export function input(texto) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(texto, res => {
            resolve(res);
            rl.close();
        });
    });
}

export async function existeArchivo(ruta){
    try{
        await access(ruta, constants.F_OK)
        return true
    }
    catch{
        return false
    }
}

export async function leerCSV(ruta){
    if(!(await existeArchivo(ruta))) return [];

    const contenido = await readFile(ruta, "utf-8")
    const lineas = contenido.trim().split("\n")
    const [encabezado, ...filas] = lineas

    return filas.map(linea => {
        const columnas = encabezado.split(";")
        const valores = linea.split(";")
        const objeto = {}

        columnas.forEach((columna, indice) => {
            objeto[columna] = valores[indice]
        })
        return objeto;
    })
}

export async function escribirCSV(ruta, datos, encabezado){
    const filas = [encabezado.join(";")]

    datos.forEach(dato => {
        const linea = encabezado.map(columna => dato[columna])
        filas.push(linea.join(";"))
    })
    await writeFile(ruta, filas.join("\n"), "utf-8")
}