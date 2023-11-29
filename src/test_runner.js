"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = void 0;
var fs = require("fs");
var converter_1 = require("./converter");
var compile_and_run_1 = require("./compile_and_run");
// receive API call (with JSON object)
// TODO: Replace exerciseTest example with real data (some sort of handling)
var exerciseTest = {
    "language": "c",
    "code": "int addTwoNumbers(int number1, int number2) {\n    int sum;\n    sum = number1 + number2;\n    return sum;\n}\n    ",
    "studentID": "67890",
    "testCases": [
        { "testCaseId": 1, "code": " \n#include <CUnit/CUnit.h>\n#include <CUnit/Basic.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nvoid testAddTwoNumbers(void) {\n    CU_ASSERT(addTwoNumbers(1, 2) == 3);\n}\n\nint main(void) {\n    // Initialize the CUnit test registry\n    if (CUE_SUCCESS != CU_initialize_registry()) {\n        return CU_get_error();\n    }\n\n    // Add a suite to the registry\n    CU_pSuite suite = CU_add_suite(\"Suite_1\", NULL, NULL);\n    if (suite == NULL) {\n        CU_cleanup_registry();\n        return CU_get_error();\n    }\n\n    // Add the test function to the suite\n    if (CU_add_test(suite, \"testAddTwoNumbers\", testAddTwoNumbers) == NULL) {\n        CU_cleanup_registry();\n        return CU_get_error();\n    }\n\n\n    // Run the tests using the basic interface\n    CU_basic_set_mode(CU_BRM_SILENT);\n    CU_basic_run_suite(suite);\n    \n    int num_failures = CU_get_number_of_failures();\n\n    // Print only if there are failures\n    if (num_failures > 0) {\n        printf(\"\\nTest failed\\n Expected:\");\n        CU_basic_show_failures(CU_get_failure_list());\n\n        printf(\"\\nActual: %d\\n\", addTwoNumbers(1, 2));\n    } else {\n        printf(\"Test passed\\n\");\n    }\n}\n        " },
        { "testCaseId": 2, "code": "\n#include <CUnit/CUnit.h>\n#include <CUnit/Basic.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nvoid testAddTwoNumbers(void) {\n    CU_ASSERT(addTwoNumbers(1, 2) == 2);\n}\n\nint main(void) {\n    // Initialize the CUnit test registry\n    if (CUE_SUCCESS != CU_initialize_registry()) {\n        return CU_get_error();\n    }\n\n    // Add a suite to the registry\n    CU_pSuite suite = CU_add_suite(\"Suite_1\", NULL, NULL);\n    if (suite == NULL) {\n        CU_cleanup_registry();\n        return CU_get_error();\n    }\n\n    // Add the test function to the suite\n    if (CU_add_test(suite, \"testAddTwoNumbers\", testAddTwoNumbers) == NULL) {\n        CU_cleanup_registry();\n        return CU_get_error();\n    }\n\n\n    // Run the tests using the basic interface\n    CU_basic_set_mode(CU_BRM_SILENT);\n    CU_basic_run_suite(suite);\n    \n    int num_failures = CU_get_number_of_failures();\n\n    // Print only if there are failures\n    if (num_failures > 0) {\n        printf(\"\\nTest failed\\n Expected:\");\n        CU_basic_show_failures(CU_get_failure_list());\n\n        printf(\"\\nActual: %d\\n\", addTwoNumbers(1, 2));\n    } else {\n        printf(\"Test passed\\n\");\n    }\n}\n        " }
    ]
};
// Convert JSON to ExerciseTest instance
var exerciseTestJSON = JSON.stringify(exerciseTest, null, 2);
// Parse JSON and cast to interfaces
var parsedExerciseTest = JSON.parse(exerciseTestJSON);
function runCode(parsedExerciseTest) {
    return __awaiter(this, void 0, void 0, function () {
        function deleteDirectory(directoryPath) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs.promises.rm(directoryPath, { recursive: true })];
                        case 1:
                            _a.sent();
                            console.log("Directory ".concat(directoryPath, " deleted successfully."));
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Error deleting directory ".concat(directoryPath, ": ").concat(error_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        // Compile and run tests
        function runAllTests() {
            return __awaiter(this, void 0, void 0, function () {
                var testResults, _i, _a, testCase, _b, _c, error_2;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            testResults = [];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 9]);
                            _i = 0, _a = parsedExerciseTest.testCases;
                            _d.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            testCase = _a[_i];
                            _c = (_b = testResults).push;
                            return [4 /*yield*/, (0, compile_and_run_1.compileAndRun)(parsedExerciseTest, testCase.code, testCase.testCaseId)];
                        case 3:
                            _c.apply(_b, [(_d.sent())]);
                            if (testResults[testResults.length - 1].responseCode == ("16" || "69")) {
                                throw new Error("Test failed");
                            }
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 9];
                        case 6:
                            error_2 = _d.sent();
                            console.error("OUTER ERROR HAS BEEN FOUND: " + error_2);
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, deleteDirectory("src/".concat(parsedExerciseTest.studentID))];
                        case 8:
                            _d.sent();
                            //console.log(testResults);
                            return [2 /*return*/, testResults];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, converter_1.testRunnerRunner)(parsedExerciseTest);
                    return [4 /*yield*/, runAllTests()];
                case 1: 
                // Call the async function
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.runCode = runCode;
//let testResults = runCode(parsedExerciseTest);
//console.log(`Here: ${testResults}`)
runCode(parsedExerciseTest)
    .then(function (testResults) {
    console.log("Here: ".concat(JSON.stringify(testResults)));
});
