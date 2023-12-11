import { assert, expect } from "chai";
import { testRunnerRunner } from "../src/converter";
import * as fs from "fs";
import {
    COMPILATION_ERROR_CODE,
    ExerciseTest,
    Language,
    TEST_FAILED_CODE,
    TEST_PASSED_CODE,
    UNSUPPORTED_LANGUGAGE,
} from "../src/lib";
import path from "path";
import { deleteDirectory, runAllTests, runCode } from "../src/test_runner";

const testCodePassed: string = `CU_ASSERT(addTwoNumbers(1, 2) == 3);`;

const testCodeFailed: string = `CU_ASSERT(addTwoNumbers(1, 2) == 4);`;

const testCodeWithSyntaxError: string = `CU_ASSERT(addTwoNumbers(1, 2) == 3);`;

describe("runAllTests tests", () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, "../testStudent");
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it("should execute runAllTests successfully test", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: `int addTwoNumbers(int number1, int number2) {
                return number1 + number2;
            }`,
            testCases: [{ testCaseId: "1", code: testCodePassed }],
        };

        try {
            testRunnerRunner(exerciseTest);
            await runAllTests(exerciseTest);
        } catch (error: any) {
            expect(error.message).to.empty;
        }
    });

    it("should reach the catch block in deleteDirectory", async () => {
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
        const directoryPath = `testStudent`;
        try {
            await runAllTests(exerciseTest);
        } catch (error: any) {
            expect(error.message).to.equal(
                `Error deleting directory testStudent: Error: ENOENT: no such file or directory, lstat '${directoryPath}'`,
            );
        }
    });

    it("throw error from deleting directory that doesn't exist", async () => {
        const directoryPath = `../testStudent`;


        try {
            await deleteDirectory("../testStudent");
            assert.fail("The deletion should have thrown an error");
        } catch (error: any) {
            expect(error.message).to.equal(
                `ENOENT: no such file or directory, lstat '${directoryPath}'`,
            );
        }
    });
});

describe("runCode tests", () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, "../testStudent");
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it("running tests on passing test", async () => {
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

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(TEST_PASSED_CODE);
        expect(testResults[0].reason).to.include("Test passed");
    });

    it("running tests on failing test", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: Language.C,
            code: `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }`,
            testCases: [{ testCaseId: "1", code: testCodeFailed }],
        };

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(TEST_FAILED_CODE);
        expect(testResults[0].reason).to.include("Test failed");
    });

    it("running tests on passing test, with syntax error, should return compilation error code", async function () {
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

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(COMPILATION_ERROR_CODE);
        expect(testResults[0].reason).to.include(
            `error: expected ‘=’, ‘,’, ‘;’`,
            
        );
    });

    it("running tests on passing test, with syntax error, should handle not supported languages", async () => {
        const exerciseTest: ExerciseTest = {
            userId: "testStudent",
            language: "py",
            code: `int addTwoNumbers(int number1, int number2) {
                int sum;
                sum = number1 + number2;
                return sum;
            }`,
            testCases: [{ testCaseId: "1", code: testCodePassed }],
        };

        const testResults = await runCode(exerciseTest);

        expect(testResults[0].responseCode).to.equal(UNSUPPORTED_LANGUGAGE);
        expect(testResults[0].reason).to.include(`Unsupported langugage`);
    });
});
