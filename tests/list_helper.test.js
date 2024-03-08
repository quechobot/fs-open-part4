const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

test('of empty list is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
})

test('when list has only one blog equals the likes of that', () => {
    const blogs = [
        {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
            likes: 5,
            id: "65eb6f73e8468fccd23a47ba"
        }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(5)
})

test('of a bigger list is calculated right', () => {
    const blogs = [
        {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
            likes: 5,
            id: "65eb6f73e8468fccd23a47ba"
        },
        {
            title: "Percepciones sobre la Enseñanza de la Facultad en Ciencias de la Computación",
            author: "Cerón Garnica María del Carmen, Martínez Torres Rodolfo Alberto",
            url: "https://www.repo-ciie.dfie.ipn.mx/pdf/1086.pdf",
            likes: 1,
            id: "65eb7188e8468fccd23a47bd"
        },
        {
            title: "Diseño de prototipo de direccionamiento de robot tipo Ackerman aplicado a la desinfección de COVID.",
            author: "José Luis Hernández Ameca",
            url: "https://www.revistatecnologiadigital.com/pdf/11_02_005_diseno_prototipo_direccionamiento_robot_tipo_ackerman_aplicado_desinfeccion_COVID.pdf",
            likes: 2,
            id: "65eb742be8468fccd23a47bf"
        },
        {
            title: "¿Qué hace al buen maestro?: La visión del estudiante de ciencias físico matemáticas",
            author: "Adrián Corona Cruz",
            url: "https://dialnet.unirioja.es/descarga/articulo/2735591.pdf",
            likes: 3,
            id: "65eb7506e8468fccd23a47c1"
        }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(11)
})