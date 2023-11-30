import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { ExerciseTest } from './lib';
import * as fs from "fs";

// Creates a directory for all resources.
function testRunnerRunner (exerciseTest: ExerciseTest) {
    const { studentID, language, code, testCases } = exerciseTest;

    try {
        createDirectory(`src/${studentID}`);
        createDirectory(`src/${studentID}/tests`);
        createFiles(`src/${studentID}/exerciseFile.${language}`, code);
        testCases.forEach(testCase => {
            createFiles(`src/${studentID}/tests/testFile${testCase.testCaseId}.${language}`, testCase.code, 
                `#include "exerciseFile.${language}"`);
            testCase.code = readFileSync(`src/${studentID}/tests/testFile${testCase.testCaseId}.${language}`, "utf-8");
        });  
    } catch (error) {
        console.error(error);
    }
}

function createDirectory(directoryPath: string): void {
    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath);
        console.log(`Directory ${directoryPath} created!`);
    }
    else {
        console.error(`Directory ${directoryPath} already exists!`);
    }    
}

function createFiles (directoryPath: string, content: string, include?: string): void {
    if(include)
        appendFileSync(directoryPath, `${include}\n`, "utf8");

    appendFileSync(directoryPath, `${content}\n`, "utf8");
}

export {testRunnerRunner, createDirectory, createFiles};