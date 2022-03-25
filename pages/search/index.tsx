import React, { useState } from 'react'
import useAsync, { type AsyncState } from '@/composables/useAsync'
import useFunction from '@/composables/useFunction'

export default function Search() {
  const BASE_URI = 'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'

  const { request } = useFunction()

  const [keyword, setKeyword] = useState('')

  const [searchedList, setSearchedList] = useState([])

  const inputKeyword = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(target.value)
    const response = await request(`${BASE_URI}/languages?keyword=${target.value}`)
    setSearchedList(response)
    return response
  }

  return (
    <main className="Search">
      <div className="selected-list"></div>
      <form className="search-form">
        <input
          type="text"
          placeholder=""
          className="search-form__input"
          onChange={inputKeyword}
          value={keyword}
        />
      </form>

      {!!searchedList.length && (<div className="searched-list">
        <ul>
          {searchedList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>)}
    </main>
  )
}
