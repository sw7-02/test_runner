import express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
//import cors from "cors";
import cors = require("cors");
import { ExerciseTest } from "./lib";
import { runCode } from "./test_runner"

const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
    console.log(req.body);
    const exerciseTest = req.body as ExerciseTest
    if(!exerciseTest){
        res.status(400).send("All necessary parameters were not provided");
    }
    
    res.send("Hello World!");
})


app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
