const genarateCode = (length = 6) => {
    let chars = Math.random().toString(36)
    return chars.substr(chars.length - length).toUpperCase()
}


module.exports = {genarateCode}