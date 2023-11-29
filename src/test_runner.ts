import * as fs from "fs";
import { testRunnerRunner } from "./converter";
import { ExerciseTest, TestResponse } from "./lib";
import { compileAndRun } from "./compile_and_run";

async function runCode (parsedExerciseTest: ExerciseTest) {
    // convert parsedExerciseTest to directories and files
    testRunnerRunner(parsedExerciseTest);  

    // Call the async function
    return await runAllTests(parsedExerciseTest);
}

// Compile and run tests
async function runAllTests(parsedExerciseTest: ExerciseTest) : Promise<TestResponse[]> {
    const testResults: TestResponse[] = [];
    try {
        for (const testCase of parsedExerciseTest.testCases) {
            testResults.push((
                await compileAndRun(parsedExerciseTest, testCase.code, testCase.testCaseId)));
            
            if (testResults[testResults.length - 1].responseCode == ("16" || "69")) {
                throw new Error("Test failed");
            }
        }
    } catch (error) {
        console.error("OUTER ERROR HAS BEEN FOUND: " + error);
    } finally {
        deleteDirectory(`src/${parsedExerciseTest.studentID}`);
        //console.log(testResults);
        return testResults;
    }
}

function deleteDirectory(directoryPath: string): void{
    fs.rm(directoryPath, { recursive:true }, (err) => { 
        if(err){ 
            console.error(`Error deleting directory ${directoryPath}:` + err.message); 
            return;
        } 
        console.log(`Directory ${directoryPath} deleted successfully.`); 
    });
}

export {runCode};
