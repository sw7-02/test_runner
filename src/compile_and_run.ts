import * as fs from 'fs';
import * as child_process from 'child_process';
import { promisify } from 'util';
import { ExerciseTest, Language, TestResponse, COMPILATION_ERROR_CODE, EXECUTION_ERROR_CODE, UNSUPPORTED_LANGUGAGE, TEST_PASSED_CODE, TEST_FAILED_CODE, TIMEDOUT_CODE } from './lib';
import { TIMEOUT } from 'dns';
import { stderr } from 'process';

const exec = promisify(child_process.exec);
const execFile = promisify(child_process.execFile);

const TIMEOUT_DURATION = 3000; // 5 seconds in milliseconds

// Function to compile and run code based on the detected language
async function compileAndRun(exerciseTest: ExerciseTest, testCode: string, test_case_id: string): Promise<TestResponse> {
    let response: TestResponse = {
        test_case_id: test_case_id,
        reason: "",
        responseCode: ""
    }

    return new Promise(async (resolve, reject) => {
        let compileCommand: string;
        let runCommand: string;

        // Create temporary file path
        const tempFilePath = `src/${exerciseTest.studentID}/temp${test_case_id}.${exerciseTest.language}`
        const executableFilePath = `src/${exerciseTest.studentID}/temp${test_case_id}`

        switch (exerciseTest.language) {
            case Language.C:
                compileCommand = `gcc -o ${executableFilePath} ${tempFilePath} -lcunit`;
                runCommand = `./${executableFilePath}`;
                break;
            default:
                console.error(`Unsupported language: ${exerciseTest.language}`);
                return resolve({
                    test_case_id: test_case_id,
                    reason: "Unsupported langugage",
                    responseCode: `${UNSUPPORTED_LANGUGAGE}`
                });
        }

        fs.writeFileSync(tempFilePath, testCode, 'utf-8');   
        
        // Compile the code
        await exec(compileCommand).catch((reason) => {
            console.error(`Compilation error: ${reason.stderr}`);
            resolve({
                test_case_id: test_case_id,
                reason: reason.stderr,
                responseCode: `${COMPILATION_ERROR_CODE}`
            });
            return;
        });

        // Execute the compiled code
        await execFile(runCommand, {timeout: TIMEOUT_DURATION})
            .then((res) => {
                var result = res.stdout.substring(res.stdout.indexOf("Test"));
                response.reason = result;
                //TODO: better logic for identifieng failure and passes
                if (result.includes("Test failed"))
                    response.responseCode = `${TEST_FAILED_CODE}`;
                else if (result.includes("Test passed"))
                    response.responseCode = `${TEST_PASSED_CODE}`;
                else
                    response.responseCode = "Unknown";
        
                console.log(result)
                resolve(response);
            }, (reason) => {
                console.log("\n\nreason.code = "+ reason + "\n\n");
                if(reason.stderr == ""){
                    return resolve({test_case_id: test_case_id,
                        reason: "Timed out",
                        responseCode: `${TIMEDOUT_CODE}`});
                } else {
                    console.log(`\nExecution stderr: ${reason.stderr}\n`);
                    resolve({test_case_id: test_case_id,
                        reason: reason.stderr,
                        responseCode: `${EXECUTION_ERROR_CODE}`});
                }
                    
            });
    });
}

export {compileAndRun};