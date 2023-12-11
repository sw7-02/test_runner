/// <reference types="mocha" />

import { compileAndRun } from "../src/compile_and_run";
import { expect } from "chai";
import {
    ExerciseTest,
    Language,
    TestResponse,
    COMPILATION_ERROR_CODE,
    TEST_PASSED_CODE,
    TEST_FAILED_CODE,
    TIMEDOUT_CODE,
    UNSUPPORTED_LANGUGAGE,
    UNKNOWN_FAILURE_CODE,
} from "../src/lib";
import { testRunnerRunner } from "../src/converter";
import path from "path";
import * as fs from "fs";

const testCodePassed: string = `CU_ASSERT(addTwoNumbers(1, 2) == 3);`;
const testCodeFailed: string = `CU_ASSERT(addTwoNumbers(1, 2) == 4);`;
const testCodeWithSyntaxError: string = `CU_ASSERT(addTwoNumbers(1, 2) == 3);`;

describe("compileAndRun tests", () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, "../testStudent");
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it("should compile and run C code with a passing test case", async function () {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }`,
            testCases: [{ testCaseId: "1", code: testCodePassed }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(TEST_PASSED_CODE).to.equal(response.responseCode);
        expect(response.reason).to.include("Test passed");
    });

    it("should compile and run C code with a failing test case", async function () {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }
                `,
            testCases: [{ testCaseId: "1", code: testCodeFailed }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(TEST_FAILED_CODE).to.equal(response.responseCode);
        expect(response.reason).to.include("Test failed");
    });

    it("should compile and run C code with syntax error", async function () {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: `int addTwoNumbers(int number1, int number2) {
                int sum
                sum = number1 + number2;
                return sum;
            }
                `,
            testCases: [{ testCaseId: "1", code: testCodeWithSyntaxError }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(COMPILATION_ERROR_CODE).to.equal(response.responseCode);
        expect(response.reason).to.include(`error: expected '=', ',', ';',`);
    });

    it("should handle not supported languages", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: "py",
            code: `int addTwoNumbers(int number1, int number2) {
                int sum;
                while(true){
                    sum = number1 + number2;
                }
                return sum;
            }
                `,
            testCases: [{ testCaseId: "1", code: testCodePassed }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(UNSUPPORTED_LANGUGAGE).to.equal(response.responseCode);
        expect(response.reason).to.include(`Unsupported langugage`);
    });

    it("file only contains exercise code template, should fail test cases", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: `int addTwoNumbers(int number1, int number2) {
            }
                `,
            testCases: [{ testCaseId: "1", code: testCodePassed }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(TEST_FAILED_CODE).to.equal(response.responseCode);
        expect(response.reason).to.include(`Test failed`);
    });

    it("empty exercise file, should return compile error", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: ``,
            testCases: [{ testCaseId: "1", code: testCodePassed }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(COMPILATION_ERROR_CODE).to.equal(response.responseCode);
    });

    it("empty test case file, should return compile error", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: ``,
            testCases: [{ testCaseId: "1", code: "" }],
        };

        // creates all directories and files necessary to perform test
        testRunnerRunner(exerciseTest);

        const response: TestResponse = await compileAndRun(
            exerciseTest,
            exerciseTest.testCases[0].testCaseId,
        );

        expect(COMPILATION_ERROR_CODE).to.equal(response.responseCode);
    });
});
