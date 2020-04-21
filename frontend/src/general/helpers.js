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

export const getPathToPDF = (element) =>
  element && `${S3_ADDRESS}${element.get('index')}/${element.get('id')}`

export const sortElements = ({ firstElement, secondElement, filterType }) => {
  if (filterType === 'Agency') {
    return firstElement
      .get('agency')
      .localeCompare(secondElement.get('agency'))
  } else if (filterType === 'Organisation number') {
    return firstElement
      .get('organisationNumber')
      .localeCompare(secondElement.get('organisationNumber'))
  } else if (filterType === 'Year') {
    return firstElement
      .get('year')
      .localeCompare(secondElement.get('year'))
  } else if (filterType === 'Score') {
    return firstElement.get('score') - secondElement.get('score')
  } else {
    return firstElement
      .get('agency')
      .localeCompare(secondElement.get('agency'))
  }
}