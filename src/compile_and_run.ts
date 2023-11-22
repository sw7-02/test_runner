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
        console.log("good");
        return fs.readFileSync("filePath", 'utf-8');
    } catch (error) {
        console.error("bad");
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

    // Create a temporary file with the appropriate extension
    const tempFilePath = `temp.${language}`;
    fs.writeFileSync(tempFilePath, programCode);

    // Compile the program if needed
    if (compileCommand) {
        const gccPath = 'C:\\MinGW\\bin\\gcc.exe';
        const compileProcess = child_process.spawnSync(
            gccPath,
            [tempFilePath],
          );

        // Check for errors in the compile process
        if (compileProcess.error) {
            console.error(`Error compiling the program: ${compileProcess.error.message}`);
            process.exit(1);
        } else if (compileProcess.status !== 0) {  // Check the exit code of the compilation process
            console.error(`Compilation failed with exit code ${compileProcess.status}`);
            process.exit(1);
        }
    }

    // Run the compiled or interpreted code
    const runProcess = child_process.spawnSync(runCommand, [tempFilePath]);

    // Log the entire runProcess object
    console.log('runProcess:', runProcess);

    // Log the standard output if it's defined
    if (runProcess.stdout) {
        console.log('Standard Output:');
        console.log(runProcess.stdout.toString().trim());
    } else {
        console.log('No standard output produced by the program.');
    }

    // Log the standard error if it's defined
    if (runProcess.stderr) {
        console.log('\nStandard Error:');
        console.log(runProcess.stderr.toString().trim());
    } else {
        console.log('No standard error produced by the program.');
    }

    //console.log(runProcess.stdout.toString().trim());
    //const programOutput = runProcess.stdout.toString().trim();

    /*
    testCases.forEach((testCase, index) => {
        const expectedOutput = testCase.trim();
        const result = programOutput === expectedOutput ? 'Passed' : 'Failed';
        console.log(`Test Case ${index + 1}: ${result}`);
    });
    */

    // Cleanup temporary files
    try {
        fs.unlinkSync(tempFilePath);
    } catch (unlinkError) {
        console.error(`Error removing temporary file ${tempFilePath}: ${unlinkError.message}`);
    }

    // Remove compiled file for C
    if (language === Language.C) {
        try {
            fs.unlinkSync('temp');
        } catch (unlinkError) {
            console.error(`Error removing compiled file 'temp': ${unlinkError.message}`);
        }
    }
}



const programFilePath = './\\src\\student1\\program.c';
//const testSpecFilePath = "./\\src\\student1\\tests.txt";
console.log("hello");


const language = detectLanguage(programFilePath);
console.log("The langugage is: " + language);

//const programCode = readFromFile(programFilePath);
const programCode = fs.readFileSync(programFilePath, 'utf-8');
console.log(programCode);
//const testCases = readFromFile(testSpecFilePath).split('\n');

compileAndRun(language, programCode);

//compileAndRun(language, programCode, testCases);




