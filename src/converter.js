"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRunnerRunner = void 0;
var node_fs_1 = require("node:fs");
var fs = require("fs");
function createDirectory(directory) {
    if (!fs.existsSync("src/".concat(directory))) {
        fs.mkdirSync("src/".concat(directory));
        console.log("Directory src/".concat(directory, " created!"));
    }
    else {
        console.log("Directory src/".concat(directory, " already exists!"));
    }
}
var createFiles = function (directoryPath, content, include) {
    if (include)
        (0, node_fs_1.appendFileSync)(directoryPath, "".concat(include, "\n"), "utf8");
    (0, node_fs_1.appendFileSync)(directoryPath, "".concat(content, "\n"), "utf8");
};
function testRunnerRunner(exerciseTest) {
    createDirectory(exerciseTest.studentID);
    createDirectory("".concat(exerciseTest.studentID, "/tests"));
    createFiles("src/".concat(exerciseTest.studentID, "/exerciseFile.").concat(exerciseTest.language), "".concat(exerciseTest.code));
    exerciseTest.testCases.forEach(function (testCase) {
        createFiles("src/".concat(exerciseTest.studentID, "/tests/testFile").concat(testCase.testCaseId, ".").concat(exerciseTest.language), "".concat(testCase.code), "#include \"exerciseFile.".concat(exerciseTest.language, "\""));
        testCase.code = (0, node_fs_1.readFileSync)("src/".concat(exerciseTest.studentID, "/tests/testFile").concat(testCase.testCaseId, ".").concat(exerciseTest.language), "utf-8");
    });
}
exports.testRunnerRunner = testRunnerRunner;
