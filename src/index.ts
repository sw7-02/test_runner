import express from "express";
//import express = require("express");//Lukas skal køre det sådan her
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
//import cors = require("cors");//Lukas skal køre det sådan her
import {
    COMPILATION_ERROR_CODE,
    ExerciseTest,
    TIMEDOUT_CODE,
    UNKNOWN_FAILURE_CODE,
} from "./lib";
import { runCode } from "./test_runner";

const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// For healthchecking
app.get("/status", (_, res) => res.send("Service is running!"));

function validateData(data: ExerciseTest): string | undefined {
    if (!data) return "All necessary parameters were not provided";
    else if (data.code === undefined || data.code.trim() === "")
        return "No code provided";
    else if (data.language === undefined || data.language.trim() === "")
        return "No code language provided";
    else if (data.userId === undefined) return "No student ID provided";
    else if (data.testCases === undefined || data.testCases.length === 0)
        return "No tests provided";
    else if (
        data.testCases.find(
            ({ code, testCaseId }) =>
                testCaseId === undefined ||
                code === undefined ||
                code.trim().length === 0,
        )
    )
        return "One or more valid test(s) provided";
}

app.post("/", async (req, res) => {
    console.error(req.body);
    const exerciseTest = (await req.body) as ExerciseTest;

    const validated = validateData(exerciseTest);
    if (validated !== undefined) {
        res.status(400).send(validated);
        return;
    }

    // TODO: handle thrown errors

    const testResults = await runCode(exerciseTest);

    const err = testResults.find(
        (testResult) =>
            testResult.responseCode ==
            (COMPILATION_ERROR_CODE || TIMEDOUT_CODE || UNKNOWN_FAILURE_CODE),
    );
    if (err !== undefined) res.status(422).send([err]);
    else res.status(200).send(testResults);
});

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
