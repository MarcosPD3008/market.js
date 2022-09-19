import express, { Application } from 'express'
import cors from 'cors';
import routes from "../app/routes/index.routes";
import database from '../database/database';

export default class ServerApp {
    private app: Application;
	private port: string;
    timeout!:number;

    constructor() {
        this.app  = express();
        this.port = process.env.server_port || '3000';
        this.timeout = Number(process.env.server_timeout) || 10000;


        // middlewares
        this.middlewares();
        
        // routes   
        this.routes();
    }

    private routes() {
        this.app.use('/', routes);
    }

    private middlewares () {
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json());  
        this.app.use(cors()) 
    }

    runServer() {
        let server = this.app.listen(this.port, () => {  console.log(`Server running on port ${this.port}`) });
        server.setTimeout(this.timeout); 
    } 

    runDb() {
        database.startConnection()
        .then(() => {
            console.log('Database connected');
        })
        .catch(err => {
            console.log(err);
        })
    }
}