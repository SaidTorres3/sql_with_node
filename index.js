const mariadb = require('mariadb');
const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaBody = require('koa-bodyparser')
const Fs = require('fs');
const { kill } = require('process');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    connectionLimit: 5,
    metaAsArray: false,
});


(async () => {

    const server = new Koa()
    const router = new KoaRouter()


    // router.use('/clientes', async (ctx, next) => {
    //     if (ctx.headers.get('Authentication') === 'clavesecreta') {
    //         await next()
    //     } else {
    //         ctx.status = 401
    //     }
    // })

    router.get('/clientes', async ctx => {
        const conn = await pool.getConnection()
        await conn.query('USE del')
        ctx.body = await conn.query('SELECT * FROM cliente;')
        await conn.end()
    })

    // router.post('/clientes', async ctx => {

    //     const data = ctx.request.body;

    //     const conn = await pool.getConnection()
    //     await conn.query('USE del')
    //     await conn.query(`
    //     INSERT INTO cliente (nombre)
    //     VALUES (?);
    //     `, [data.nombre])
    //     ctx.body = await conn.query('SELECT * FROM cliente;')
    //     await conn.end()
    // })

    router.get('/clientes/:id', async ctx => {
        const conn = await pool.getConnection()
        await conn.query('USE del')
        const rows = await conn.query('SELECT * FROM cliente WHERE id = ?;', [ctx.params.id])
        ctx.body = rows[0]
        await conn.end()
    })

    router.get('/crearCliente/:nombre', async ctx => {
        ctx.body = ctx.params.nombre;
        const nombre = ctx.params.nombre
        const conn = await pool.getConnection()
        await conn.query('USE del')
        await conn.query(`
        INSERT INTO cliente (nombre)
        VALUES (?);
        `, [nombre])
        ctx.body = await conn.query('SELECT * FROM cliente;')
        await conn.end()
    })

    router.get('/home', ctx => {
        ctx.body = 'Welcome home!'
    })

    router.get('/', async ctx => {
        ctx.type = "html"
        ctx.body = Fs.createReadStream("page.html")
        // ctx.body = Fs.readFileSync("page.html")
        // ctx.body = await Fs.promises.readFile('page.html')
    })

    server.use(KoaBody())

    server.use(router.routes())

    server.listen(8080, () => {
        console.log('Server running on http://localhost:8080')
    })

})()


// const response = await fetch('http://localhost:8080/clientes', {
//     method: 'POST',
//     body: { nombre: 'Juanita' },
//     headers: {
//         Authentication: 'clavesecreta'
//     }
// })
// if (response.ok) {
//     alert('Si jaló!')
// }
