const { DateTime } = require('luxon')

const getAgencyName = (fileName) =>
  fileName
    .replace(new RegExp('\\d+_'), '')
    .replace(new RegExp('_\\d+'), '')
    .replace('_NULL', '')
    .replace('.pdf', '')

const getDate = (fileName) =>
  DateTime.fromObject({
    year: fileName.replace(new RegExp('_(\\S| )+'), '')
  }).toISO()

const getOrganisationNumber = (fileName) => {
  if (fileName.includes('_NULL')) {
    return '_missing_'
  } else {
    const number = fileName
      .replace(new RegExp('\\d+_(\\S+| )+_'), '')
      .replace('.pdf', '')
    return number.substr(0, 6) + '-' + number.substr(6)
  }
}

const groupAgenciesHelper = (files) => {
  const agencyNames = [
    ...new Set(
      files
        .filter((file) => '.DS_Store' !== file)
        .map((file) => getAgencyName(file))
    )
  ]

  return agencyNames.reduce((obj, name) => ({ ...obj, [name]: [] }), {})
}

const groupAgencies = (files) => {
  const agencyObjectsEmpty = groupAgenciesHelper(files)

  const agencyObjects = files
    .filter((file) => ('.DS_Store' !== file) && ('.gitkeep' !== file))
    .reduce((obj, file) => {
      const agencyName = getAgencyName(file)
      if (obj[agencyName]) {
        obj[agencyName] = [
          ...obj[agencyName],
          {
            id: file,
            agency: agencyName,
            date: getDate(file),
            organisationNumber: getOrganisationNumber(file)
          }
        ]
      } else {
        console.error('Agency not found:', agencyName)
      }
      return obj
    }, agencyObjectsEmpty)

  return Object.keys(agencyObjects)
    .map((key) => agencyObjects[key])
    .reduce((array, innerArray) => [...array, ...innerArray], [])
}

const groupAgenciesForFile = (files) => {
  const agencyObjectsEmpty = groupAgenciesHelper(files)

  return files
    .filter((file) => '.DS_Store' !== file)
    .reduce((obj, file) => {
      const agencyName = getAgencyName(file)
      if (obj[agencyName]) {
        if (obj[agencyName].name) {
          obj[agencyName].date = [...obj[agencyName].date, getDate(file)]
        } else {
          obj[agencyName] = {
            name: agencyName,
            date: [getDate(file)],
            organisationNumber: getOrganisationNumber(file)
          }
        }
        return obj
      } else {
        console.error('Agency not found:', agencyName)
      }
      return obj
    }, agencyObjectsEmpty)
}

module.exports = {
  getAgencyName,
  getDate,
  groupAgencies,
  getOrganisationNumber,
  groupAgenciesForFile
}
