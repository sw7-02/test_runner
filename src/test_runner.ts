import {testRunnerRunner, ExerciseTest, TestCase} from "./converter";
import {compileAndRun, readFromFile, Language} from "./compile_and_run";

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


const exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);
// Parse JSON and cast to interfaces
const parsedExerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);


// compile
const programFilePath = './\\src\\student1\\tests\\main.c';
const testSpecFilePath = "./\\src\\student1\\test-spec.json";

// convert parsedExerciseTest to directories and files
testRunnerRunner(parsedExerciseTest);
console.log("\n\n here");

// Compile and run tests
parsedExerciseTest.testCases.forEach(testCase => 
        compileAndRun(parsedExerciseTest.language, testCase.code, testCase.testCaseId));    


