import * as fs from 'fs';
import * as child_process from 'child_process';
import { promisify } from 'util';

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
async function compileAndRun(language: string, programCode: string, test_case_id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let compileCommand: string;
            let runCommand: string;
            //let executableExtension: string;

            switch (language) {
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
                    compileCommand = `gcc -o temp${test_case_id} temp${test_case_id}.c -lcunit`;
                    runCommand = `./temp${test_case_id}`;
                    //executableExtension = '.exe';
                    break;
                default:
                    console.error(`Unsupported language: ${language}`);
                    reject(`Unsupported Language: ${language}`);
                    return process.exit(1);
            }

            // Create a temporary file with the appropriate extension
            const tempFilePath = `temp${test_case_id}.${language}`;
            fs.writeFileSync(tempFilePath, programCode, 'utf-8');   

            console.log(`\n ITERATION: ${test_case_id}\n`);

            // Compile the code
            await exec(compileCommand).then(
                (res) => {
                    // Execute the compiled code
                    execFile(runCommand).then((res) => {
                        console.log(`\nExecution stdout: ${res.stdout}\n`);
                    }, (reason) => {
                            console.log(`\nExecution stderr: ${reason.stderr}\n`);
                            throw new Error("Execution Error");
                    });
                }, (reason) => {
                        console.error(`Compilation error: ${reason.stderr}`);
                        throw new Error("Compilation Error");
                }
            ).finally(() => {
                try{
                    // Delete the temporary file after execution
                    //TODO: Change to fs.unlink() for extra performance
                    fs.unlinkSync(tempFilePath);
                    console.log(`Temporary file ${tempFilePath}${test_case_id} deleted.`);
                    // Delete the compiled executable after execution
                    //TODO: Change to fs.unlink() for extra performance
                    //fs.unlinkSync(`./temp${test_case_id}${executableExtension}`);
                    //console.log(`Compiled executable ./temp${test_case_id}${executableExtension} deleted.`);
                }catch (cleanupError) {
                    console.error(`Error during cleanup: ${cleanupError}`);
                }
                
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
    
}

export {compileAndRun, readFromFile, Language};