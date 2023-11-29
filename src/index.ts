//import express from "express";
import express = require("express");
import * as bodyParser from "body-parser";
import helmet from "helmet";
//import cors from "cors";
import cors = require("cors");
import { ExerciseTest } from "./lib";
import { runCode } from "./test_runner"
const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
    console.log(req.body);
    //const exerciseTest = req.body as ExerciseTest
    const exerciseTest1 = {
        "language": "c",
        "code": `int addTwoNumbers(int number1, int number2) {
        int sum;
        sum = number1 + number2;
        return sum;
    }
        `,
        "studentID": "67890",
        "testCases": [
            { "testCaseId": 1, "code": ` 
    #include <CUnit/CUnit.h>
    #include <CUnit/Basic.h>
    #include <stdio.h>
    #include <stdlib.h>
    
    void testAddTwoNumbers(void) {
        CU_ASSERT(addTwoNumbers(1, 2) == 3);
    }
    
    int main(void) {
        // Initialize the CUnit test registry
        if (CUE_SUCCESS != CU_initialize_registry()) {
            return CU_get_error();
        }
    
        // Add a suite to the registry
        CU_pSuite suite = CU_add_suite("Suite_1", NULL, NULL);
        if (suite == NULL) {
            CU_cleanup_registry();
            return CU_get_error();
        }
    
        // Add the test function to the suite
        if (CU_add_test(suite, "testAddTwoNumbers", testAddTwoNumbers) == NULL) {
            CU_cleanup_registry();
            return CU_get_error();
        }
    
    
        // Run the tests using the basic interface
        CU_basic_set_mode(CU_BRM_SILENT);
        CU_basic_run_suite(suite);
        
        int num_failures = CU_get_number_of_failures();
    
        // Print only if there are failures
        if (num_failures > 0) {
            printf("\\nTest failed\\n Expected:");
            CU_basic_show_failures(CU_get_failure_list());
    
            printf("\\nActual: %d\\n", addTwoNumbers(1, 2));
        } else {
            printf("Test passed\\n");
        }
    }
            `},
            { "testCaseId": 2, "code": `
    #include <CUnit/CUnit.h>
    #include <CUnit/Basic.h>
    #include <stdio.h>
    #include <stdlib.h>
    
    void testAddTwoNumbers(void) {
        CU_ASSERT(addTwoNumbers(1, 2) == 2);
    }
    
    int main(void) {
        // Initialize the CUnit test registry
        if (CUE_SUCCESS != CU_initialize_registry()) {
            return CU_get_error();
        }
    
        // Add a suite to the registry
        CU_pSuite suite = CU_add_suite("Suite_1", NULL, NULL);
        if (suite == NULL) {
            CU_cleanup_registry();
            return CU_get_error();
        }
    
        // Add the test function to the suite
        if (CU_add_test(suite, "testAddTwoNumbers", testAddTwoNumbers) == NULL) {
            CU_cleanup_registry();
            return CU_get_error();
        }
    
    
        // Run the tests using the basic interface
        CU_basic_set_mode(CU_BRM_SILENT);
        CU_basic_run_suite(suite);
        
        int num_failures = CU_get_number_of_failures();
    
        // Print only if there are failures
        if (num_failures > 0) {
            printf("\\nTest failed\\n Expected:");
            CU_basic_show_failures(CU_get_failure_list());
    
            printf("\\nActual: %d\\n", addTwoNumbers(1, 2));
        } else {
            printf("Test passed\\n");
        }
    }
            `}
        ]
    };
    
    // Convert JSON to ExerciseTest instance
    const exerciseTestJSON = JSON.stringify(exerciseTest1, null, 2);
    
    // Parse JSON and cast to interfaces
    const exerciseTest: ExerciseTest = JSON.parse(exerciseTestJSON);

    if(!exerciseTest)
        return res.status(400).send("All necessary parameters were not provided");
    else if (exerciseTest.code = "")
        return res.status(400).send("No code provided");   
    else if (exerciseTest.language = "")
        return res.status(400).send("No code language provided");
    else if (exerciseTest.studentID = "")
        return res.status(400).send("No student ID provided")
    else if (exerciseTest.testCases.length = 0)
        return res.status(400).send("No tests provided");
    
    runCode(exerciseTest)
    .then(testResults => {
        return res.send(console.log(`Here: ${JSON.stringify(testResults)}`));
    })
    //res.send(testResults)
    res.send("Hello World!");
})


app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
