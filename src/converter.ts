import { appendFile } from "node:fs";
import * as fs from "fs";

interface tasks {
    code: string;
    lang: string;
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

appendFile(`taskFile.${task.lang}`, `${task.code}`, "utf8", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`taskFile.${task.lang} was appended!`);
    }
});

appendFile(`testFile.${task.lang}`, `${test.code}`, "utf8", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`testFile.${task.lang} was appended!`);
    }
});
