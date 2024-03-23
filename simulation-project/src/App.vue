<script setup>
import { ref, reactive } from 'vue'

const tab = ref('base-2')
const results_tab = ref('result')
const showResults = ref(false);

// Validation rules
const rules = {
  required: (value) => !!value || 'Field is required.',
  isNumber: (value) => !isNaN(value) || 'Field must be a number.',
  isBinary: (value) => /^[01]+$/.test(value) || 'Field must be a binary value (0 or 1).'
}

// Data
const userData = reactive({
  binary: {
    number: '',
    exponent: '',
  },
  decimal: {
    number: '',
    exponent: '',
  }
})  

const convertedResult = ref({
  sb: '',
  ePrime: '',
  fractional: '',
  hex: ''
})


// Functions
const toBinary = (str) => Number(str).toString(2)
const binaryToHex = (str) => {
    let hex = ''
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

const convertToIEEE = async function (num, exp, binary) {
    if (binary) {
        for (let i = 0; i < exp; i++) {
            num += '0'
        }
        num = parseInt(num, 2).toString()
        exp = '0'
    }
  
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
    convertedResult.value = {sb, ePrime, fractional, hex: binaryToHex(sb + ePrime + fractional)}
    console.log(convertedResult)
    showResults.value = true;
}

// Save to file
const saveToFile = (convertedResult) => {
  const text = `Binary: ${convertedResult.sb} ${convertedResult.ePrime} ${convertedResult.fractional}\nHex: 0x${convertedResult.hex}`;
  const element = document.createElement('a');
  const file = new Blob([text], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = 'result.txt';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
  console.log('Saved to file');
}

</script>

<template>
  <div class="text-h3 ma-3 text-white mt-n15 mb-5">
    Binary-64 Floating Point Simulator
  </div>

  <v-card title="" class="w-75 ma-4 pl-4 pr-4 pb-4" variant="elevated" color="var(--vt-c-white)">
    <v-tabs v-model="tab" direction="horizontal">
      <v-tab value="base-2">
        Binary/Base-2
      </v-tab>

      <v-tab value="base-10">
        Decimal/Base-10
      </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="h-100">

      <!-- Base 2 -->
      <v-window-item value="base-2" class="mb-4">
        <v-card class="h-100 w-auto mt-4 pa-4 d-flex flex-column justify-end" variant="outlined">

          <div class="d-flex justify-space-between">
            <!-- Number -->
            <VTextField class="mb-4 w-75" label="Enter the binary/base 2 number you would like to convert"
              variant="outlined" clearable :rules="[rules.required, rules.isNumber, rules.isBinary]"
              v-model="userData.binary.number"
              hint="Decimal or base 2 numbers are numbers that are represented using 0-1. For example, 01001 is a decimal number." />

            <div class="text-h5 mt-3 mr-3 ml-3">
              x2
            </div>

            <!-- Exponent -->
            <VTextField class="mb-4 w-25" label="Exponent" variant="outlined" :rules="[rules.required, rules.isNumber]"
              v-model="userData.binary.exponent" clearable />
          </div>

          <!-- Convert Button -->
          <div class="d-flex justify-end">
            <v-btn color="var(--vt-c-accent2)">
              <div class="font-weight-bold"
                @click.prevent="convertToIEEE(userData.binary.number, userData.binary.exponent, true)">Convert</div>
            </v-btn>
          </div>
        </v-card>
      </v-window-item>


      <!-- Base 10 -->
      <v-window-item value="base-10" class="mb-4">
        <v-card class="h-100 w-auto mt-4 pa-4 d-flex flex-column justify-end" variant="outlined">

          <!-- Number -->
          <div class="d-flex justify-space-between">
            <VTextField class="mb-4 w-50" label="Enter the decimal/base 10 number you would like to convert"
              variant="outlined" clearable :rules="[rules.required, rules.isNumber]" v-model="userData.decimal.number"
              hint="Decimal or base 10 numbers are numbers that are represented using 0-9. For example, 1234 is a decimal number." />

            <div class="text-h5 mt-3 mr-3 ml-3">
              x10
            </div>

            <!-- Exponent -->
            <VTextField class="mb-4 w-25" label="Exponent" variant="outlined" clearable
              v-model="userData.decimal.exponent" :rules="[rules.required, rules.isNumber]" />
          </div>

          <!-- Convert Button -->
          <div class="d-flex justify-end">
            <v-btn color="var(--vt-c-accent2)"
              @click.prevent="convertToIEEE(userData.decimal.number, userData.decimal.exponent, false)">
              <div class="font-weight-bold">Convert</div>
            </v-btn>
          </div>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>

  <!-- Result -->
  <v-card title="" class="w-75 ma-4 pl-4 pr-4 pb-4" variant="elevated" color="var(--vt-c-white)">
    <v-tabs v-model="results_tab" direction="horizontal">
      <v-tab value="result">
        Result
      </v-tab>
    </v-tabs>

    <v-window v-model="results_tab" class="h-100">
      <v-window-item value="result" class="mb-4 mt-4">
        <v-card class="w-auto pa-4 d-flex flex-column justify-end" variant="outlined">

          <!-- Binary -->
          <div class="d-flex">
            <div class="text-h6">Binary</div>
            <div class="mt-1 ml-4">
              {{ convertedResult.sb }}
              {{ convertedResult.ePrime }}
              {{ convertedResult.fractional }}
            </div>
          </div>

          <div class="d-flex">
            <div class="text-h6">Hex</div>
            <div class="mt-1 ml-4">
              0x{{ convertedResult.hex }}
            </div>
          </div>


        </v-card>

        <div class="d-flex justify-end mt-4">

          <!-- Save Button -->
          <v-btn v-if="showResults" color="var(--vt-c-accent2)" @click.prevent="saveToFile(convertedResult)">
            <div class="font-weight-bold">Save to .txt</div>
          </v-btn>
        </div>

        <div class="mt-3">
          <!-- TODO: Add steps -->

        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style>
.text-white {
  color: var(vt-c-white);
}
</style>
