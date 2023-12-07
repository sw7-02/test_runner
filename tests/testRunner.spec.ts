/*import { expect } from 'chai';
import {testRunnerRunner, createFiles, createDirectory} from "../src/converter";
import * as fs from "fs";
import { COMPILATION_ERROR_CODE, ExerciseTest, Language, TEST_FAILED_CODE, TEST_PASSED_CODE } from '../src/lib';
import { beforeEach } from 'mocha';
import path from 'path';
import { mkdirSync } from 'fs';
import { deleteDirectory, runAllTests, runCode } from '../src/test_runner';
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


describe('runAllTests tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        if(fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

/*
    it("throw error from deleting directory that doesn't exist", async () => {
        const exerciseTest: ExerciseTest = {
            studentID: 'testStudent',
            language: Language.C,
            code:`int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }`,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        //await deleteDirectory("../src/test123");
        //expect(runAllTests(exerciseTest))
        expect(await runAllTests(exerciseTest)).to.throw(Error(`Error deleting directory src/${exerciseTest.studentID}: }`))
    });
    */
/*
});

describe('runCode tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        if(fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it('running tests on passing test', async () => {
        const exerciseTest: ExerciseTest = {
            userId: 'testStudent',
            language: Language.C,
            code:`int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }`,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(`${TEST_PASSED_CODE}`);
        expect(testResults[0].reason).to.include('Test passed');
    });

    it('running tests on failing test', async () => {
        const exerciseTest: ExerciseTest = {
            userId: 'testStudent',
            language: Language.C,
            code:`int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }`,
            testCases: [{ "testCaseId": "1", "code": testCodeFailed}]
        };

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(`${TEST_FAILED_CODE}`);
        expect(testResults[0].reason).to.include('Test failed');
    });

    it('running tests on passing test, with syntax error, should return compilation error code', async function() {
        const exerciseTest: ExerciseTest = {
            userId: 'testStudent',
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

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(`${COMPILATION_ERROR_CODE}`);
        expect(testResults[0].reason).to.include(`error: expected ';' before '}'`);
    });

    it('running tests on passing test, with syntax error, should handle not supported languages', async () => {
        const exerciseTest: ExerciseTest = {
            userId: 'testStudent',
            language: "py",
            code: 
            `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }
                `,
            testCases: [{ "testCaseId": "1", "code": testCodePassed}]
        };

        const testResults = await runCode(exerciseTest);
    

        //expect(testResults[0].responseCode).to.equal(`${UNSUPPORTED_LANGUGAGE}`);
        expect(testResults[0].reason).to.include(`Unsupported langugage`);
    });

});

/*

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
/*
    it('should log an error message when fs.rm encounters an error', async () => {
        const directoryPath = `src/${exerciseTest.studentID}`;
        const errorMessage = 'Simulated error';
    
        // Stub removeDirectoryWrapper to simulate an error
        const removeDirectoryWrapperStub = sinon.stub().callsArgWith(1, new Error(errorMessage));
    
        // Replace fs.rm with the wrapper function
        sinon.replace(fs, 'rm', removeDirectoryWrapperStub);
    
        // Stub console.error to capture the error message
        const consoleErrorStub = sinon.stub(console, 'error');
    
        // Call the function under test
        await deleteDirectory(directoryPath);
    
        // Assertions
        expect(removeDirectoryWrapperStub.calledOnceWith(directoryPath)).to.be.true;
        expect(consoleErrorStub.calledOnceWith(`Error deleting directory ${directoryPath}:${errorMessage}`)).to.be.true;
    
        // Restore stubs
        removeDirectoryWrapperStub.restore();
        consoleErrorStub.restore();
    });
*/
/*
});
*/