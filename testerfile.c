// #include <CUnit/CUnit.h>
// #include <CUnit/Basic.h>
// #include <stdio.h>
// #include <stdlib.h>
// #include <string.h>
// #include "src/student1/program.c"



// int main(void) {
//     CU_ASSERT(addTwoNumbers(1,2) == 3);
// }

#include <CUnit/CUnit.h>
#include <CUnit/Basic.h>
#include <stdio.h>
#include <stdlib.h>
#include "src/student1/program.c"

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
    CU_basic_set_mode(CU_BRM_VERBOSE);
    CU_basic_run_tests();
    
    int num_failures = CU_get_number_of_failures();

    // Print only if there are failures
    if (num_failures > 0) {
        printf("\nTest failed\n");
        CU_basic_show_failures(CU_get_failure_list());
    } else {
        printf("All tests passed\n");
    }

    CU_pFailureRecord failure = CU_get_failure_list();

    if   (failure == NULL){
        printf("\n12312\n");
    } else {
        printf("\n123123123\n");
    }
    
    //printf("\n %s\n", CU_get_failure_list());

    // Clean up the test registry
    CU_cleanup_registry();

    return 0;
}