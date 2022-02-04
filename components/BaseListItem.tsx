import React, { type ReactNode } from 'react'
import Image from 'next/image'

type Props = {
  children?: ReactNode
  image: string
  title: string
}

function BaseListItem ({ children, image, title }: Props) {
  return (
    <li className="main-products__item">
      <label className="main-products__wrap">
        {children}
        <Image
          src={image}
          alt={title}
          layout="fill"
          loading="lazy"
        />
      </label>
    </li>
  )
}

BaseListItem.defaultProps = {
  title: ''
};

export default BaseListItem
