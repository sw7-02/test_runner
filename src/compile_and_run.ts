import * as child_process from "child_process";
import { promisify } from "util";
import {
    ExerciseTest,
    Language,
    TestResponse,
    COMPILATION_ERROR_CODE,
    TEST_PASSED_CODE,
    TEST_FAILED_CODE,
    TIMEDOUT_CODE,
    UNKNOWN_FAILURE_CODE,
    UNSUPPORTED_LANGUGAGE,
} from "./lib";

const exec = promisify(child_process.exec);
const execFile = promisify(child_process.execFile);

const TIMEOUT_DURATION = 15000; // 15 seconds in milliseconds

// Function to compile and run code based on the detected language
async function compileAndRun(
    exerciseTest: ExerciseTest,
    test_case_id: string,
): Promise<TestResponse> {
    let response: TestResponse = {
        testCaseId: test_case_id,
        reason: "",
        responseCode: 999,
    };


    return new Promise(async (resolve, reject) => {
        let compileCommand: string;
        let runCommand: string;

        // Create code file path
        const codeFilePath = `${exerciseTest.userId}/testFile${test_case_id}.${exerciseTest.language}`;
        const executableFilePath = `${exerciseTest.userId}/testFile${test_case_id}`;

        switch (exerciseTest.language.toLowerCase()) {
            case Language.C:
                compileCommand = `gcc -o ${executableFilePath} ${codeFilePath} -lcunit`;
                runCommand = `./${executableFilePath}`;
                break;
            default:
                return resolve({
                    testCaseId: test_case_id,
                    reason: "Unsupported langugage",
                    responseCode: UNSUPPORTED_LANGUGAGE
                });
        }

        // Compile the code
        await exec(compileCommand).catch((reason) => {
            console.error(`Compilation error: ${reason.stderr}`);
            resolve({
                testCaseId: test_case_id,
                reason: reason.stderr,
                responseCode: COMPILATION_ERROR_CODE,
            });
            return;
        });

        // Execute the compiled code
        await execFile(runCommand, { timeout: TIMEOUT_DURATION }).then(
            (res) => {
                var result = res.stdout.substring(res.stdout.indexOf("Test"));
                response.reason = result;
                //TODO: better logic for identifieng failure and passes

                if (result.includes("Test failed"))
                    response.responseCode = TEST_FAILED_CODE;
                else if (result.includes("Test passed"))
                    response.responseCode = TEST_PASSED_CODE;
                else response.responseCode = UNKNOWN_FAILURE_CODE;

                resolve(response);
            },
            (reason) => {
                if (reason.stderr == "") {
                    return resolve({
                        testCaseId: test_case_id,
                        reason: "timed out",
                        responseCode: TIMEDOUT_CODE,
                    });
                } else {
                    console.log(`\nUnknown stderr: ${reason.stderr}\n`);
                    resolve({
                        testCaseId: test_case_id,
                        reason: reason.stderr,
                        responseCode: UNKNOWN_FAILURE_CODE,
                    });
                }
            },
        );
    });
}

export { compileAndRun };
