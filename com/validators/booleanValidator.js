module.exports = function roleValidator(boolean, value = 'boolean'){
    if (typeof boolean !== 'boolean') throw new TypeError(`invalid ${value} type`)
}