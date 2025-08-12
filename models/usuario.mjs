import {input} from "../utils.mjs"
import {Post} from "./post.mjs"

export class Usuario{
  static contadorId = 1

  constructor({id, nombre, apellido, email, dni}){
    this.id = id? parseInt(id) : Usuario.contadorId++
    this.nombre = nombre
    this.apellido = apellido
    this.email = email
    this.dni = dni
    this.posts = []
  }

  agregarPost(post){
    this.posts.push(post)
  }

  eliminarPost(postId){
    this.posts = this.posts.filter(post => post.id !== postId)
  }

  getNombreCompleto(){
    return `${this.nombre} ${this.apellido}`
  }

  async crearPost(todosPosts){
    const titulo = await input("Ingrese titulo -->")
    const contenido = await input("Ingese el contenido textual -->")
    const nuevoPost = new Post({titulo,contenido,usuario:this})
    todosPosts.push(nuevoPost)
    this.agregarPost(nuevoPost)
    console.log("Post creado exitosamente")
    await input("Presione enter...")
  }

  listarPosts(todosPosts){
    console.log("--> Listado de posts <--")

    if(todosPosts.length === 0){
      console.log("No hay posts en el archivo")
      return
    }

    todosPosts.forEach(post => {
      console.log(post.mostrarSinContenido())
    })
  }

  async verPost(todosPosts){
    const id = parseInt(await input("Ingrese el id del post a ver -->"))
    const post = todosPosts.find(post => post.id === id)

    if(!post){
      console.log("--> Post no encontrado <--")
      return
    }
    console.log(post.mostrarPost())
  }

  async eliminarPost(todosPosts){
    const id = parsInt(await input("Ingese id del post a eliminar -->"))
    const post = todosPosts.find(post => post.id === id)

    if(!post){
      console.log("--> No se ha encontado el post <--")
      return
    }
    
    if(post.usuario.id !== this.id){
      console.log("El post con id ingresada no le pertenece a este usuario")
      return
    }

    const indice = todosPosts.findIndex(post => post.id === id)
    if(indice !== -1){
      todosPosts.splice(indice,1)
    }

    this.eliminarPost(id)
    console.log("Post eliminado con exito")
    await input("Presione enter...")
  }
}