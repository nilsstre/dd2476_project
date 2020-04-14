import config from 'config'
import { List } from 'immutable'
const S3_ADDRESS = config.S3_ADDRESS

export const getAgencies = (fieldData) =>
  (fieldData || List())
    .map(
      (element) =>
        element
          .get('name')
          .charAt(0)
          .toUpperCase() + element.get('name').slice(1)
    )
    .sort()
    .toJS()

export const getOrganisationNumbers = (fieldData) =>
  (fieldData || List())
    .map((element) => element.get('organisationNumber'))
    .filter((organisationNumber) => '_missing_' !== organisationNumber)
    .sort()
    .toJS()

export const getYear = (years) => (years || List()).sort().toJS()

export const getPathToPDF = (element) =>
  element && `${S3_ADDRESS}${element.get('index')}/${element.get('id')}`
