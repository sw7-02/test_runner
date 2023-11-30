import { expect } from 'chai';
import {testRunnerRunner, createFiles, createDirectory} from "../src/converter";
import * as fs from "fs";
import { ExerciseTest, Language } from '../src/lib';
import { beforeEach } from 'mocha';
import path from 'path';

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

describe(' tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        fs.rmSync(directoryPath, { recursive: true });
    });

    it('should create directories and files for the given exerciseTest', () => {
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

       
    });
    // Add more test cases as needed
});

