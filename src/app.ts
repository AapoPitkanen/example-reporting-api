import { Server } from "./server";
import NodeCache from "node-cache";
import axios from "axios";

const headers = {
    "Content-Type": "application/json",
    Authorization: `token ${process.env.GIOSG_ACCESS_TOKEN}`,
};

const giosgReportingURL = process.env.GIOSG_REPORTING_URL;

export const Cache: NodeCache = new NodeCache();

(async () => {
    await axios
        .get(giosgReportingURL, { headers })
        .then(res => {
            const data: object = res.data;
            Cache.set("data", data);
        })
        .catch(err =>
            console.log(
                `Error occurred on data fetching with code ${err.response.status} ${err.response.statusText}`
            )
        );

    const app = new Server();
    app.startServer();
})();
