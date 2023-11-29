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
//import express from "express";
var express = require("express");
var bodyParser = require("body-parser");
var helmet_1 = require("helmet");
//import cors from "cors";
var cors = require("cors");
var test_runner_1 = require("./test_runner");
var app = express();
// Call middlewares
app.use(cors());
app.use((0, helmet_1.default)());
app.use(bodyParser.json());
app.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exerciseTest1, exerciseTestJSON, exerciseTest;
    return __generator(this, function (_a) {
        console.log(req.body);
        exerciseTest1 = {
            "language": "c",
            "code": "int addTwoNumbers(int number1, int number2) {\n        int sum;\n        sum = number1 + number2;\n        return sum;\n    }\n        ",
            "studentID": "67890",
            "testCases": [
                { "testCaseId": 1, "code": " \n    #include <CUnit/CUnit.h>\n    #include <CUnit/Basic.h>\n    #include <stdio.h>\n    #include <stdlib.h>\n    \n    void testAddTwoNumbers(void) {\n        CU_ASSERT(addTwoNumbers(1, 2) == 3);\n    }\n    \n    int main(void) {\n        // Initialize the CUnit test registry\n        if (CUE_SUCCESS != CU_initialize_registry()) {\n            return CU_get_error();\n        }\n    \n        // Add a suite to the registry\n        CU_pSuite suite = CU_add_suite(\"Suite_1\", NULL, NULL);\n        if (suite == NULL) {\n            CU_cleanup_registry();\n            return CU_get_error();\n        }\n    \n        // Add the test function to the suite\n        if (CU_add_test(suite, \"testAddTwoNumbers\", testAddTwoNumbers) == NULL) {\n            CU_cleanup_registry();\n            return CU_get_error();\n        }\n    \n    \n        // Run the tests using the basic interface\n        CU_basic_set_mode(CU_BRM_SILENT);\n        CU_basic_run_suite(suite);\n        \n        int num_failures = CU_get_number_of_failures();\n    \n        // Print only if there are failures\n        if (num_failures > 0) {\n            printf(\"\\nTest failed\\n Expected:\");\n            CU_basic_show_failures(CU_get_failure_list());\n    \n            printf(\"\\nActual: %d\\n\", addTwoNumbers(1, 2));\n        } else {\n            printf(\"Test passed\\n\");\n        }\n    }\n            " },
                { "testCaseId": 2, "code": "\n    #include <CUnit/CUnit.h>\n    #include <CUnit/Basic.h>\n    #include <stdio.h>\n    #include <stdlib.h>\n    \n    void testAddTwoNumbers(void) {\n        CU_ASSERT(addTwoNumbers(1, 2) == 2);\n    }\n    \n    int main(void) {\n        // Initialize the CUnit test registry\n        if (CUE_SUCCESS != CU_initialize_registry()) {\n            return CU_get_error();\n        }\n    \n        // Add a suite to the registry\n        CU_pSuite suite = CU_add_suite(\"Suite_1\", NULL, NULL);\n        if (suite == NULL) {\n            CU_cleanup_registry();\n            return CU_get_error();\n        }\n    \n        // Add the test function to the suite\n        if (CU_add_test(suite, \"testAddTwoNumbers\", testAddTwoNumbers) == NULL) {\n            CU_cleanup_registry();\n            return CU_get_error();\n        }\n    \n    \n        // Run the tests using the basic interface\n        CU_basic_set_mode(CU_BRM_SILENT);\n        CU_basic_run_suite(suite);\n        \n        int num_failures = CU_get_number_of_failures();\n    \n        // Print only if there are failures\n        if (num_failures > 0) {\n            printf(\"\\nTest failed\\n Expected:\");\n            CU_basic_show_failures(CU_get_failure_list());\n    \n            printf(\"\\nActual: %d\\n\", addTwoNumbers(1, 2));\n        } else {\n            printf(\"Test passed\\n\");\n        }\n    }\n            " }
            ]
        };
        exerciseTestJSON = JSON.stringify(exerciseTest1, null, 2);
        exerciseTest = JSON.parse(exerciseTestJSON);
        if (!exerciseTest)
            return [2 /*return*/, res.status(400).send("All necessary parameters were not provided")];
        else if (exerciseTest.code = "")
            return [2 /*return*/, res.status(400).send("No code provided")];
        else if (exerciseTest.language = "")
            return [2 /*return*/, res.status(400).send("No code language provided")];
        else if (exerciseTest.studentID = "")
            return [2 /*return*/, res.status(400).send("No student ID provided")];
        else if (exerciseTest.testCases.length = 0)
            return [2 /*return*/, res.status(400).send("No tests provided")];
        (0, test_runner_1.runCode)(exerciseTest)
            .then(function (testResults) {
            return res.send(console.log("Here: ".concat(JSON.stringify(testResults))));
        });
        //res.send(testResults)
        res.send("Hello World!");
        return [2 /*return*/];
    });
}); });
app.listen(3000, function () {
    console.log("Server started on port 3000!");
});
