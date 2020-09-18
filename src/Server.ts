import app from "./App";
import compression from "compression";
import helmet from "helmet";
import {config} from "dotenv";
import * as https from "https";
import * as fs from "fs";
import path from "path";

// Load the dotenv config as early as server start
config();

const baseDir = path.resolve();
let configProperties = require(`${baseDir}/config/config.json`);
let options = {
    key: fs.readFileSync(baseDir + '/config/certificates/sample.key'),
    cert: fs.readFileSync(baseDir + '/config/certificates/sample.crt')
};

app.use(helmet()); // set well-known security-related HTTP headers
app.use(compression());

app.disable("x-powered-by");

const server = https.createServer(options, app).listen(configProperties.appPort, () =>
    console.log("Starting ExpressJS server on Port " + configProperties.appPort));

export default server;
