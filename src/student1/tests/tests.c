void test_print(const char *message) {
    printf("%s", message);
}

// Tests

void test_program1() {
    int result = addTwoNumbers(1,1);

    printf("success");
    if(result != 2) {
        test_print("FAILED: test_program1(): 1+1 should be 2, ACR:");
        printf("%d", result);
    }

}

// Run all
void tests_run_all() {
    test_program1();
}