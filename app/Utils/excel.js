const XLSX = require('xlsx')
const _ = require('lodash')

const excel = {
  createWorkbook: function () {
    return XLSX.utils.book_new()
  },
  toSheet: function (arrayOfArrays) {
    return XLSX.utils.aoa_to_sheet(arrayOfArrays)
  },
  readExcelFile: function (
    filePath,
    options = { header: 1, blankrows: false }
  ) {
    console.log(
      'Do readExcelFile | filePath = ',
      filePath,
      '| options',
      options
    )
    return new Promise((resolve, reject) => {
      const wb = XLSX.readFile(filePath, { type: options.type || 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const xlsxData = XLSX.utils.sheet_to_json(ws, options)
      resolve(xlsxData)
    })
  },
  writeExcelFile: async function (
    filePath,
    workbook,
    options = {
      bookType: 'xlsx',
      type: 'binary'
    }
  ) {
    console.log(
      'Do writeExcelFile | filePath = ',
      filePath,
      '| workbook',
      workbook,
      '| options',
      options
    );
    return new Promise((resolve, reject) => {
      const file = XLSX.writeFile(workbook, filePath, {
        bookType: 'xlsx',
        type: 'binary'
      })
      resolve(file)
    })
  }
  // writeExcelFile: async function (
  //   filePath,
  //   data,
  //   options = { header: 1, blankrows: false }
  // ) {
  //   console.log(
  //     'Do writeExcelFile | filePath = ',
  //     filePath,
  //     '| options',
  //     options
  //   )
  //   var wb = XLSX.utils.book_new()
  //   wb.SheetNames.push('raw')
  //   const wsHeader = ['Kiosk Id', 'Type', 'Key 1', 'Data 1', 'Key 2', 'Data 2', 'Key 3', 'Data 3', 'Key 4', 'Data 4', 'Key 5', 'Data 5', 'Timestamp']
  //   const wsContent = _.reduce(data, (result, item) => {
  //     const wsRow = _.compact(_.map(item, (value, key) => {
  //       if (key !== 'id') return value
  //     }))
  //     return [
  //       ...result,
  //       wsRow
  //     ]
  //   }, [])
  //   // return wsContent
  //   var wsData = [wsHeader, ...wsContent] // a row with 2 columns
  //   var ws = XLSX.utils.aoa_to_sheet(wsData)
  //   wb.Sheets['raw'] = ws
  //   return new Promise((resolve, reject) => {
  //     const file = XLSX.writeFile(wb, filePath, {
  //       bookType: 'xlsx',
  //       type: 'binary'
  //     })
  //     resolve(file)
  //   })
  // }
}

module.exports = excel
