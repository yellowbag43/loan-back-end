var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            { url: /\/loan-api\/v1\/ledger(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']},//working
            { url: /\/loan-api\/v1\/account(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']},//working
            { url: /\/loan-api\/v1\/user(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']},//working
            { url: /\/loan-api\/v1\/password(.*)/, methods: ['GET', 'POST', 'DELETE', 'OPTIONS']},//working
            { url: /\/loan-api\/v1\/loan(.*)/, methods: ['GET', 'POST', 'DELETE', 'OPTIONS']},//working
 //           { url: `${api}/user`, methods: ['GET']},//working
   //         { url: `${api}/user/add`, methods: ['POST']},//working
     //       { url: `${api}/user/login`, methods: ['POST']},//working
        ]                                                               //regex101.com
    })
}

module.exports = authJwt;
