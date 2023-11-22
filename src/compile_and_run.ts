import * as fs from 'fs';
import * as child_process from 'child_process';

const cFilePath = './\\src\\student1\\program.c';

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

//function compileAndRun(language: Language, programCode: string, testCases: string[]): void {
function compileAndRun(language: Language, programCode: string): void {
    let compileCommand: string;
    let runCommand: string;

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
            break;
        default:
            console.error(`Unsupported language: ${language}`);

        process.exit(1);
    }

    var options = {
        timeout: 100,
        stdio: 'inherit',
        shell: true,
    }

    // Create a temporary file with the appropriate extension
    const tempFilePath = `temp.${language}`;
    fs.writeFileSync(tempFilePath, programCode, 'utf-8');   

    child_process.exec(compileCommand, () => {
        child_process.execFile('./temp', (error,stdout,stderr)=>{
            console.log(`\nstdout: ${stdout}`);
    
            if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
        });  
    });

    /*
    testCases.forEach((testCase, index) => {
        const expectedOutput = testCase.trim();
        const result = programOutput === expectedOutput ? 'Passed' : 'Failed';
        console.log(`Test Case ${index + 1}: ${result}`);
    });
    */

    // Cleanup temporary files
    

}



const programFilePath = './\\src\\student1\\program.c';
//const testSpecFilePath = "./\\src\\student1\\tests.txt";

const language = detectLanguage(programFilePath);
console.log("The langugage is: " + language);

const programCode = readFromFile(programFilePath);
//const programCode = fs.readFileSync(programFilePath, 'utf-8');
console.log(programCode);
//const testCases = readFromFile(testSpecFilePath).split('\n');

compileAndRun(language, programCode);

//compileAndRun(language, programCode, testCases);




