import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { ExerciseTest } from './lib';


// Creates a directory for all resources.
function testRunnerRunner (exerciseTest: ExerciseTest) {
    const { studentID, language, code, testCases } = exerciseTest;
    createDirectory(studentID);
    createDirectory(`${studentID}/tests`);
    createFiles(`src/${studentID}/exerciseFile.${language}`, code);

    testCases.forEach(testCase => {
        createFiles(`src/${studentID}/tests/testFile${testCase.testCaseId}.${language}`, testCase.code, 
            `#include "exerciseFile.${language}"`);
        testCase.code = readFileSync(`src/${studentID}/tests/testFile${testCase.testCaseId}.${language}`, "utf-8");
    });    
}

// Creates a directory if it does not already exist
function createDirectory(directory: string): void {
    const path = `src/${directory}`;
    if (!existsSync(path)) {
        mkdirSync(path);
        console.log(`Directory ${path} created!`);
    }
    else
        console.log(`Directory ${path} already exists!`);
}

// Creates files, with content and optionally an include if supplied
function createFiles (directoryPath: string, content: string, include?: string): void {
    if(include) 
        appendFileSync(directoryPath, `${include}\n`, "utf8");

    appendFileSync(directoryPath, `${content}\n`, "utf8");
}

export {testRunnerRunner};