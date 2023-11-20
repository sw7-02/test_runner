import { appendFile } from "node:fs";
import * as fs from "fs";

//import * as opgFile from "./opgFile.json";
//import * as testFile from "./testFile.json";

//let opg: opgave = JSON.parse(opgFile);
//let test: tests = JSON.parse(testFile);

interface opgave {
    kode: string;
    sprog: string;
    exerciseID: string;
}

interface tests {
    kode: string;
}

let opg: opgave;
let test: tests;

try {
    const opgFile = fs.readFileSync("./opgFile.json", "utf8");
    opg = JSON.parse(opgFile);
} catch (err) {
    console.log("Error reading opgFile.json:", err);
    throw err;
}

try {
    const testFile = fs.readFileSync("./testFile.json", "utf8");
    test = JSON.parse(testFile);
} catch (err) {
    console.log("Error reading testFile.json:", err);
    throw err;
}

appendFile(`opgaveFile.${opg.sprog}`, `${opg.kode}`, "utf8", function (err) {
    if (err) {
        console.log(err);
        // append failed
    } else {
        console.log(`opgaveFile.${opg.sprog} was appended!`);
        // done
    }
});

appendFile(`testFile.${opg.sprog}`, `${test.kode}`, "utf8", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`testFile.${opg.sprog} was appended!`);
    }
});
