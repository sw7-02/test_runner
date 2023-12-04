import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { ExerciseTest } from "./lib";

// Creates a directory for all resources.
function testRunnerRunner(exerciseTest: ExerciseTest) {
    const { userId: studentID, language, code, testCases } = exerciseTest;
    createDirectory(studentID);
    createFiles(`${studentID}/exerciseFile.${language}`, code);
    testCases.forEach((testCase) => {
        createFiles(
            `${studentID}/testFile${testCase.testCaseId}.${language}`,
            testCase.code,
            `#include "exerciseFile.${language}"`,
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
    if (include) appendFileSync(directoryPath, `${include}\n`, "utf8");

    appendFileSync(directoryPath, `${content}\n`, "utf8");
}

export { testRunnerRunner };
