const { expect } = require('chai');
const child_process = require('child_process');
const fs = require('fs');

describe('Your Code', () => {
  it('should compile and execute code', (done) => {
    const compileCommand = 'gcc -o test test.c';

    const tempFilePath = './test'; 

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
