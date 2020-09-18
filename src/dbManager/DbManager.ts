import {Db, MongoClient} from "mongodb";

let configProperties = require("../../config/config.json");

let connection: MongoClient;
let dbConnection: Db;

async function getMongoConnection() {
    let uri: string = configProperties.dbUrl;
    let client: MongoClient = new MongoClient(uri, { useUnifiedTopology: true });
    connection = connection ? connection : await client.connect();
    return connection;
}

let getDbConnection = async function () {
    connection = connection ? connection : await getMongoConnection();
    dbConnection = dbConnection ? dbConnection : connection.db(configProperties.dbName);
    return dbConnection;
}

export default getDbConnection;
