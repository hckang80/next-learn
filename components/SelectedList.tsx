import React from 'react'

type Props = {
  list: string[]
}

function SelectedList({ list }: Props) {
  return (
    <div className="selected-list">
      <ul>
        {list.map((item) => (
          <li
            key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedList
