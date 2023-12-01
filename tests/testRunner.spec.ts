import { expect } from 'chai';
import {testRunnerRunner, createFiles, createDirectory} from "../src/converter";
import * as fs from "fs";
import { ExerciseTest, Language } from '../src/lib';
import { beforeEach } from 'mocha';
import path from 'path';
import { mkdirSync } from 'fs';
import { deleteDirectory } from '../src/test_runner';
import sinon from 'sinon';

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

describe('deleteDirectory tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        if(fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    
    it('Delete empty directory', async () => {
        const directoryPath = `src/${exerciseTest.studentID}`;

        // creates directory necessary to perform the test
        mkdirSync(directoryPath);
        expect(fs.existsSync(directoryPath)).to.be.true;
        
        await deleteDirectory(directoryPath);
        expect(fs.existsSync(directoryPath)).to.be.false;
        
    });

    it('Delete directory containing files', async () => {
        const directoryPath = `src/${exerciseTest.studentID}`;

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest); 
        expect(fs.existsSync(directoryPath)).to.be.true;

        await deleteDirectory(directoryPath);
        expect(fs.existsSync(directoryPath)).to.be.false;
    });

    /*it('Unable to delete directory', () => {
        deleteDirectory(`src/student1`);
       
    });*/

    it('should log an error message when fs.rm encounters an error', async () => {
        const directoryPath = `src/${exerciseTest.studentID}`;
        const errorMessage = 'Simulated error';
    
        // Stub fs.rm to simulate an error
        const fsRmStub = sinon.stub(fs, 'rm');
        fsRmStub.yields(new Error(errorMessage));
    
        // Stub console.error to capture the error message
        const consoleErrorStub = sinon.stub(console, 'error');
    
        // Call the function under test
        await deleteDirectory(directoryPath);
    
        // Assertions
        expect(fsRmStub.calledOnceWith(directoryPath, { recursive: true })).to.be.true;
        expect(consoleErrorStub.calledOnceWith(`Error deleting directory ${directoryPath}:${errorMessage}`)).to.be.true;
    
        // Restore stubs
        fsRmStub.restore();
        consoleErrorStub.restore();
      });

});

