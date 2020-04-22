import { useDispatch, useSelector } from 'react-redux'
import { fromJS, List, Map } from 'immutable'
export const useGetLoading = () =>
  useSelector((state) => state.search.get('loading'))

export const useGetLoadingFieldData = () =>
  useSelector((state) => !state.search.get('fieldData'))

export const useGetSetupFailed = () =>
  useSelector((state) => !!state.search.get('setupFailed'))

export const useGetResult = () =>
  useSelector((state) => state.search.get('result'))

export const useCountSearchResult = () =>
  useSelector((state) => (state.search.get('result') || List()).size)

export const useGetTextQuery = () =>
  useSelector(
    (state) =>
      state.form.searchForm &&
      state.form.searchForm.values &&
      state.form.searchForm.values.searchField
  )

export const formChanged = () => {
  const previous = useSelector((state) => state.search.get('previousQuery'))
  const newQuery = fromJS(useSelector((state) => state.searchForm))

  return !previous.equals(newQuery)
}

export const useGetFieldData = () =>
  useSelector((state) => state.search.get('fieldData') ?? Map())

export const useGetQuerySettings = () => useSelector((state) => state.search.get('querySettings'))
