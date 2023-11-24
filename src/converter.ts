import { appendFile } from "node:fs";
import * as fs from "fs";

interface  ExerciseTest {
    language: string;
    code: string;
    studentID: string;
    testCases: TestCase[];
}

interface TestCase {
    testCaseId: number;
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
    if(include) {
        appendFile(directoryPath, `${include}\n`, "utf8", function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(`include was appended!`);
            }
        });
    }

    appendFile(directoryPath, `${content}\n`, "utf8", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`file was appended!`);
        }
    });
}

const exerciseTest = {
    "language": "c",
    "code": "print('Hello, World!')",
    "studentID": "67890",
    "testCases": [
        { "testCaseId": 1, "code": "int main(void) { tests_run_all();} " },
        { "testCaseId": 2, "code": "print('Test Case 2')" }
    ]
};

const exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);

// Parse JSON and cast to interfaces
const parsedExerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);

const main_code = `
#include "src/${exerciseTest.studentID}/exerciseFile.${exerciseTest.language}" 
#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#include "src/${exerciseTest.studentID}/tests/testFile.${exerciseTest.language}" 
int main(void) 
{tests_run_all();}`;

createDirectory(exerciseTest.studentID);
createDirectory(`${exerciseTest.studentID}/tests`);
createFiles(`src/${exerciseTest.studentID}/exerciseFile.${exerciseTest.language}`, `${exerciseTest.code}`);

parsedExerciseTest.testCases.forEach(testCase => 
    createFiles(`src/${exerciseTest.studentID}/tests/testFile${testCase.testCaseId}.${exerciseTest.language}`, `${testCase.code}`, `#include src/${exerciseTest.studentID}/exerciseFile.${exerciseTest.language}`));    

//createFiles(`src/${exerciseTest.studentID}/tests/main.${exerciseTest.language}`, `${main_code}`);