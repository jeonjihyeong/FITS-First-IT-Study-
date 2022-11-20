const { promisify } = require('util');
const redisClient = require('./redis.util');
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.JWT_KEY; 

module.exports={
    //  토큰생성
    signToken : async(payload) => {
        try{
            return jwt.sign(payload, SECRET_KEY,{
            algorithm: 'HS256',
            expiresIn: '5h',
            })
        }catch(err){
            consonle.log(err)
        }
    },

    // 토큰해석
    decodeToken :(anyToken)=>{
        try{
            return jwt.decode(anyToken, SECRET_KEY)
        } catch(err){
            if (err.name==='TokenExpiredError')throw new Error("EXPIRED_TOKEN");
            throw new Error("INVALID_TOKEN")
        }
    },

    // 토큰 검증
    verifyToken : (anyToken)=>{
        try {
            jwt.verify(anyToken, SECRET_KEY);
            return true;
        }catch(err){
            if (err.name==='TokenExpiredError')throw new Error("EXPIRED_TOKEN");
            throw new Error("INVALID_TOKEN")
        }
    },

    // 리프레쉬 토큰
    refreshToken:()=>{
        return jwt.sign({},SECRET_KEY,{
            algorithm:'HS256',
            expirseIn: '14d',
        });
    },

    // 리프레쉬 토큰 검증
    refreshVerify: async (token, email) => {
        const getAsync = promisify(redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(email); // refresh token 가져오기
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    },
}

