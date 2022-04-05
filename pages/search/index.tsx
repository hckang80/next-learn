import React, { useEffect, useRef, useState, useCallback } from 'react'
import useFunction from '@/hooks/useFunction'
import useStorage from '@/hooks/useStorage'
import SelectedList from '@/components/SelectedList'
import SearchedList from '@/components/SearchedList'

export default function Search() {
  const BASE_URI = 'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'

  const { debounce, request } = useFunction()
  const { getItem, setItem } = useStorage()

  const [keyword, setKeyword] = useState('')

  const [searchedList, setSearchedList] = useState<string[]>([])

  let [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const searchList = async (key = '') => {
    const response = getItem(key) || await request(`${BASE_URI}/languages?keyword=${key}`)
    !getItem(key) && setItem(key, response)
    return response
  }

  const fillList = debounce(async (key: string) => {
    const list = key
      ? await searchList(key)
      : []
    setSearchedList(list)
  }, 500)

  const inputKeyword = useCallback((key: string) => fillList(key), [fillList])

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
    const changedIndex = searchedList.indexOf(item) + 1 !== selectedItemIndex
    changedIndex && setSelectedItemIndex(searchedList.indexOf(item) + 1)
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
    if (event.key === 'Enter') {
      selectedItemIndex && selectList(searchedList[selectedItemIndex - 1])
    }
  }

  const addList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  
  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.addEventListener('keyup', handleList)
    inputEl.current?.focus()
    return () => {
      window.removeEventListener('keyup', handleList)
    }
  })

  return (
    <main className="Search">
      <SelectedList list={selectedList} />

      <form
        onSubmit={addList}
        className="search-form">
        <input
          ref={inputEl}
          type="text"
          placeholder="프로그래밍 언어를 입력하세요."
          className="search-form__input"
          onChange={onChange}
          value={keyword}
        />
      </form>

      {!!searchedList.length &&
        <SearchedList
          list={searchedList}
          currentIndex={selectedItemIndex}
          handler={selectList}
        />
      }
    </main>
  )
}
