const { localStorage: storage } = globalThis

const getItem = (key = ''): unknown => {
  try {
    const value = storage.getItem(key)
    return value ? JSON.parse(value) : ''
  } catch {
    return ''
  }
}

const setItem = (key = '', value: unknown) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
  }
}

const removeItem = (key = '') => {
  try {
    storage.removeItem(key)
  } catch {
  }
}

export default () => {
  return {
    storage,
    getItem,
    setItem,
    removeItem
  }
}
