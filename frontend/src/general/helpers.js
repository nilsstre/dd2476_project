import config from 'config'
import { List } from 'immutable'
const S3_ADDRESS = config.S3_ADDRESS

export const getAgencies = (fieldData) =>
  (fieldData || List())
    .map((element) => element.charAt(0).toUpperCase() + element.slice(1))
    .sort()
    .toJS()

export const getOrganisationNumbers = (fieldData) =>
  (fieldData || List())
    .filter((organisationNumber) => '_missing_' !== organisationNumber)
    .sort()
    .toJS()

export const getYears = (years) =>
  (years || List())
    .map((year) => year.toString())
    .sort()
    .toJS()

export const getPathToPDF = (fileName) => `${S3_ADDRESS}arsredovisningar/${encodeURI(fileName)}`
