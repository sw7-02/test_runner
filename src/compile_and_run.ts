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

const exec = promisify(child_process.exec);
const execFile = promisify(child_process.execFile);

function readFromFile(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        //console.error(`Error reading file ${filePath}: ${error.Message}`);
        process.exit(1);
    }
}

// Function to compile and run code based on the detected language
async function compileAndRun(exerciseTest: ExerciseTest, testCode: string, test_case_id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let compileCommand: string;
            let runCommand: string;
            let executableExtension: string;
            // Create temporary file path
            const tempFilePath = `src/${exerciseTest.studentID}/temp${test_case_id}.${exerciseTest.language}`
            const executableFilePath = `src/${exerciseTest.studentID}/temp${test_case_id}`


            switch (exerciseTest.language) {
                case Language.TypeScript:
                    compileCommand = 'tsc';
                    runCommand = 'node';
                    break;
                case Language.JavaScript:
                    compileCommand = ''; // No compilation needed for JavaScript
                    runCommand = 'node';
                    break;
                case Language.Python:
                    compileCommand = ''; // No compilation needed for Python
                    runCommand = 'python';
                    break;
                case Language.C:
                    compileCommand = `gcc -o ${executableFilePath} ${tempFilePath} -lcunit`;
                    runCommand = `./${executableFilePath}`;
                    //executableExtension = '.exe';
                    break;
                default:
                    console.error(`Unsupported language: ${exerciseTest.language}`);
                    reject(`Unsupported Language: ${exerciseTest.language}`);
                    return process.exit(1);
            }

            fs.writeFileSync(tempFilePath, testCode, 'utf-8');   

            // Compile the code
            await exec(compileCommand).then(
                async (res) => {
                    // Execute the compiled code
                    await execFile(runCommand).then((res) => {
                        var result = res.stdout.substring(res.stdout.indexOf("Test"));
                        console.log(`\nExecution stdout: ${result}\n`);
                    }, (reason) => {
                            console.log(`\nExecution stderr: ${reason.stderr}\n`);
                            throw new Error("Execution Error");
                    });
                }, (reason) => {
                        console.error(`Compilation error: ${reason.stderr}`);
                        throw new Error("Compilation Error");
                }
            );
            resolve();
        } catch (error) {
            reject(error);
        }
    });
    
}

export {compileAndRun, readFromFile, Language};