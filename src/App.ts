import express, {Express, Request, Response, Router} from "express";
import bodyParser from "body-parser";
import * as path from "path";

const app: Express = express();
const baseDir = path.resolve();
// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();

// ROUTERS
const auth: Router = require("./route/Auth")(router);

// USE ROUTER
app.use("/auth", auth);

// STATIC FOLDER
app.use(express.static(path.join(baseDir, "public")));

// USE ANGULAR AS FRONTEND
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(baseDir, "public", "index.html"));
});

export default app;
