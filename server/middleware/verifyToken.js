import jwt from 'jsonwebtoken';

export const verifyToken = async(req,res,next) => {
    try{
        let token = req.header("Authorization");
        if(!token){
            return res.status(403).send("Please Login");
        }

        if (token.startsWith("Frink ")){
            token = token.slice(6, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.SECRET);
        const expires = verified.expires;
        const currentDate = new Date(Date.now());
        if(!expires){
            return res.status(403).send("Please Login");
        } else if(expires<currentDate){
            return res.status(403).send("Please login");
            
        } else{
            req.user = verified.user;
        }
        next();
    } catch(err){
        res.status(500).json("Internal Server Error");
    }
};