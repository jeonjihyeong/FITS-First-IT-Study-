import { Injectable } from '@nestjs/common';
import { LoginInputDto } from './dto/input/login-input.dto';
import { SignUpInputDto } from './dto/input/signUp-input.dto';
import { signUpUser } from './entities/sigup.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repositoy';
@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository){}
  
  async login(temp:LoginInputDto){
    const {id,pw}=temp;

    let loginUser:User;

    try{
      loginUser = await this.userRepo.findUserById(id);
    }catch(err){
      console.log(err);
    }

    if(loginUser===undefined) return {message:'wrong Id'}
    if(pw!==loginUser.pw) return {message:'wrong Pw'}
    console.log(loginUser)
    return {message:'Sucess'};
  }

  async signUp(temp:SignUpInputDto){
    const {id,pw,email,nickname,name,age}=temp;
    
    let isDuplicate:boolean;
    
    
    try{
      // console.log(await this.userRepo.findUserById(id))
      await this.userRepo.findUserById(id)===undefined?isDuplicate=false:isDuplicate=true;
    }catch(err){
      console.log(err);
      throw new Error("FIND_USER_BY_ID_ERROR")
    }
    
    console.log(isDuplicate)
    
    if(isDuplicate){
      return {message:"id is duplicated"}
    }
    
    let signUpUser:signUpUser
    signUpUser={
      id,
      pw,
      age,
      name,
      email,
      nickname
    }

    try{
      await this.userRepo.saveUser(signUpUser);
    }catch(err){
      console.log(err);
      throw new Error("SAVE_USER_ERROR")
    }

    return {message:"success"}
  }
}
