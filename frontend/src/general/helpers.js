export const getAgencies = () =>
  [].map((obj) => obj.name.charAt(0).toUpperCase() + obj.name.slice(1)).sort()

export const getOrganisationNumbers = () =>
  []
    .map((key) => data[key].oganisationNumber)
    .filter((organisationNumber) => '_missing_' !== organisationNumber)
    .sort()

export const getYear = () => [
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019'
]
