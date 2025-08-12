export class Post{
  static contadorId = 1

  constructor({id, usuario_id, titulo, contenido, usuario}){
    this.id = id ? parseInt(id) : Post.contadorId++
    this.usuario_id = usuario_id ? parseInt(usuario_id) : usuario?.id
    this.titulo = titulo
    this.contenido = contenido
    this. usuario = usuario
  }

  mostrarSinContenido(){
    return `ID: ${this.id} | Titulo: ${this.titulo} | Autor: ${this.usuario.getNombreCompleto()}`
  }

  mostrarPost(){
    return `\n --> Post ${this.id} \n--->Titulo: ${this.titulo} \n --->Autor: ${this.usuario.getNombreCompleto()}\n ---> Contenido: ${this.contenido}`
  }
}