
const decimalFactor = 10 ** 18;

module.exports.phtToWei = (ethAmount) => {
    return ethAmount * decimalFactor
};

module.exports.weiToPht = (weiAmount) => {
    return (weiAmount / decimalFactor).toFixed(2)
};