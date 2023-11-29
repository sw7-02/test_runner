import * as fs from 'fs';
import * as child_process from 'child_process';
import { promisify } from 'util';
import { ExerciseTest, Language, TestResponse, COMPILATION_ERROR_CODE, EXECUTION_ERROR_CODE, TEST_PASSED_CODE, TEST_FAILED_CODE } from './lib';

const exec = promisify(child_process.exec);
const execFile = promisify(child_process.execFile);

function readFromFile(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        process.exit(1);
    }
}

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
            case Language.TypeScript:
                compileCommand = 'tsc';
                runCommand = 'node';
                break;
            case Language.JavaScript:
                compileCommand = '';
                runCommand = 'node';
                break;
            case Language.Python:
                compileCommand = '';
                runCommand = 'python';
                break;
            case Language.C:
                compileCommand = `gcc -o ${executableFilePath} ${tempFilePath} -lcunit`;
                runCommand = `./${executableFilePath}`;
                break;
            default:
                console.error(`Unsupported language: ${exerciseTest.language}`);
                reject(`Unsupported Language: ${exerciseTest.language}`);
                return process.exit(1);
        }

        fs.writeFileSync(tempFilePath, testCode, 'utf-8');   
        
        // Compile the code
        await exec(compileCommand).then(
            async () => {
                // Execute the compiled code
                await execFile(runCommand).then((res) => {
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
                        console.log(`\nExecution stderr: ${reason.stderr}\n`);
                        resolve({test_case_id: test_case_id,
                            reason: reason.stderr,
                            responseCode: `${EXECUTION_ERROR_CODE}`});
                });
            }, (reason) => {
                    console.error(`Compilation error: ${reason.stderr}`);
                    resolve({ test_case_id: test_case_id,
                        reason: reason.stderr,
                        responseCode: `${COMPILATION_ERROR_CODE}`});
            }
        );
    });
}

export {compileAndRun};