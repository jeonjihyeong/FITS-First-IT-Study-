const { server_warning, connection_error, logic_error } = require('../../lib/common/error');
const {userService} = require('../../service')

const change=async(req,res)=>{
    try{
        const userIdx = req.decode.userIdx
        const newData = req.body
        await userRepo.chagneUserData(userIdx, newData);
        res.send({data:"success"})
    }catch(err){
        console.log(err);
    }
}

const logout=async(req,res,next)=>{
    const {id} = req.decode
    if(!id)return next({message:server_warning.INVALID_REQUEST_WARN})
    let isLogOutSuccess;
    try{
        isLogOutSuccess = await userService.logout(id)
    }catch(err){
        if(err.message)return next(err)
        next({message:connection_error.CONTROLLER_LOGOUT_ERROR})
    }
    if(isLogOutSuccess===0){
        return res.send({data:'already Logout'})
    }
    res.send({data:'success'})
}

module.exports={
    change,
    logout
}