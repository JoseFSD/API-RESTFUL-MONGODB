/*
    Archivo para explicar las relaciones en MongoDB
*/

// tenemos los siguientes usuarios creados
let usuario1 = {
    id: 'U0001',
    nombre: 'José',
    email: 'jose@email.com'
}
let usuario2 = {
    id: 'U0002',
    nombre: 'Juan',
    email: 'juan@email.com'
}
let usuario3 = {
    id: 'U0003',
    nombre: 'Rebeca',
    email: 'rebeca@email.com'
}

// 1) relaciones por referencias
let curso = {
    id: 'C0001',
    id_alumnos: ['U0001, U0002, U0003'],
    titulo: 'Javascript ES6',
    descripcion: 'Curso de JS con la sintaxis moderna'
}

// 2) relaciones por documentos embebidos ó subdocumentos (desnormalización)
let curso = {
    id: 'C0001',
    autor: {
        nombre: 'Carlos Pérez',
        email: 'carlos@email.com'
    },
    id_alumnos: [
        { id: 'U0001', nombre: 'Jose', email: 'jose@email.com' },
        { id: 'U0002', nombre: 'Juan', email: 'juan@email.com' },
        { id: 'U0003', nombre: 'Rebeca', email: 'rebeca@email.com' }
    ],
    titulo: 'Javascript ES6',
    descripcion: 'Curso de JS con la sintaxis moderna'
}

/*
    ¿Cuándo podemos usar un tipo de relación u otro?

    1) Referencias --> mayor consistencia
    
        Cuando modifique un dato en el usuario, mi consistencia de datos se mantiene

    2) Documentos embebidos --> mejor performance

        En un mismo documento tenemos toda la información, al traerme un Curso tengo todos los datos que necesito, es decir,
    no tengo que hacer otra consulta para traerme los datos de los usuarios, ya que están embebidos dentro de Curso.

        En este caso, si por ejemplo queremos cambiar el email del autor y este autor aparece en otros cursos, ahí encontramos 
    el problema, tendríamos que cambiar uno por uno todos los documentos donde aparezca ese autor para poder modificar 
    su email.
*/