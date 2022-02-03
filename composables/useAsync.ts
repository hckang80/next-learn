import { useReducer, useEffect } from 'react'

type LoadingAction = {
  type: 'LOADING'
}

type SuccessAction<T> = {
  type: 'SUCCESS'
  data: T
}

type ErrorAction<T> = {
  type: 'ERROR'
  error: T
}

type AsyncAction<D, E> = LoadingAction | SuccessAction<D> | ErrorAction<E>

export type AsyncState<D, E> = {
  loading: boolean
  data: D | null
  error: E | null
}

function reducer<D, E>(
  state: AsyncState<D, E>,
  action: AsyncAction<D, E>
): AsyncState<D, E> {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      }
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      }
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      }
    default:
      throw new Error('Unhandled action')
  }
}

type Callback<T> = (...args: any) => Promise<T>

function useAsync<D, E, F extends Callback<D>>(
  callback: F,
  params = [],
  deps = []
) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null
  } as AsyncState<D, E>)

  const fetchData =  async (...params: Parameters<F> | never[]) => {
    dispatch({ type: 'LOADING' })
    try {
      const data = await callback(...params)
      dispatch({
        type: 'SUCCESS',
        data
      })
    } catch (e) {
      dispatch({
        type: 'ERROR',
        error: e
      })
    }
  }

  useEffect(() => {
    fetchData(...params)
    // eslint-disable-next-line
  }, deps)
  
  return [state, fetchData] as const
}

export default useAsync
