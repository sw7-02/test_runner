#include <stdio.h>
#pragma GCC diagnostic error "-Wuninitialized"


int main() {
    int x;
    printf("The value of x is: %d\n", x);
    return 0;
}