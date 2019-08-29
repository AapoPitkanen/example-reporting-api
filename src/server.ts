import Express from "express";
import router from "./routes/api/reporting";
import dotenv from "dotenv";

dotenv.config();

export class Server {
    public app: Express.Application;

    constructor() {
        this.app = Express();
        this.setConfig();
        this.initializeRoutes();
    }

    public startServer() {
        this.app.listen(process.env.SERVER_PORT);
        console.log(`Server started at port ${process.env.SERVER_PORT}`);
    }

    private setConfig() {
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({ extended: false }));
    }

    private initializeRoutes() {
        this.app.use("/api/reporting", router);
    }
}
