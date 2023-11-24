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
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void test_program1() {
    int result = addTwoNumbers(1,1);

    if(result != 2) {
        printf("FAILED: test_program1(): 1+1 should be 2");
        printf("%d", result);
    } else {
        printf("success");
    }
}

int main(void) { test_program1();} ` 
        },
        { "testCaseId": 2, "code": `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void test_program1() {
    int result = addTwoNumbers(1,2);

    if(result != 2) {
        printf("FAILED: test_program1(): 1+2 should be 2");
        printf("%d", result);
    } else {
        printf("great success");
    }
}

int main(void) {test_program1();} 
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