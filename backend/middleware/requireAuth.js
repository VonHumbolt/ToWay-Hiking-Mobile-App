const jwt = require("jsonwebtoken")

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization)
        return res.status(401).json({error: "Authorization token required!"})

    const token = authorization.split(" ")[1]

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        next()
    }catch(error) {
        console.log(error);
        res.status(401).json({ error: "Request is not authorized!" });
    }
}

module.exports = requireAuth