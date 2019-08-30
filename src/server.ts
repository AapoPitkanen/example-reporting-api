import Express from "express";
import router from "./routes/api/reporting";
import applicationRouter from "./routes/application";
import dotenv from "dotenv";
import path from "path";

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
        this.app.use(
            Express.static(
                path.join(
                    __dirname.slice(0, __dirname.indexOf("src")),
                    "/client/build"
                )
            )
        );
    }

    private initializeRoutes() {
        this.app.use("/api/reporting", router);
        this.app.use("/", applicationRouter);
    }
}
