#include "src/67890/exerciseFile.c"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void test_program1() {
    int result = addTwoNumbers(1,2);

    if(result != 2) {
        printf("FAILED: test_program1(): 1+2 should be 2");
        printf("%d", result);
    } else {
        printf("great success");
    }
}

int main(void) {test_program1();} 
        
