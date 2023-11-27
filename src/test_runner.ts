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
#include <CUnit/CUnit.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    CU_assert(addTwoNumbers(1,1) == 2);
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
                printf("\nTest failed\n Expected:");
                CU_basic_show_failures(CU_get_failure_list());
        
                printf("\nActual: %d\n", addTwoNumbers(1, 2));
                return 1;
            } else {
                printf("Test passed\n");
                return 0;
            }
        }
        `}
    ]
};

// Convert JSON to ExerciseTest instance
const exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);
// Parse JSON and cast to interfaces
const parsedExerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);
    

// compile
const programFilePath = './\\src\\student1\\tests\\main.c';
const testSpecFilePath = "./\\src\\student1\\test-spec.json";

// convert parsedExerciseTest to directories and files
testRunnerRunner(parsedExerciseTest);

// Compile and run tests
parsedExerciseTest.testCases.forEach(testCase => 
        compileAndRun(parsedExerciseTest.language, testCase.code, testCase.testCaseId));    

parsedExerciseTest.testCases.forEach(testCase => {
    compileAndRun(parsedExerciseTest.language, testCase.code, testCase.testCaseId)    

});
//put respsonse JSON, when JSON array.length == parsedExerciseTest.testCases.length send response
