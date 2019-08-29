import { Server } from "./server";
import NodeCache from "node-cache";
import axios from "axios";

const headers = {
    "Content-Type": "application/json",
    Authorization: `token ${process.env.GIOSG_ACCESS_TOKEN}`,
};

const giosgReportingURL =
    "https://api.giosg.com/api/reporting/v1/rooms/84e0fefa-5675-11e7-a349-00163efdd8db/chat-stats/daily/?start_date=2017-05-01&end_date=2017-06-15";

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
