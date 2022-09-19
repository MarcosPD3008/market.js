import BaseController from "../base/base.controller";
import UserService from "../../services/users/user.service";
import { User } from "../../models/user.model";
import { container, injectable } from "tsyringe";
import { Request, Response } from "express";
import { comparePassword, hashPassword, validatePassword } from "../../utils/password.util";
import { generateToken } from "../../utils/token.util";

@injectable()
export class UsersController extends BaseController<User>{
    service!: UserService;

    constructor(){
        super(container.resolve(UserService));
    }

    login = async (req: Request, res: Response) => {
        try{
            let { email, password } = req.body;
            if(!email || !password){
                return res.status(400).json({
                    error: "email and password are required"
                })
            }

            let user = await this.service.findByEmail(email);
            if(!user){
                return res.status(404).json({
                    error: "User not found"
                })
            }

            if(await comparePassword(password, user.password)){
                const token = generateToken({ id: user._id, email: user.email, name: user.firstName, lastName: user.lastName }, { id: user._id});
                await this.service.updateToken(String(user._id), token.refreshToken);
                return res.status(200).json(token);
            }
            else return res.status(400).json({
                error: "bad credentials"
            })
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    register = async (req: Request, res: Response) => {
        try{
            let body = req.body;
            if(!body){
                return res.status(400).json({
                    error: "property body is required"
                })
            }

            const { email, password } = body;

            const oldUser = await this.service.findByEmail(email);
            if (oldUser) {
                return res.status(400).send("User Already Exist. Please Login");
            }

            if(!password || !validatePassword(password)){
                return res.status(400).send("Invalid Password");
            }

            body.password = await hashPassword(password);
            let data = (await this.service.create(body)) ? true : false;
            return res.status(200).json(data ? "created": "not created");
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    refresh = async (req: Request, res: Response) => { 
        try{ 
            let refreshToken  = req.headers['refreshtoken'];
            refreshToken = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken;
        
            if(!refreshToken) return res.status(400).json({
                error: "refresh token is required"
            })

            const user = await this.service.findByToken(refreshToken);
            if(!user) return res.status(404).json({
                error: "user not found"
            })

            const token = generateToken(
                { id: user._id, email: user.email, name: user.firstName, lastName: user.lastName }, 
                { id: user._id }
            );
            await this.service.updateToken(String(user._id), token.refreshToken);

            return res.status(200).json(token);
        }
        catch(error){
            return res.status(500).json(error)
        }
    }
}
