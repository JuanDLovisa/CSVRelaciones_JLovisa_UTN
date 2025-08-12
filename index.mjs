import { input, leerCSV, escribirCSV } from './utils.mjs';
import { Usuario } from './models/usuario.mjs';
import { Post } from './models/post.mjs';

const RUTA_USUARIOS = './usuarios.csv';
const RUTA_POSTS = './posts.csv';

let usuarios = [];
let posts = [];
let usuarioActual = null;

async function cargarDatos() {
    const usuariosActuales = await leerCSV(RUTA_USUARIOS);
    usuarios = usuariosActuales.map(u => new Usuario(u));
    Usuario.contadorId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const postsActuales = await leerCSV(RUTA_POSTS);
    posts = postsActuales.map(p => {
        const usuario = usuarios.find(u => u.id === parseInt(p.usuario_id));
        return new Post({ ...p, usuario });
    });
    Post.contadorId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    posts.forEach(p => p.usuario?.agregarPost(p));
}

async function guardarDatos() {
    await escribirCSV(RUTA_USUARIOS, usuarios, ['id', 'nombre', 'apellido', 'email', 'dni']);
    await escribirCSV(RUTA_POSTS, posts, ['id', 'usuario_id', 'titulo', 'contenido']);
}

async function iniciarSesion() {
    const nombre = await input('Nombre: ');
    const apellido = await input('Apellido: ');
    const email = await input('Email: ');
    const dni = await input('DNI: ');

    let usuario = usuarios.find(u => u.email === email && u.dni === dni);
    if (!usuario) {
        usuario = new Usuario({ nombre, apellido, email, dni });
        usuarios.push(usuario);
        console.log(`Usuario registrado como ${usuario.getNombreCompleto()}`);
    } else {
        console.log(`Bienvenido ${usuario.getNombreCompleto()}`);
    }

    usuarioActual = usuario;
    await menuUsuario();
}

async function menuUsuario() {
    let opcion;
    do {
        console.log(`\n=== MENÚ USUARIO (${usuarioActual.getNombreCompleto()}) ===`);
        console.log('1. Crear post');
        console.log('2. Ver todos los posts');
        console.log('3. Ver un post');
        console.log('4. Eliminar un post');
        console.log('5. Cerrar sesión');
        opcion = await input('Opción: ');

        switch (opcion) {
            case '1': await usuarioActual.crearPost(posts); await guardarDatos(); break;
            case '2': usuarioActual.listarPosts(posts); break;
            case '3': await usuarioActual.verPost(posts); break;
            case '4': await usuarioActual.eliminarPost(posts); await guardarDatos(); break;
            case '5': usuarioActual = null; break;
            default: console.log('Opción inválida.');
        }
    } while (opcion !== '5');
}

async function menuPrincipal() {
    await cargarDatos();

    let opcion;
    do {
        console.log('\n=== MENÚ PRINCIPAL ===');
        console.log('1. Iniciar sesión');
        console.log('2. Salir');
        opcion = await input('Opción: ');

        switch (opcion) {
            case '1': await iniciarSesion(); break;
            case '2': await input('Saliendo, presione enter...'); break;
            default: console.log('Opción inválida.');
        }
    } while (opcion !== '2');

    await guardarDatos();
}

menuPrincipal();