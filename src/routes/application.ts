import express, { Router, Request, Response } from "express";
import path from "path";

const applicationRouter: Router = express.Router();

applicationRouter.get("/application", (req: Request, res: Response) => {
    res.sendFile(
        path.join(
            __dirname.slice(0, __dirname.indexOf("src")),
            "/client/build",
            "index.html"
        )
    );
});

export default applicationRouter;
