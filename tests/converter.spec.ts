import { expect } from 'chai';
import {testRunnerRunner, createFiles, createDirectory} from "../src/converter";
import * as fs from "fs";
import { ExerciseTest } from '../src/lib';
import { beforeEach } from 'mocha';
import path from 'path';

const exerciseTest: ExerciseTest = {
    studentID: 'testStudent',
    language: 'c',
    code: 'console.log("Hello, World!");',
    testCases: [
        {
            testCaseId: "1",
            code: 'console.log("Test case 1");',
        },
    ],
};

describe('testRunnerRunner tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        fs.rmSync(directoryPath, { recursive: true });
    });

    it('should create directories and files for the given exerciseTest', () => {
        testRunnerRunner(exerciseTest);

        // Add assertions to check if directories and files are created as expected
        // You may use the fs module or other utilities to check the file system
        // Example:
        const directoryExists: boolean = fs.existsSync('src/testStudent');
        const testFileExists: boolean = fs.existsSync('src/testStudent/exerciseFile.c');
        const testCaseFileExists: boolean = fs.existsSync('src/testStudent/tests/testFile1.c');

        expect(directoryExists).to.be.true;
        expect(testFileExists).to.be.true;
        expect(testCaseFileExists).to.be.true;
    });
    // Add more test cases as needed
});

describe('createDirectories tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });
    
    it('create a new directory', () => {
        const localDirectoryPath = path.join(__dirname, `../src/${exerciseTest.studentID}`);
        createDirectory(localDirectoryPath);

        expect(fs.existsSync(localDirectoryPath)).to.be.true;
    });

    // TODO: mangler en der laver et directory der allerede findes.

    /*
    it('create a new directory that already exists, catch error', () => {
        const localDirectoryPath = path.join(__dirname, `../src/${exerciseTest.studentID}`);
        createDirectory(localDirectoryPath);
        //expect(fs.existsSync(localDirectoryPath)).to.be.true;


        //expect(createDirectory(localDirectoryPath)).to.(Error(`Directory already exists!`));
        
    });
    */

});

describe('createFiles tests', () => {
    afterEach(function () {
        const directoryPath = path.join(__dirname, '../src/testStudent');
        if (fs.existsSync(directoryPath))
            fs.rmSync(directoryPath, { recursive: true });
    });

    it('create a new file without include', () => {
        const localDirectoryPath = path.join(__dirname, `../src/${exerciseTest.studentID}.c`);
        createFiles(localDirectoryPath, "");

        expect(fs.existsSync(localDirectoryPath)).to.be.true;
        fs.rmSync(localDirectoryPath);
    });
    

    it('create a new file with include', () => {
        const localDirectoryPath = path.join(__dirname, `../src/${exerciseTest.studentID}`);
        createFiles(localDirectoryPath, "", "");

        expect(fs.existsSync(localDirectoryPath)).to.be.true;
        fs.rmSync(localDirectoryPath);
    });
})
