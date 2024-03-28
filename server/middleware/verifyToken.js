import jwt from 'jsonwebtoken';

export const verifyToken = async(req,res,next) => {
    try{
        let token = req.header("Authorization");
        console.log(token);
        if(!token){
            return res.status(403).send("Please Login");
        }

        if (token.startsWith("Frink ")){
            token = token.slice(6, token.length).trimLeft();
            console.log(token);
            if(!token){
                return res.status(403).send("Please Login");
            }
        }
        const verified = jwt.verify(token, process.env.SECRET);
        const expires = verified.expires;
        const currentDate = new Date(Date.now());
        if(!expires){
            return res.status(403).send("Please Login");
        } else{
            const expiresDate = new Date(expires);
            console.log(expiresDate);
            if(expiresDate<currentDate){
                return res.status(403).send("Please login");   
            } else{
                req.user = verified.user;
            }
        }  
        next();
    } catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
};