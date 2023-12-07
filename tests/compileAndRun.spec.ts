/// <reference types="mocha" />

import {compileAndRun} from "../src/compile_and_run";
import { expect } from 'chai';
import { ExerciseTest, Language, TestResponse, COMPILATION_ERROR_CODE, EXECUTION_ERROR_CODE, TEST_PASSED_CODE, TEST_FAILED_CODE, UNSUPPORTED_LANGUGAGE, TIMEDOUT_CODE } from '../src/lib';
import { testRunnerRunner } from "../src/converter";
import path from "path";
import * as fs from "fs";

const testCodePassed: string = ` 
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
                `;

const testCodeFailed: string = ` 
#include <CUnit/CUnit.h>
#include <CUnit/Basic.h>
#include <stdio.h>
#include <stdlib.h>

void testAddTwoNumbers(void) {
    CU_ASSERT(addTwoNumbers(1, 2) == 4);
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
`;

const testCodeWithSyntaxError: string = ` 
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
        return CU_get_error()
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
                `;

describe('compileAndRun tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        if(fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    
    it('should compile and run C code with a passing test case', async function() {
        
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: 
            `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);
      
        expect(`${TEST_PASSED_CODE}`).to.equal(response.responseCode);
        expect(response.reason).to.include('Test passed');
    });
    
    it('should compile and run C code with a failing test case', async function() {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: 
            `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodeFailed}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        expect(`${TEST_FAILED_CODE}`).to.equal(response.responseCode);
        expect(response.reason).to.include('Test failed');
    });


    it('should compile and run C code with syntax error', async function() {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: 
            `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodeWithSyntaxError}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = 
            await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        expect(`${COMPILATION_ERROR_CODE}`).to.equal(response.responseCode);
        expect(response.reason).to.include(`error: expected ';' before '}'`);
    });

/*
    it('should compile and run C code with infinite loop', async function(done) {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: 
            `int addTwoNumbers(int number1, int number2) {
                int sum;
                while(true){
                    sum = number1 + number2;
                }
                return sum;
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        const response: TestResponse = 
            await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        done();

        expect(response.responseCode).to.equal(`${TIMEDOUT_CODE}`);
        expect(response.reason).to.include(`Timed out`);
    });
    */


/*
    it('should handle execution errors', async () => {
        
    });
*/

    it('should handle not supported languages', async () => {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.Python,
            code: 
            `int addTwoNumbers(int number1, int number2) {
                int sum;
                while(true){
                    sum = number1 + number2;
                }
                return sum;
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = 
            await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        expect(`${UNSUPPORTED_LANGUGAGE}`).to.equal(response.responseCode);
        expect(response.reason).to.include(`Unsupported langugage`);
    });

    it('file only contains exercise code template, should fail test cases', async () => {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: 
            `int addTwoNumbers(int number1, int number2) {
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = 
            await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        expect(`${TEST_FAILED_CODE}`).to.equal(response.responseCode);
        expect(response.reason).to.include(`Test failed`);
    });

    it('empty exercise file, should return compile error', async () => {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: ``,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = 
            await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        expect(`${COMPILATION_ERROR_CODE}`).to.equal(response.responseCode);
    });

    it('empty test case file, should return compile error', async () => {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code: ``,
            testCases: [{ "testCaseId": "1", "code": ""}]
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 

        const response: TestResponse = 
            await compileAndRun(exerciseTest, exerciseTest.testCases[0].code, exerciseTest.testCases[0].testCaseId);

        expect(`${COMPILATION_ERROR_CODE}`).to.equal(response.responseCode);
    });

});
