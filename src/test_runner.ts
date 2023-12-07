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
        deleteDirectory(`${parsedExerciseTest.userId}`);
        //console.log(testResults);
    }
    return testResults;
}

function deleteDirectory(directoryPath: string): void {
    fs.rm(directoryPath, { recursive: true }, (err) => {
        if (err) {
            console.error(
                `Error deleting directory ${directoryPath}:` + err.message,
            );
            return;
        }
        console.log(`Directory ${directoryPath} deleted successfully.`);
    });
}

export { runCode };
