const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
    {
        title: "Percepciones sobre la Enseñanza de la Facultad en Ciencias de la Computación",
        author: "Cerón Garnica María del Carmen, Martínez Torres Rodolfo Alberto",
        url: "https://www.repo-ciie.dfie.ipn.mx/pdf/1086.pdf",
        likes: 2
    },
    {
        title: "Diseño de prototipo de direccionamiento de robot tipo Ackerman aplicado a la desinfección de COVID.",
        author: "José Luis Hernández Ameca",
        url: "https://www.revistatecnologiadigital.com/pdf/11_02_005_diseno_prototipo_direccionamiento_robot_tipo_ackerman_aplicado_desinfeccion_COVID.pdf",
        likes: 3
    },
    {
        title: "¿Qué hace al buen maestro?: La visión del estudiante de ciencias físico matemáticas",
        author: "Adrián Corona Cruz",
        url: "https://dialnet.unirioja.es/descarga/articulo/2735591.pdf",
        likes: 4
    },
]

const initialUsers = [
    {
        username: "quechobot",
        name: "Cristopher",
        password: "lokijuhy"
    },
    {
        username: "molote",
        name: "Alberto",
        password: "senior"
    }
]
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, initialUsers, blogsInDb, usersInDb
}