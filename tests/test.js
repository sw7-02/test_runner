const { expect } = require('chai');
const child_process = require('child_process');
const fs = require('fs');

describe('Test 1', () => {
  it('should compile and execute code', (done) => {
    const compileCommand = 'gcc -o test1 test1.c';

    const tempFilePath = './test1'; 

    child_process.exec(compileCommand, (compileError) => {
      if (compileError) {
        return done(compileError);
      }

      // Execute the compiled code
      child_process.execFile(tempFilePath, (executionError, stdout, stderr) => {
        if (executionError) {
          return done(executionError);
        }

        // Perform assertions based on your expectations
        expect(stdout).to.contain('Hello world!'); 

        // Clean up the temporary files after execution
        fs.unlinkSync(tempFilePath);

        // Add more cleanup steps if needed

        done();
      });
    });
  });
});


describe('Test 2', () => {
    it('should not compile', (done) => {
        const compileCommand = 'gcc -o test2 test2.c';

        child_process.exec(compileCommand, (compileError, stderr) => {
            if (compileError) {
                expect(compileError).to.exist;
                expect(compileError.message).to.contain('error: ‘x’ is used uninitialized');

                done();
            }
        });
    });
});
