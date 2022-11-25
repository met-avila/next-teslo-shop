import type { NextPage } from 'next'
import { Typography } from '@mui/material'
import { useProducts } from '../../hooks';
import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';

const KidPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=kid');

    return (
        <ShopLayout title={'Pinner - Niños'} pageDescription='Encuentra los mejores productos para niños'>
            <Typography variant='h1' component='h1'>Niños</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }
        </ShopLayout>
    )
}

export default KidPage