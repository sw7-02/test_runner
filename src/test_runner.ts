import * as fs from "fs";
import { testRunnerRunner } from "./converter";
import { COMPILATION_ERROR_CODE, EXECUTION_ERROR_CODE, ExerciseTest, TIMEDOUT_CODE, TestResponse, UNSUPPORTED_LANGUGAGE } from "./lib";
import { compileAndRun } from "./compile_and_run";
import { resolve } from "path";

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
#include <CUnit/CUnit.h>
#include <CUnit/Basic.h>
#include <stdio.h>
#include <stdlib.h>

void testAddTwoNumbers(void) {
    CU_ASSERT(addTwoNumbers(1, 2) == 3);
}

int main(void) {
    // Initialize the CUnit test registry
    if (CUE_SUCCESS != CU_initialize_registry()) {
        return CU_get_error();
    }

    // Add a suite to the registry
    CU_pSuite suite = CU_add_suite("Suite_1", NULL, NULL);
    if (suite == NULL) {
        CU_cleanup_registry();
        return CU_get_error();
    }

    // Add the test function to the suite
    if (CU_add_test(suite, "testAddTwoNumbers", testAddTwoNumbers) == NULL) {
        CU_cleanup_registry();
        return CU_get_error();
    }


    // Run the tests using the basic interface
    CU_basic_set_mode(CU_BRM_SILENT);
    CU_basic_run_suite(suite);
    
    int num_failures = CU_get_number_of_failures();

    // Print only if there are failures
    if (num_failures > 0) {
        printf("\\nTest failed\\n Expected:");
        CU_basic_show_failures(CU_get_failure_list());

        printf("\\nActual: %d\\n", addTwoNumbers(1, 2));
    } else {
        printf("Test passed\\n");
    }
}
        `},
        { "testCaseId": 2, "code": `
#include <CUnit/CUnit.h>
#include <CUnit/Basic.h>
#include <stdio.h>
#include <stdlib.h>

void testAddTwoNumbers(void) {
    CU_ASSERT(addTwoNumbers(1, 2) == 2);
}

int main(void) {
    // Initialize the CUnit test registry
    if (CUE_SUCCESS != CU_initialize_registry()) {
        return CU_get_error();
    }

    // Add a suite to the registry
    CU_pSuite suite = CU_add_suite("Suite_1", NULL, NULL);
    if (suite == NULL) {
        CU_cleanup_registry();
        return CU_get_error();
    }

    // Add the test function to the suite
    if (CU_add_test(suite, "testAddTwoNumbers", testAddTwoNumbers) == NULL) {
        CU_cleanup_registry();
        return CU_get_error();
    }


    // Run the tests using the basic interface
    CU_basic_set_mode(CU_BRM_SILENT);
    CU_basic_run_suite(suite);
    
    int num_failures = CU_get_number_of_failures();

    // Print only if there are failures
    if (num_failures > 0) {
        printf("\\nTest failed\\n Expected:");
        CU_basic_show_failures(CU_get_failure_list());

        printf("\\nActual: %d\\n", addTwoNumbers(1, 2));
    } else {
        printf("Test passed\\n");
    }
}
        `}
    ]
};

// Convert JSON to ExerciseTest instance
const exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);
// Parse JSON and cast to interfaces
const parsedExerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);

async function runCode (exerciseTest: ExerciseTest): Promise<TestResponse[]> {
    // convert parsedExerciseTest to directories and files
    testRunnerRunner(exerciseTest);  

    // Call the async function
    return await runAllTests(exerciseTest);
}

// Compile and run tests
async function runAllTests(exerciseTest: ExerciseTest) : Promise<TestResponse[]> {
    const testResults: TestResponse[] = [];
    try {
        for (const testCase of exerciseTest.testCases) {
            testResults.push((
                await compileAndRun(exerciseTest, testCase.code, testCase.testCaseId)));
            
            console.log(`\ntest result: ${testResults[testResults.length - 1].responseCode}\n`)
            if (testResults[testResults.length - 1].responseCode == (`${COMPILATION_ERROR_CODE}` || `${EXECUTION_ERROR_CODE}`))
                throw new Error("Test failed");
            else if (testResults[testResults.length - 1].responseCode == `${TIMEDOUT_CODE}`) 
                throw new Error("Test timed out");
            else if (testResults[testResults.length - 1].responseCode == `${UNSUPPORTED_LANGUGAGE}`)
                throw new Error("Unsupported language");
        }
    } catch (error) {
        console.error("OUTER ERROR HAS BEEN FOUND: " + error);
    } finally {
        await deleteDirectory(`src/${exerciseTest.studentID}`).catch((error) => {
            throw new Error(`Error deleting directory src/${exerciseTest.studentID}: ${error}`);
        });

        return testResults;
        //console.log(testResults);
        
    }
}

async function deleteDirectory(directoryPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.rm(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error deleting directory ${directoryPath}: ${err.message}`);
                reject(err);
            } else {
                console.log(`Directory ${directoryPath} deleted successfully.`);
                resolve();
            }
        });
    });
}

//let testResults = runCode(parsedExerciseTest);
//console.log(`Here: ${testResults}`)
runCode(parsedExerciseTest)
    .then(testResults => {
        console.log(`Here: ${JSON.stringify(testResults)}`);
    })

export {runCode, runAllTests, deleteDirectory};
