#include <stdio.h>

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s <number1> <number2>\n", argv[0]);
        return 1;
    }

    int number1, number2, sum;

    sscanf(argv[1], "%d", &number1);
    sscanf(argv[2], "%d", &number2);

    // calculate the sum
    sum = number1 + number2;

    printf("%d + %d = %d\n", number1, number2, sum);
    return 0;
}