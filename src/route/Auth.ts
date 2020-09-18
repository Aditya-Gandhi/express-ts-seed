import {Router} from "express";
import getDbConnection from "../dbManager/DbManager";
import {User} from "../model/User";
import {Db} from "mongodb";
import * as jwt from "jsonwebtoken"

const bcrypt = require("bcrypt");
const collection_name = "user";
const configProperties = require("../../config/config.json");

module.exports = (router: Router) => {
    function comparePassword(password: string, encryptedPassword: string) {
        return bcrypt.compareSync(password, encryptedPassword);
    }

    function encryptPassword(password: string) {
        let salt = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(password, salt);
    }

    // Register
    router.post("/signup", async (req, res) => {
        if (!req.body.email) {
            res.status(400).json({ success: false, message: "Email is required" });
        } else if (!req.body.username) {
            res.status(400).json({ success: false, message: "Username is required" });
        } else if (!req.body.password) {
            res.status(400).json({ success: false, message: "Password is required" });
        } else {
            const dbConnection =  await getDbConnection();
            let user: User = {
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: encryptPassword(req.body.password)
            };
            dbConnection.collection(collection_name).insertOne(user)
                .then((data) => {
                res.status(200).json({ success: true, message: "User registered successfully!" });
                })
                .catch((error) => res.status(500).json({ success: false, message: "User not registered!" + error }));
        }
    });

    // Login
    router.post("/login", async (req, res) => {
        if (!req.body.username) {
            res.status(400).json({ success: false, message: "no username was provided" });
        } else if (!req.body.password) {
            res.status(400).json({ success: false, message: "no password was provided" });
        } else {
            const dbConnection: Db =  await getDbConnection();
            dbConnection.collection(collection_name).findOne({username: req.body.username.toLowerCase()})
                .then((user: User) => {
                if (!user) {
                    res.status(404).json({success: false, message: "username not found"});
                } else {
                    const validPassword = comparePassword(req.body.password, user.password);
                    if (!validPassword) {
                        res.status(401).json({success: false, message: "invalid password"});
                    } else {
                        let jwt_secret: any = process.env["JWT_SECRET"];
                        const token = jwt.sign({userId: user._id}, jwt_secret, {
                            expiresIn: configProperties.jwtExpiresIn
                        });
                        res.status(200).json({
                            success: true,
                            message: "successfully logged in",
                            token,
                            user: {username: user.username}
                        });
                    }
                }
            })
                .catch((error) => res.status(500).json({ success: false, message: error }));
        }
    });

    router.use((req: any, res, next) => {
        const token = req.headers["authorization"];
        let jwt_secret: any = process.env["JWT_SECRET"];
        if (!token) {
            res.json({ success: false, message: "No token provided" });
        } else {
            jwt.verify(token, jwt_secret, (err: any, decoded: any) => {
                if (err) {
                    res.json({ success: false, message: "Token is not valid" });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    return router;
};
