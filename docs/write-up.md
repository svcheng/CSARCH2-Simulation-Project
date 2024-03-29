# Write-up Analysis

More work had to be done to get the "true" values (without the exponent) of the binary inputs. Javascript treats inputs as strings, but unlike with decimal inputs, there are no built-in functions that can convert a binary number (represented as a string) to its actual value.

Another problem encountered was deciding how to handle invalid inputs. Since there is no way to restrict the keys the user enters, it is possible for them to enter values that are clearly not numbers, such as "abcd". In the end, we decided to allow the user to enter these values and click the convert button, but it would be considered as a NaN value and the IEEE representation shown would reflect that.

We also encountered an issue when the number entered was too big. Javascript would automatically convert the value into "Infinity" or "-Infinity" instead of the actual number. We had to handle these cases and ensure they returned the correct IEEE representation.