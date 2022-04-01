import React from 'react'

type Props = {
  list: string[],
  currentIndex: number,
  handler: (item: string) => void
}

function SearchedList({ list, currentIndex, handler }: Props) {
  return (
    <div className="searched-list">
      <ul className="suggestion">
        {list.map((item, index) => (
          <li
            className={currentIndex === index + 1 ? 'suggestion__item--selected' : ''}
            key={item}
            onClick={() => handler(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchedList
