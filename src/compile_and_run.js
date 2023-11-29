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
exports.Language = exports.readFromFile = exports.compileAndRun = void 0;
var fs = require("fs");
var child_process = require("child_process");
var util_1 = require("util");
// Enum representing supported programming languages
var Language;
(function (Language) {
    Language["TypeScript"] = "typescript";
    Language["JavaScript"] = "javascript";
    Language["Python"] = "py";
    Language["C"] = "c";
})(Language || (exports.Language = Language = {}));
var exec = (0, util_1.promisify)(child_process.exec);
var execFile = (0, util_1.promisify)(child_process.execFile);
function readFromFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch (error) {
        process.exit(1);
    }
}
exports.readFromFile = readFromFile;
// Function to compile and run code based on the detected language
function compileAndRun(exerciseTest, testCode, test_case_id) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var compileCommand, runCommand, executableExtension, tempFilePath, executableFilePath, response;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                tempFilePath = "src/".concat(exerciseTest.studentID, "/temp").concat(test_case_id, ".").concat(exerciseTest.language);
                                executableFilePath = "src/".concat(exerciseTest.studentID, "/temp").concat(test_case_id);
                                switch (exerciseTest.language) {
                                    case Language.TypeScript:
                                        compileCommand = 'tsc';
                                        runCommand = 'node';
                                        break;
                                    case Language.JavaScript:
                                        compileCommand = ''; // No compilation needed for JavaScript
                                        runCommand = 'node';
                                        break;
                                    case Language.Python:
                                        compileCommand = ''; // No compilation needed for Python
                                        runCommand = 'python';
                                        break;
                                    case Language.C:
                                        compileCommand = "gcc -o ".concat(executableFilePath, " ").concat(tempFilePath, " -lcunit");
                                        runCommand = "./".concat(executableFilePath);
                                        //executableExtension = '.exe';
                                        break;
                                    default:
                                        console.error("Unsupported language: ".concat(exerciseTest.language));
                                        reject("Unsupported Language: ".concat(exerciseTest.language));
                                        return [2 /*return*/, process.exit(1)];
                                }
                                fs.writeFileSync(tempFilePath, testCode, 'utf-8');
                                response = {
                                    test_case_id: "",
                                    reason: "",
                                    responseCode: ""
                                };
                                // Compile the code
                                return [4 /*yield*/, exec(compileCommand).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: 
                                                // Execute the compiled code
                                                return [4 /*yield*/, execFile(runCommand).then(function (res) {
                                                        var result = res.stdout.substring(res.stdout.indexOf("Test"));
                                                        //TODO: better logic for identifieng failure and passes
                                                        if (result.includes("Test failed")) {
                                                            response = {
                                                                test_case_id: test_case_id,
                                                                reason: result,
                                                                responseCode: "1"
                                                            };
                                                        }
                                                        else if (result.includes("Test passed")) {
                                                            response = {
                                                                test_case_id: test_case_id,
                                                                reason: result,
                                                                responseCode: "0"
                                                            };
                                                        }
                                                        else {
                                                            response = {
                                                                test_case_id: test_case_id,
                                                                reason: result,
                                                                responseCode: "Unknown"
                                                            };
                                                        }
                                                        console.log(result);
                                                        resolve(response);
                                                    }, function (reason) {
                                                        console.log("\nExecution stderr: ".concat(reason.stderr, "\n"));
                                                        var respsonseError = {
                                                            test_case_id: test_case_id,
                                                            reason: reason.stderr,
                                                            responseCode: "69",
                                                        };
                                                        resolve(respsonseError);
                                                    })];
                                                case 1:
                                                    // Execute the compiled code
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, function (reason) {
                                        console.error("Compilation error: ".concat(reason.stderr));
                                        var respsonseError = {
                                            test_case_id: test_case_id,
                                            reason: reason.stderr,
                                            responseCode: "16",
                                        };
                                        resolve(respsonseError);
                                    })];
                            case 1:
                                // Compile the code
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.compileAndRun = compileAndRun;
