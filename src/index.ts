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

app.post("/", async (req, res) => {
    console.error(req.body);
    const exerciseTest = (await req.body) as ExerciseTest;
    if (!exerciseTest)
        return res
            .status(400)
            .send("All necessary parameters were not provided");
    else if (exerciseTest.code === undefined || exerciseTest.code.trim() === "")
        return res.status(400).send("No code provided");
    else if (
        exerciseTest.language === undefined ||
        exerciseTest.language.trim() === ""
    )
        return res.status(400).send("No code language provided");
    else if (
        exerciseTest.userId === undefined ||
        exerciseTest.userId.trim() === ""
    )
        return res.status(400).send("No student ID provided");
    else if (
        exerciseTest.testCases === undefined ||
        exerciseTest.testCases.length === 0
    )
        return res.status(400).send("No tests provided");
    else if (
        exerciseTest.testCases.find(
            ({ code, testCaseId }) =>
                testCaseId === undefined ||
                code === undefined ||
                code.trim().length === 0,
        )
    )
        return res.status(400).send("One or more valid test(s) provided");

    // TODO: handle thrown errors

    const testResults = await runCode(exerciseTest);

    testResults.forEach((testResult) => {
        if (
            testResult.responseCode ==
            (COMPILATION_ERROR_CODE || TIMEDOUT_CODE || UNKNOWN_FAILURE_CODE)
        )
            return res.status(422).send(testResult);
    });

    return res.status(200).send(testResults);
});

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
