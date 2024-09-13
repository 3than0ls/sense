// in the far distant future that I do not care about, this will be able to be adjusted to any currency
const numberUnit = '$'

export default function toCurrencyString(
    number: number,
    showPositive: boolean = false
) {
    const out = number.toFixed(2)
    if (number < 0) {
        return out[0] + numberUnit + out.slice(1)
    } else {
        if (showPositive) {
            return '+' + numberUnit + out
        }
        return numberUnit + out
    }
}
