import { appendFile } from "node:fs";
import * as fs from "fs";

interface exerciseAPI {
    lang: string;
    code: string;
    exerciseID: string;
    studentID: string;
}

interface tests {
    lang: string,
    code: string;
}

function createDirectory(directory: string): void {
    if (!fs.existsSync(`src/${directory}`)) {
        fs.mkdirSync(`src/${directory}`);
        console.log(`Directory src/${directory} created!`);
    }
    else {
        console.log(`Directory src/${directory} already exists!`);
    }
}

const createFiles = (directoryPath: string, content: string): void => {
    appendFile(directoryPath, content, "utf8", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`file was appended!`);
        }
    });
}

//example json converted to typescript
const exerciseData: exerciseAPI = {
    lang: "c",
    code: "printf('exercise');",
    exerciseID: "123456",
    studentID: "7890124"
};

const testData: tests = {
    lang: "c",
    code: "printf('test');"
};

const main_code = `
#include "src/${exerciseData.studentID}/exerciseFile.${exerciseData.lang}" 
#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#include "src/${exerciseData.studentID}/tests/testFile.${testData.lang}" 
int main(void) 
{tests_run_all();}`;

createDirectory(exerciseData.studentID);
createDirectory(`${exerciseData.studentID}/tests`);
createFiles(`src/${exerciseData.studentID}/exerciseFile.${exerciseData.lang}`, `${exerciseData.code}`);
createFiles(`src/${exerciseData.studentID}/tests/testFile.${testData.lang}`, `${testData.code}`);
createFiles(`src/${exerciseData.studentID}/tests/main.${testData.lang}`, `${main_code}`);

