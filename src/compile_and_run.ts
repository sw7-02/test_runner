import * as fs from 'fs';
import * as child_process from 'child_process';
import { ExerciseTest } from './converter';

// Enum representing supported programming languages
enum Language {
    TypeScript = 'typescript',
    JavaScript = 'javascript',
    Python = 'py',
    C = 'c',
}

function readFromFile(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        //console.error(`Error reading file ${filePath}: ${error.Message}`);
        process.exit(1);
    }
}

// Function to compile and run code based on the detected language
function compileAndRun(language: string, programCode: string, test_case_id: string): void {
    let compileCommand: string;
    let runCommand: string;
    let executableExtension: string;

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
            compileCommand = `gcc -o temp${test_case_id} temp${test_case_id}.c`;
            runCommand = `./temp${test_case_id}`;
            executableExtension = '.exe';
            break;
        default:
            console.error(`Unsupported language: ${language}`);

        process.exit(1);
    }

    // Create a temporary file with the appropriate extension
    const tempFilePath = `temp${test_case_id}.${language}`;
    fs.writeFileSync(tempFilePath, programCode, 'utf-8');   

    // Compile the code
    child_process.exec(compileCommand, (error, stdout, stderr) => {
        if (stderr)
            console.log(`\nCompilation stderr: ${stderr}\n`);
        else if (error)
            console.error(`Compilation error: ${error}`);
        else
            console.log(`\nCompilation stdout: ${stdout}`);
        
        // Execute the compiled code
        child_process.execFile(runCommand, (error,stdout, stderr)=>{
            if (stderr)
                console.log(`\nExecution stderr: ${stderr}\n`);
            else if (error)
                console.error(`Execution error: ${error}`);
            else
                console.log(`\nExecution stdout: ${stdout}\n`);

            // Delete the temporary file after execution
            //TODO: Change to fs.unlink() for extra performance
            fs.unlinkSync(tempFilePath);
            console.log(`Temporary file ${tempFilePath}${test_case_id} deleted.`);

            // Delete the compiled executable after execution
            //TODO: Change to fs.unlink() for extra performance
            fs.unlinkSync(`./temp${test_case_id}${executableExtension}`);
            console.log(`Compiled executable ./temp${test_case_id}${executableExtension} deleted.`);
        });
    });
}

export {compileAndRun, readFromFile, Language};