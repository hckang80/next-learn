
import React, { useState } from 'react'
import useAsync, { type AsyncState } from '@/composables/useAsync'

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

export default function MyItems() {
  const [state, refetch] = useAsync(getProducts);

  const { loading, data, error } = state as AsyncState<[Categories[], Product[]], unknown>

  const [categories = [], products = []] = data || []

  const ALL = 'all'

  const allCategories: Categories[] = [ALL, ...categories]

  const [selectedCategory, setCategory] = useState(ALL);

  const selectCategory = (category: Categories) => {
    selectedCategory !== category && setCategory(category)
  }

  const filteredProducts = selectedCategory !== ALL
    ? products.filter(({ category }) => category === selectedCategory)
    : products

  // const checkedProducts = ref<number[]>([])
  // const [checkedProducts, setProduct] = useState([]);

  // const saveMyStyles = () => {
  //   set(localStorage, 'myStyles', JSON.stringify(checkedProducts))
  //   router.push('/tutorial/my-store')
  // }

  // const listComponent = (allCategories: Categories[]) => {
  //   return allCategories.map((category) => {
  //     return (<li key={category}>{category}</li>);
  //   });
  // };
  return (
    <article className="select-my-style">
      <header className="select-my-style__header">
        <h1 hidden>
          내 스타일 선택하기
        </h1>
        <div className="icon-heart"></div>
        <p>
          <strong>좋아하는 스타일을<br /> 알려주세요.</strong>
          매일 취향에 맞는 상품을 찾아올게요!
        </p>
      </header>

      <ul className="main-categories">
        {allCategories?.map(category => (
          <li
            className={`main-categories__item${selectedCategory === category && ' is-active'}`}
            key={category}>
            <button onClick={() => selectCategory(category)}>
              {category}
            </button>
          </li>
        ))}
      </ul>

      <form>
        <ul className="main-products">
          {filteredProducts.map(product => (
            <li key={product.id}>
              {product.title}
            </li>
          ))}
        </ul>
        <div className="head-button">
          <button>선택완료</button>
        </div>
      </form>
    </article>
  )
}
