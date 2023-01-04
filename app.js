console.log("LoanAPI back-end");

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const api = process.env.API_URL;

process.on('uncaughtException', (error,origin) => {
    console.log("----Uncaught exception---------")
    console.log(error)
    console.log("----Exception Origin-----------")
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log("----unhandled Rejection ---------")
    console.log(promise)
    console.log("----reason-----------")
    console.log(reason)
})

const userRouter = require('./routers/user')
const loanRouter = require('./routers/loanqueue')
const accountRouter = require('./routers/accounts')
const ledgerRouter = require('./routers/ledger')

const app = express();
const errorhandler = require('./helpers/error-handler')
const authJwt = require('./helpers/jwt')

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorhandler);

app.use(`${api}/user`, userRouter)
app.use(`${api}/loan`, loanRouter)
app.use(`${api}/account`, accountRouter)
app.use(`${api}/ledger`, ledgerRouter)

app.get('/', (req, res)  => {
    res.send("hello there!");
})

mongoose.connect(process.env.DATABASE, { dbName: "loan-database"})
.then(
    () => { console.log("Database Connection Ready!") })
.catch((err)=> {
    console.log(err)
  })

const PORT = process.env.PORT || 3002;

app.listen(PORT, (err)=> {
    console.log("server started....! @port-> "+PORT);
}).err

