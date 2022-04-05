import { debounce, set, throttle } from 'lodash'

export const request = async (url = '', options = {}) => {
  try {
    const response = await fetch(url, options)
    if (response.ok) return await response.json()
    throw new Error('HTTP REQUEST FAILED')
  } catch (error) {
    console.error(error)
  }
}

export default () => {
  return {
    debounce,
    request,
    set,
    throttle
  }
}
