import fs from "fs";
//import * as fs from "fs";//Lukas skal køre det sådan her

const COMPILATION_ERROR_CODE = 16;
const EXECUTION_ERROR_CODE = 69;
const UNSUPPORTED_LANGUGAGE = -2;
const TIMEDOUT_CODE = -1;
const TEST_PASSED_CODE = 0;
const TEST_FAILED_CODE = 1;

// Enum representing supported programming languages
enum Language {
    TypeScript = 'typescript',
    JavaScript = 'javascript',
    Python = 'py',
    C = 'c',
}

interface TestResponse {
    test_case_id: string
    reason: string
    responseCode: string
}

interface ExerciseTest {
    language: string;
    code: string;
    studentID: string;
    testCases: TestCase[];
}

interface TestCase {
    testCaseId: string;
    code: string;
}

export {Language, TestResponse, ExerciseTest, COMPILATION_ERROR_CODE, EXECUTION_ERROR_CODE, TEST_PASSED_CODE, UNSUPPORTED_LANGUGAGE, TEST_FAILED_CODE, TIMEDOUT_CODE}