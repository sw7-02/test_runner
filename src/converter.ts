import { appendFile } from "node:fs";
import * as fs from "fs";

interface tasks {
    code: string;
    language: string;
    exerciseID: string;
}

interface tests {
    code: string;
}

let task: tasks;
let test: tests;

try {
    const taskFile = fs.readFileSync("./taskFile.json", "utf8");
    task = JSON.parse(taskFile);
} catch (err) {
    console.log("Error reading taskFile.json:", err);
    throw err;
}

try {
    const testFile = fs.readFileSync("./testFile.json", "utf8");
    test = JSON.parse(testFile);
} catch (err) {
    console.log("Error reading testFile.json:", err);
    throw err;
}

appendFile(
    `opgaveFile.${task.language}`,
    `${task.code}`,
    "utf8",
    function (err) {
        if (err) {
            console.log(err);
            // append failed
        } else {
            console.log(`opgaveFile.${task.language} was appended!`);
            // done
        }
    },
);

appendFile(`testFile.${task.language}`, `${test.code}`, "utf8", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`testFile.${task.language} was appended!`);
    }
});
