function errorHandler(err, req, res, next) {
    if ( err.name === 'UnauthorizedError' ) {
       return res.status(401).json( { message: "The user is not authorized without valid token"})
    }
        
    console.log("Error: "+err);
    return res.status(500).json( { message: err})
}

module.exports = errorHandler;;
   