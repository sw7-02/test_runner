import * as fs from "fs";
import {testRunnerRunner, ExerciseTest} from "./converter";
import {compileAndRun} from "./compile_and_run";
import { ChildProcess } from "child_process";

interface FailReason {
    test_case_id: string
    reason: string
}

// receive API call (with JSON object)
// TODO: Replace exerciseTest example with real data (some sort of handling)
const exerciseTest = {
    "language": "c",
    "code": `int addTwoNumbers(int number1, int number2) {
    int sum;
    sum = number1 + number2;
    return sum;
}
    `,
    "studentID": "67890",
    "testCases": [
        { "testCaseId": 1, "code": ` 
#include "src/67890/exerciseFile.c"

#include <CUnit/CUnit.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    CU_assert(addTwoNumbers(1,1) == 2);
} 
        `},
        { "testCaseId": 2, "code": `
#include "src/67890/exerciseFile.c"

#include <CUnit/CUnit.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    CU_assert(addTwoNumbers(1,2) == 2);
}       
        `}
    ]
};

// Convert JSON to ExerciseTest instance
const exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);
// Parse JSON and cast to interfaces
const parsedExerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);

// convert parsedExerciseTest to directories and files
testRunnerRunner(parsedExerciseTest);

// Compile and run tests
parsedExerciseTest.testCases.forEach(testCase => {
    compileAndRun(parsedExerciseTest.language, testCase.code, testCase.testCaseId);
});



/*
try {
    // Delete student directory synchronously
    fs.rmSync(`src/${parsedExerciseTest.studentID}`, { recursive: true });
    console.log(`${parsedExerciseTest.studentID} directory deleted successfully`);
} catch (err) {
    console.error(`Error deleting directory: ${err}`);
}
*/