const cuid = require('cuid')

const escapeRegExp = (str) => {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}
const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

const generateUniqueId = () => {
  return cuid.slug()
}

module.exports = {
  escapeRegExp,
  replaceAll,
  generateUniqueId
}
