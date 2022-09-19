import { Request, Response } from "express";
import mongoose from "mongoose";
import { IBaseService } from "../../services/base/base.service";

export default abstract class BaseController<T>{
    service!:IBaseService<T>
    constructor(service:IBaseService<T>){
        this.service = service;
    }

    Get = async (req: Request, res: Response) =>{
        try{
            let data = await this.service.find(req.query);
            return res.status(200).json(data);
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    Find = async (req: Request, res: Response) =>{
        try{
            let id = req.params['id'];
            if(!id)
                return res.status(400).json({
                    error: "property id is required"
                })

            let data = await this.service.findOne(new mongoose.Types.ObjectId(id));
            return res.status(200).json(data);
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    Post = async (req: Request, res: Response) =>{
        try{
            let body = req.body;
            if(!body)
                return res.status(400).json({
                    error: "property body is required"
                })

            let data = (await this.service.create(body)) 
                       ? true 
                       : false;

            return res.status(201).json({ 
                message: data ? "created": "not created", 
                success: data 
            });
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    Put = async (req: Request, res: Response) =>{
        try{
            let id = req.params['id'];
            if(!id)
                return res.status(400).json({
                    error: "property id is required"
                })

            let body = req.body;
            if(!body)
                return res.status(400).json({
                    error: "property body is required"
                })

            let response = (await this.service.update(new mongoose.Types.ObjectId(id), body))
                           ? true 
                           : false;

            return res.status(200).json({
                message: response ? "updated" : "not updated", 
                success: response
            });
        }
        catch(error){
            return res.status(500).json(error)
        }
    }

    Delete = async (req: Request, res: Response) =>{
        try{
            let id = req.params['id'];
            if(!id)
                return res.status(400).json({
                    error: "property id is required"
                })

            let data = (await this.service.delete(new mongoose.Types.ObjectId(id)))
                       ? true 
                       : false;

            return res.status(200).json({ 
                message: data ? "deleted": "not deleted", 
                success: data 
            });
        }
        catch(error){
            return res.status(500).json(error)
        }
    }
}