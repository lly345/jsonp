module.exports.formatJsonp = (callbackName, params) => {
    return callbackName + "(" + JSON.stringify(params) + ")";
};
