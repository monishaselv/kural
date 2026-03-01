const sampleString = 'CHECKING';

const reverseString = (str: string) => {
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}
const reversedOne = reverseString(sampleString);

const reverseString2 = (str: string) => {
    let reverse = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reverse += str[i]
    }
    return reverse;
}