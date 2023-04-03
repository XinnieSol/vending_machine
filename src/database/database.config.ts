import { connect } from "mongoose";
import { database } from "src/config/app.config";

async function connectDatabase() {
    var connection = await connect(database.DATABASE_URI, {});
    if (connection) {
        console.log("Connection to database(mongoDb) successful 🔥🔥")
    } else {
        console.log("An error occured while connecting to the database.");
    }
}

export default connectDatabase;