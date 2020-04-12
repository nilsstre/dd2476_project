import data from './data/data.json'

export const getAgencies = () => Object.keys(data).map((name) => name.charAt(0).toUpperCase() + name.slice(1)).sort()

export const getOrganisationNumbers = () =>
  Object.keys(data)
    .map((key) => data[key].oganisationNumber)
    .filter((oganisationNumber) => '_missing_' !== oganisationNumber)
    .sort()

export const getYear = () => ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
