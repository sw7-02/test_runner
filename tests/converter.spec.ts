import { expect } from "chai";
import {
    testRunnerRunner,
    createFiles,
    createDirectory,
} from "../src/converter";
import * as fs from "fs";
import { ExerciseTest } from "../src/lib";
import path from "path";

const exerciseTest: ExerciseTest = {
    userId: "testStudent",
    language: "c",
    code: 'console.log("Hello, World!");',
    testCases: [
        {
            testCaseId: "1",
            code: 'console.log("Test case 1");',
        },
    ],
};

describe("testRunnerRunner tests", () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, "../testStudent");
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it("should create directories and files for the given exerciseTest", () => {
        testRunnerRunner(exerciseTest);

        const directoryExists: boolean = fs.existsSync("testStudent");
        const testFileExists: boolean = fs.existsSync(
            "testStudent/exerciseFile.c",
        );
        const testCaseFileExists: boolean = fs.existsSync(
            "testStudent/testFile1.c",
        );

        expect(directoryExists).to.be.true;
        expect(testFileExists).to.be.true;
        expect(testCaseFileExists).to.be.true;
    });
    // Add more test cases as needed
});

describe("createDirectories tests", () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, "../tests/testStudent");
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it("create a new directory", () => {
        const localDirectoryPath = path.join(
            __dirname,
            `../tests/${exerciseTest.userId}`,
        );
        createDirectory(localDirectoryPath);

        expect(fs.existsSync(localDirectoryPath)).to.be.true;
    });

    // TODO: mangler en der laver et directory der allerede findes.
/*
    it('create a new directory that already exists, catch error', () => {
        const localDirectoryPath = path.join(__dirname, `../src/${exerciseTest.userId}`);
        createDirectory(localDirectoryPath);
        
        //expect(fs.existsSync(localDirectoryPath)).to.be.true;


        //expect(createDirectory(localDirectoryPath)).to.(Error(`Directory already exists!`));
        
    });*/
});

describe("createFiles tests", () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, "../tests/testStudent");
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it("create a new file without include", () => {
        const localDirectoryPath = path.join(
            __dirname,
            `../tests/${exerciseTest.userId}.c`,
        );
        createFiles(localDirectoryPath, "");

        expect(fs.existsSync(localDirectoryPath)).to.be.true;
        fs.rmSync(localDirectoryPath);
    });

    it("create a new file with include", () => {
        const localDirectoryPath = path.join(
            __dirname,
            `../tests/${exerciseTest.userId}`,
        );
        createFiles(localDirectoryPath, "", "");

        expect(fs.existsSync(localDirectoryPath)).to.be.true;
        fs.rmSync(localDirectoryPath);
    });
});
