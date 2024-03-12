const toBinary = (str) => Number(str).toString(2)
const binaryToHex = (str) => {
    hex = ''
    for (let i=0; i < str.length; i+= 4) {
        // if (i % 16 === 0 && i > 0) {
        //     hex += ' '
        // }
        hex += parseInt(str.substr(i, 4), 2).toString(16)
    }
    return hex.toUpperCase()
}
const zeroes = (n) => '0'.repeat(n)
const ones = (n) => '1'.repeat(n)

// converts a number in decimal to binary normalized to 1.f
function normalize(num) {
    let e
    num = toBinary(num)
    if (num == 'Infinity'|| num == '-Infinity') {
        return {
            'mantissa': '1.0', // f in 1.f
            'exponent': 9999
        }
    }

    if (!num.includes('.')) {
        num = num + '.'
    } 
    if (num.charAt(0) === '-') {
        num = num.substr(1)
    }

    num = num.split('.')
    let whole = num[0]
    let fractional = num[1]

    if (whole.length > 1) {
        e = whole.length - 1 
        num = whole.substr(1) + fractional
    } 
    else if (whole === '0') {
        let ind = fractional.indexOf('1')

        e = -1 * (ind + 1) 
        num = fractional.substr(ind + 1)
    }
    else {
        e = 0
        num = fractional
    }

    return {
        'mantissa': num, // f in 1.f
        'exponent': e
    }
}

function convertToIEEE(num, exp) {
    let sb
    let ePrime
    let fractional
    
    sb = num.charAt(0) === '-' ? '1' : '0'
    // Special case: NaN
    if (isNaN(Number(num)) || isNaN(Number(exp))) {
        sb = '0'
        ePrime = ones(11)
        fractional = '01' + zeroes(50)
    }   
    // Special case: 0
    else if (Number(num) === 0) {
        ePrime = zeroes(11)
        fractional = zeroes(52)
    } else {
        num = String(Number(num) * Math.pow(10, Number(exp)))
        let normalized = normalize(num)

        // Special case: denomalized
        if (normalized.exponent < -1022) {
            ePrime = zeroes(11)
            fractional = zeroes(-1022 - normalized.exponent - 1) + '1' + normalized.mantissa
        } 
        // Special case: infinity
        else if (normalized.exponent > 1023) {
            ePrime = ones(11)
            fractional = zeroes(52)
        } 
        // Normal Case 
        else {
            ePrime = toBinary(normalized.exponent + 1023)
            ePrime = zeroes(11 - ePrime.length) + ePrime
            fractional = normalized.mantissa
        }
    }
    
    fractional = fractional.substr(0, 52)
    fractional = fractional + zeroes(Math.max(52 - fractional.length, 0)) // pad to exactly 52 digits
    return sb + ePrime + fractional
}

document.getElementById("btn").addEventListener('click', (e) => {
    let decimalInput = document.getElementById('decimalInput')
    let decimalExponent = document.getElementById('decimalExponent')
    
    // if (!decimalInput.checkValidity() || !decimalExponent.checkValidity()) {
    //     return 
    // }

    converted = convertToIEEE(decimalInput.value, decimalExponent.value)
    console.log(converted, converted.length)
    console.log(binaryToHex(converted).length)
    document.getElementById('decimalAnswer').textContent = binaryToHex(converted)
})
