import { appendFile, appendFileSync, readFile, readFileSync } from "node:fs";
import * as fs from "fs";

interface  ExerciseTest {
    language: string;
    code: string;
    studentID: string;
    testCases: TestCase[];
}

interface TestCase {
    testCaseId: string;
    code: string;
}

function createDirectory(directory: string): void {
    if (!fs.existsSync(`src/${directory}`)) {
        fs.mkdirSync(`src/${directory}`);
        console.log(`Directory src/${directory} created!`);
    }
    else {
        console.log(`Directory src/${directory} already exists!`);
    }
}

const createFiles = (directoryPath: string, content: string, include?: string): void => {
    if(include)
        appendFileSync(directoryPath, `${include}\n`, "utf8");

    appendFileSync(directoryPath, `${content}\n`, "utf8");
}

function testRunnerRunner (exerciseTest: ExerciseTest) {
    createDirectory(exerciseTest.studentID);
    createDirectory(`${exerciseTest.studentID}/tests`);
    createFiles(`src/${exerciseTest.studentID}/exerciseFile.${exerciseTest.language}`, `${exerciseTest.code}`);

    exerciseTest.testCases.forEach(testCase => {
        createFiles(`src/${exerciseTest.studentID}/tests/testFile${testCase.testCaseId}.${exerciseTest.language}`, `${testCase.code}`, 
            `#include "exerciseFile.${exerciseTest.language}"`);
        testCase.code = readFileSync(`src/${exerciseTest.studentID}/tests/testFile${testCase.testCaseId}.${exerciseTest.language}`, "utf-8");
    });    

}

export {testRunnerRunner, ExerciseTest, TestCase};