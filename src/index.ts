import express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
