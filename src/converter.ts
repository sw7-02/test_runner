import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { ExerciseTest } from "./lib";

// Creates a directory for all resources.
function testRunnerRunner(exerciseTest: ExerciseTest) {
    const { userId: studentID, language, code, testCases } = exerciseTest;
    createDirectory(studentID);
    createFiles(`${studentID}/exerciseFile.${language}`, code);
    testCases.forEach((testCase) => {
        const inputString = testCase.code;
        const regex = /CU_[^\(]*\(([^)]+)\)/;
        const match = inputString.match(regex);
        const functionName = match ? match[1] + `)` : null;

        createFiles(
            `${studentID}/testFile${testCase.testCaseId}.${language}`,
            `
#include "exerciseFile.${language}"

#include <CUnit/CUnit.h>
#include <CUnit/Basic.h>
#include <stdio.h>
#include <stdlib.h>

void testFunc(void) {
    ${testCase.code}
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
    if (CU_add_test(suite, "testFunc", testFunc) == NULL) {
        CU_cleanup_registry();
        return CU_get_error();
    }

    ${testCase.code.split("CU_")[0]}

    // Run the tests using the basic interface
    CU_basic_set_mode(CU_BRM_SILENT);
    CU_basic_run_suite(suite);
    
    int num_failures = CU_get_number_of_failures();

    // Print only if there are failures
    if (num_failures > 0) {
        printf("\\nTest failed\\n Expected:");
        CU_basic_show_failures(CU_get_failure_list());

        printf("\\nActual: %d\\n", ${functionName});
    } else {
        printf("Test passed\\n");
    }
}`,
        );
        testCase.code = readFileSync(
            `${studentID}/testFile${testCase.testCaseId}.${language}`,
            "utf-8",
        );
    });
}

function createDirectory(directory: string): void {
    const path = `${directory}`;
    if (!existsSync(path)) {
        mkdirSync(path);
        console.log(`Directory ${path} created!`);
    } else console.log(`Directory ${path} already exists!`);
}

function createFiles(
    directoryPath: string,
    content: string,
    include?: string,
): void {
    if (existsSync(directoryPath)) {
        console.log(`File "${directoryPath}" already exists.`);
        return;
    } else {
        if (include != undefined)
            appendFileSync(directoryPath, `${include}\n`, "utf8");

        appendFileSync(directoryPath, `${content}\n`, "utf8");
    }
}

export { testRunnerRunner, createFiles, createDirectory };
