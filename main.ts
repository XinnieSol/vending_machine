import express from 'express';
import * as http from 'http';
import { appCredentials } from 'src/config/app.config';
import connectDatabase from 'src/database/database.config';
import appMiddleware from 'src/middlewares/app.middleware';
import { ErrorMiddleware } from 'src/middlewares/error.middleware';
import routes from 'src/routes';
import swaggerDocument from 'swagger.json';
import * as swaggerUI from 'swagger-ui-express'


const app = express();
const server = http.createServer(app);

appMiddleware(app);

const port = appCredentials.PORT || 8080;

// app endpoint
app.use("api/v1", routes());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// not found route
app.use("*", (req, res) => {
    res.send({
        message: "Resource not found",
        data: null,
        status: 404
    })
});

app.use(ErrorMiddleware);

server.listen(port, () => {
    connectDatabase();
    console.log(`...Listening on port ${port} 🔥🔥`);
});
server.on("error", (error) => {
    console.log(`..server connection failed: ${error}`);
})

