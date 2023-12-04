import * as fs from "fs";
import { testRunnerRunner } from "./converter";
import {
    COMPILATION_ERROR_CODE,
    ExerciseTest,
    TIMEDOUT_CODE,
    TestResponse,
} from "./lib";
import { compileAndRun } from "./compile_and_run";

// receive API call (with JSON object)
// TODO: Replace exerciseTest example with real data (some sort of handling)
const exerciseTest = {
    language: "c",
    code: `int addTwoNumbers(int number1, int number2) {
    int sum;
    sum = number1 + number2;
    return sum;
}
    `,
    userId: "67890",
    testCases: [
        {
            testCaseId: 1,
            code: `CU_ASSERT(addTwoNumbers(1, 2) == 3);`,
        },
        {
            testCaseId: 2,
            code: `CU_ASSERT(addTwoNumbers(1, 2) == 2);`,
        },
    ],
};

// Convert JSON to ExerciseTest instance
const exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);
// Parse JSON and cast to interfaces
const parsedExerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);

async function runCode(
    parsedExerciseTest: ExerciseTest,
): Promise<TestResponse[]> {
    // convert parsedExerciseTest to directories and files
    testRunnerRunner(parsedExerciseTest);

    // Call the async function
    return await runAllTests();
}

// Compile and run tests
async function runAllTests(): Promise<TestResponse[]> {
    const testResults: TestResponse[] = [];
    try {
        for (const testCase of parsedExerciseTest.testCases) {
            testResults.push(
                await compileAndRun(
                    parsedExerciseTest,
                    testCase.code,
                    testCase.testCaseId,
                ),
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
        console.error("OUTER ERROR HAS BEEN FOUND: " + error);
    } finally {
        //deleteDirectory(`${parsedExerciseTest.userId}`);
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

let testResults = runCode(parsedExerciseTest);
console.log(`Here: ${testResults}`)
/*runCode(parsedExerciseTest).then((testResults) => {
    console.log(`Here: ${JSON.stringify(testResults)}`);
});*/

export { runCode };
