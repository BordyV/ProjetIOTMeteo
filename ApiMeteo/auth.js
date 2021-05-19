const jwt = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('x-auth-token');
    try {
        ///
        if(!token) {
            res.status(401).json({ message : "Connexion impossible, token manquant", code: res.statusCode  });
        }else{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
            next();
        }
        ///
        // next();
        ///
    } catch (e) {
        res.status(400).json({error : 'Token invalide', code: res.statusCode});
    }
}

module.exports = auth;