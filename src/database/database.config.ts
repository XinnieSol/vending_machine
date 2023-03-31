import { connect } from "mongoose";
import { database } from "src/config/app.config";

function connectDatabase() {
    connect(database.DATABASE_URI!, {})
        .then(() => {
            console.log("Connection to database(mongoDb) successful 🔥🔥");
        })
        .catch((err: Error) => {
            console.log("There was an error while connecting to the database.");
        });
}

export default connectDatabase;