import * as fs from 'fs';
import * as child_process from 'child_process';

// Enum representing supported programming languages
interface ProgramInput {
  language: Language;
  code: string;
}

enum Language {
    TypeScript = 'typescript',
    JavaScript = 'javascript',
    Python = 'python',
    C = 'c',
}

// Function to detect the programming language based on file extension
function detectLanguage(filePath: string): Language {
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
        case 'ts':
            return Language.TypeScript;
        case 'js':
            return Language.JavaScript;
        case 'py':
            return Language.Python;
        case 'c':
            return Language.C;
        default:
            console.error(`Unsupported file extension: ${fileExtension}`);

        process.exit(1);
    }
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
//function compileAndRun(language: Language, programCode: string, testCases: string[]): void {
function compileAndRun(language: Language, programCode: string): void {
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
            compileCommand = 'gcc -o temp temp.c';
            runCommand = './temp';
            executableExtension = '.exe';
            break;
        default:
            console.error(`Unsupported language: ${language}`);

        process.exit(1);
    }

    // Create a temporary file with the appropriate extension
    const tempFilePath = `temp.${language}`;
    fs.writeFileSync(tempFilePath, programCode, 'utf-8');   

    // Compile the code
    child_process.exec(compileCommand, () => {
        // Execute the compiled code
        child_process.execFile('./temp', (error,stdout)=>{
            console.log(`\nstdout: ${stdout}\n`);
    
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            // Delete the temporary file after execution
            fs.unlinkSync(tempFilePath);
            console.log(`Temporary file ${tempFilePath} deleted.`);

            // Delete the compiled executable after execution
            fs.unlinkSync(`./temp.exe`);
            console.log(`Compiled executable ./temp.exe deleted.`);
        });
    });
    
}


const programFilePath = './\\src\\student1\\program.c';
//const testSpecFilePath = "./\\src\\student1\\tests.txt";

const language = detectLanguage(programFilePath);
console.log("\nThe langugage is: " + language);

const programCode = readFromFile(programFilePath);
//const programCode = fs.readFileSync(programFilePath, 'utf-8');
console.log("\n" + programCode);
//const testCases = readFromFile(testSpecFilePath).split('\n');

compileAndRun(language, programCode);

//compileAndRun(language, programCode, testCases);




