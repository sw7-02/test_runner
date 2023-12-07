const UNSUPPORTED_LANGUGAGE = 5;
const UNKNOWN_FAILURE_CODE = 4;
const TIMEDOUT_CODE = 3;
const COMPILATION_ERROR_CODE = 2;
const TEST_FAILED_CODE = 1;
const TEST_PASSED_CODE = 0;

// Enum representing supported programming languages
enum Language {
    C = "c",
}

interface TestResponse {
    testCaseId: string;
    reason: string;
    responseCode: number;
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

export {
    Language,
    TestResponse,
    ExerciseTest,
    UNKNOWN_FAILURE_CODE,
    COMPILATION_ERROR_CODE,
    TEST_PASSED_CODE,
    TEST_FAILED_CODE,
    TIMEDOUT_CODE,
    UNSUPPORTED_LANGUGAGE,
};