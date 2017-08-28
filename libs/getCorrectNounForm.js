let getCorrectNounForm = function (singleForm, amount) {
    return singleForm + ((amount === 1) ? '' : 's');
};

module.exports = getCorrectNounForm;