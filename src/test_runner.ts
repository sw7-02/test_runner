import * as fs from "fs";
import { testRunnerRunner } from "./converter";
import {
    COMPILATION_ERROR_CODE,
    ExerciseTest,
    TIMEDOUT_CODE,
    TestResponse,
} from "./lib";
import { compileAndRun } from "./compile_and_run";

async function runCode(
    parsedExerciseTest: ExerciseTest,
): Promise<TestResponse[]> {
    // convert parsedExerciseTest to directories and files
    testRunnerRunner(parsedExerciseTest);

    // Call the async function
    return await runAllTests(parsedExerciseTest);
}

// Compile and run tests
async function runAllTests(
    parsedExerciseTest: ExerciseTest,
): Promise<TestResponse[]> {
    const testResults: TestResponse[] = [];
    try {
        for (const testCase of parsedExerciseTest.testCases) {
            testResults.push(
                await compileAndRun(parsedExerciseTest, testCase.testCaseId),
            );

            console.log(
                `\ntest result: ${
                    testResults[testResults.length - 1].responseCode
                }\n`,
            );
            if (
                testResults[testResults.length - 1].responseCode ==
                COMPILATION_ERROR_CODE
            ) {
                throw new Error("Test failed");
            } else if (
                testResults[testResults.length - 1].responseCode ==
                TIMEDOUT_CODE
            ) {
                throw new Error("Test timed out");
            }
        }
    } catch (error) {
        console.error("Error has been found: " + error);
    } finally {
        await deleteDirectory(`src/${parsedExerciseTest.userId}`).catch((error) => {
            throw new Error(`Error deleting directory src/${parsedExerciseTest.userId}: ${error}`);
        });

        return testResults;
    }
}

async function deleteDirectory(directoryPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.rm(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error deleting directory ${directoryPath}: ${err.message}`);
                reject(err);
            } else {
                console.log(`Directory ${directoryPath} deleted successfully.`);
                resolve();
            }
        });
    });
}

export {runCode, runAllTests, deleteDirectory};