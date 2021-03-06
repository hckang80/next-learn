
import React, { useState } from 'react'
import styles from '@/styles/tutorial.module.scss'
import useAsync, { type AsyncState } from '@/hooks/useAsync'
import useFunction from '@/hooks/useFunction'
import Layout from '@/components/Layout'
import BaseListItem from '@/components/BaseListItem'

export type Categories =
  'all' |
  'electronics' |
  'jewelery' |
  'men\'s clothing' |
  'women\'s clothing'

export interface Product {
  category: Categories
  description: string
  id: number
  image: string
  price: number
  rating: {
    count: number
    rate: number
  }
  title: string
}

async function getProducts() {
  const response = await Promise.all([
    fetch('https://fakestoreapi.com/products/categories').then(res => res.json() as Promise<Categories[]>),
    fetch('https://fakestoreapi.com/products').then(res => res.json() as Promise<Product[]>),
  ])
  return response
}

function Tutorial() {
  const [state, refetch] = useAsync(getProducts)
  const { set } = useFunction()

  const { loading, data, error } = state as AsyncState<[Categories[], Product[]], unknown>

  const [categories = [], products = []] = data || []

  const ALL = 'all'

  const allCategories: Categories[] = [ALL, ...categories]

  const [selectedCategory, setCategory] = useState(ALL)

  const selectCategory = (category: Categories) => {
    selectedCategory !== category && setCategory(category)
  }

  const filteredProducts = selectedCategory !== ALL
    ? products.filter(({ category }) => category === selectedCategory)
    : products

  const [checkedProducts, setProduct] = useState<number[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target
    const getValues = checked
      ? [...checkedProducts, +value]
      : checkedProducts.filter(id => id !== +value)
    setProduct(getValues)
  }

  const saveMyStyles = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    set(localStorage, 'myStyles', JSON.stringify(checkedProducts))
  }

  return (
    <Layout className={styles['tutorial']}>
      <article className={styles['select-my-style']}>
        <header className={styles['select-my-style__header']}>
          <h1 hidden>
            내 스타일 선택하기
          </h1>
          <div className={styles['icon-heart']}></div>
          <p>
            <strong className="block">좋아하는 스타일을<br /> 알려주세요.</strong>
            매일 취향에 맞는 상품을 찾아올게요!
          </p>
        </header>

        {!loading && (<ul className={styles['main-categories']}>
          {allCategories?.map(category => (
            <li
              className={`${styles['main-categories__item']} ${selectedCategory === category ? styles['is-active'] : ''}`}
              key={category}>
              <button onClick={() => selectCategory(category)}>
                {category}
              </button>
            </li>
          ))}
        </ul>)}

        <form onSubmit={saveMyStyles}>
          <ul className={styles['main-products']}>
            {filteredProducts.map(({
              id,
              image,
              title
            }) => (
              <BaseListItem
                key={id}
                image={image}
                title={title}>
                <input type="checkbox" onChange={onChange} value={id} />
                <span className={styles['backdrop']}>
                  <div className={`icon-heart ${styles['icon-heart']}`}></div>
                </span>
              </BaseListItem>
            ))}
          </ul>
          <div className={styles['head-button']}>
            <button>선택완료</button>
          </div>
        </form>
      </article>
    </Layout>
  )
}

export default Tutorial
