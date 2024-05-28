const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const redis = require("redis")


const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");


const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const accountRoutes = require('./routes/accountRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const otherRoutes = require('./routes/otherRoutes')
const emailRoutes = require('./routes/emailRoutes')

const app = express()
const PORT = process.env.PORT ||  3000

app.use('/uploads', express.static('uploads'));

let date = new Date()
const filepath = path.join(__dirname, "logs", `${date.toISOString().split('T')[0]}.log`);
var accessLogStream = fs.createWriteStream(filepath, { flags: 'a' })


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());




app.use(morgan(function (tokens, req, res) {
    return [
        "=============",
        `${new Date().toISOString()}`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      "\n\n\n"
    ].join(' ')
  }, { stream: accessLogStream }))

  

app.use('/product', productRoutes)
app.use('/category', categoryRoutes)
app.use('/cart', cartRoutes)
app.use('/order', orderRoutes)

app.use("/email", emailRoutes)

app.use('/', accountRoutes)
app.use('/', otherRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/test", (req, res) =>{
  res.json("test ok")
})

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
