const char_string = '0123456789/*+-.';

export const max_time_steps = 5;
const num_chars = char_string.length;

export const vectorize = (expression) => {
    let x = [[]]; // 2D array
    for (let i = 0; i < max_time_steps; i++) {
        x[i] = [];
        for (let j = 0; j < num_chars; j++) {
            x[i][j] = 0;
        }
    } // initialize with 0s

    let x_remaining = max_time_steps - expression.length;
    for (let i = 0; i < expression.length; i++) {
        x[x_remaining + i][char_string.indexOf(expression[i])] = 1;
    }
    for (let i = 0; i < x_remaining; i++) {
        x[i][char_string.indexOf('0')] = 1;
    }

    return x;
};

export const devectorize = (input) => {
    let res = [];
    for (let i = 0; i < input.length; i++) {
        res.push(input[i].indexOf(Math.max(...input[i])));
    }
    return res.map((x) => char_string[x]).join('');
};

export const strip = (str_val) => {
    let res = '';
    let flag = false;
    let pointAlreadyFound = false;
    for (let i = 0; i < str_val.length; i++) {
        if (pointAlreadyFound && str_val[i] == '.') {
            continue;
        } else if (str_val[i] == '.') {
            pointAlreadyFound = true;
        }

        if (!flag && str_val[i] == '0') {
            continue;
        }

        if (['+', '-', '*', '/'].includes(str_val[i])) {
            flag = false;
        } else {
            flag = true;
        }

        res += str_val[i];
    }

    if (res.startsWith('.')) res = '0' + res;
    return res;
};