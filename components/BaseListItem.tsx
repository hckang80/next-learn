import React, { type ReactNode } from 'react'
import Image from 'next/image'
import styles from '@/styles/tutorial.module.scss'

type Props = {
  children?: ReactNode
  image: string
  title: string
}

function BaseListItem ({ children, image, title }: Props) {
  return (
    <li className={styles['main-products__item']}>
      <label className={styles['main-products__wrap']}>
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
