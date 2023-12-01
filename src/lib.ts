import fs from "fs";

const UNKNOWN_FAILURE_CODE = 4;
const TIMEDOUT_CODE = 3;
const COMPILATION_ERROR_CODE = 2;
const TEST_FAILED_CODE = 1;
const TEST_PASSED_CODE = 0;

// Enum representing supported programming languages
enum Language {
    C = 'c',
}

interface TestResponse {
    testCaseId: string
    reason: string
    responseCode: number
}

interface ExerciseTest {
    language: string;
    code: string;
    userId: string;
    testCases: TestCase[];
}

interface TestCase {
    testCaseId: string;
    code: string;
}

function readFromFile(filePath: string): string {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        process.exit(1);
    }
}

export {Language, TestResponse, ExerciseTest, readFromFile, UNKNOWN_FAILURE_CODE, COMPILATION_ERROR_CODE, TEST_PASSED_CODE, TEST_FAILED_CODE, TIMEDOUT_CODE}