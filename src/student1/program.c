#include <stdio.h>
int main() {
    int number1=2, number2=2, sum="";
    
    printf("Enter two integers: ");
    //scanf("%d %d", &number1, &number2);

    // calculate the sum
    sum = number1 + number2;
    
    printf("%d + %d = %d", number1, number2, sum);
    return 0;
}