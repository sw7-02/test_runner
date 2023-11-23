import { appendFile } from "node:fs";
import * as fs from "fs";

interface exerciseAPI {
    lang: string;
    code: string;
    exerciseID: string;
    studentID: string;
}

interface tests {
    code: string;
}


function createDirectory(exerciseAPI: exerciseAPI, tests: tests): void {
    if (!fs.existsSync(exerciseAPI.studentID)) {
        fs.mkdirSync(exerciseAPI.studentID);
        console.log(`Directory ${exerciseAPI.studentID} created!`);
    }
    else {
        console.log(`Directory ${exerciseAPI.studentID} already exists!`);
    }

    createFiles(exerciseAPI, tests);

}

const createFiles = (exerciseAPI: exerciseAPI, tests: tests): void => {
    appendFile(`${exerciseAPI.studentID}/exerciseFile.${exerciseAPI.lang}`, `${exerciseAPI.code}`, "utf8", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`exerciseFile.${exerciseAPI.lang} was appended!`);
        }
    });

    appendFile(`${exerciseAPI.studentID}/tests/testFile.${exerciseAPI.lang}`, `${tests.code}`, "utf8", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`testFile.${exerciseAPI.lang} was appended!`);
        }
    });
}


//example json converted to typescript
const exerciseData: exerciseAPI = {
    lang: "typescript",
    code: "console.log('Hello, World!');",
    exerciseID: "123456",
    studentID: "789012"
};

const testData: tests = {
    code: "console.log('Hello, World!');",
};

createDirectory(exerciseData, testData);

