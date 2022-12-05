import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { FullScreenLoading } from '../components/ui'

import { useProducts } from '../hooks'

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={'Pinner - Home'} pageDescription={'Encuentra los mejores productos de teslo'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2'>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }
    </ShopLayout>
  )
}

export default HomePage
