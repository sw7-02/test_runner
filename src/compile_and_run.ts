import * as fs from 'fs';
import * as child_process from 'child_process';
import { promisify } from 'util';
import { ExerciseTest } from './converter';

// Enum representing supported programming languages
enum Language {
    TypeScript = 'typescript',
    JavaScript = 'javascript',
    Python = 'py',
    C = 'c',
}

interface TestResponse {
    test_case_id: string
    reason: string
    responseCode: string
}

interface TestError extends Error {
    reason: string
    errorCode: string
}

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
        let response: TestResponse = {
            test_case_id: "",
            reason: "",
            responseCode: ""
        }
        // Compile the code
        await exec(compileCommand).then(
            async (res) => {
                // Execute the compiled code
                await execFile(runCommand).then((res) => {
                    var result = res.stdout.substring(res.stdout.indexOf("Test"));
                    //TODO: better logic for identifieng failure and passes
                    if (result.includes("Test failed")) {
                        response = {
                            test_case_id: test_case_id,
                            reason: result,
                            responseCode: "1"
                        }
                    }
                    else if (result.includes("Test passed")) {
                        
                        response = {
                            test_case_id: test_case_id,
                            reason: result,
                            responseCode: "0"
                        }
                    }
                    else {
                        response = {
                            test_case_id: test_case_id,
                            reason: result,
                            responseCode: "Unknown"
                        }
                    }
                    console.log(result)
                    resolve(response);
                }, (reason) => {
                        console.log(`\nExecution stderr: ${reason.stderr}\n`);
                        const respsonseError: TestResponse = {
                            test_case_id: test_case_id,
                            reason: reason.stderr,
                            responseCode: "69",
                        }
                        resolve(respsonseError);
                });
            }, (reason) => {
                    console.error(`Compilation error: ${reason.stderr}`);
                    const respsonseError: TestResponse = {
                        test_case_id: test_case_id,
                        reason: reason.stderr,
                        responseCode: "16",
                    }
                    resolve(respsonseError);
            }
        );
    });
}

export {compileAndRun, readFromFile, Language, TestResponse};