import React, { useEffect, useState, useCallback } from 'react'
import useAsync, { type AsyncState } from '@/composables/useAsync'
import useFunction from '@/composables/useFunction'
import SelectedList from '@/components/SelectedList'

export default function Search() {
  const BASE_URI = 'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'

  const { debounce, request } = useFunction()

  const [keyword, setKeyword] = useState('')

  const [searchedList, setSearchedList] = useState([])

  let [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const searchList = async (key = '') => {
    const response = await request(`${BASE_URI}/languages?keyword=${key}`)
    return response
  }

  const fillList = debounce(async (key: string) => {
    const list = key
      ? await searchList(key)
      : []
    setSearchedList(list)
  }, 500)

  const inputKeyword = useCallback((key: string) => fillList(key), [])

  const onChange = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(target.value)
    inputKeyword(target.value)
  }

  const [selectedList, setSelectedList] = useState<string[]>([])

  const removeDuplicateItem = (item = '') => {
    selectedList.splice(selectedList.indexOf(item), 1)
  }

  const selectList = (item = '') => {
    selectedList.includes(item) && removeDuplicateItem(item)
    setSelectedList([...selectedList, item].slice(-5))
  }

  const handleList = (event: KeyboardEvent) => {
    if (!searchedList.length) return
    if (event.key === 'ArrowDown') {
      const index = selectedItemIndex === searchedList.length
        ? 1
        : selectedItemIndex + 1
      setSelectedItemIndex(index)
    }
    if (event.key === 'ArrowUp') {
      const index = selectedItemIndex <= 1
        ? searchedList.length
        : selectedItemIndex - 1
      setSelectedItemIndex(index)
    }
  }
  
  useEffect(() => {
    window.addEventListener('keyup', handleList)
    return () => {
      window.removeEventListener('keyup', handleList)
    }
  })

  return (
    <main className="Search">
      <SelectedList list={selectedList} />
      <form className="search-form">
        <input
          type="text"
          placeholder=""
          className="search-form__input"
          onChange={onChange}
          value={keyword}
        />
      </form>

      {!!searchedList.length && (<div className="searched-list">
        <ul className="suggestion">
          {searchedList.map((item, index) => (
            <li
              className={selectedItemIndex === index + 1 ? 'suggestion__item--selected' : ''}
              key={item}
              onClick={() => selectList(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>)}
    </main>
  )
}
