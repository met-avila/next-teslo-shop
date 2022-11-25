import type { NextPage } from 'next'
import { Typography } from '@mui/material'
import { useProducts } from '../../hooks';
import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';

const MenPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=men');

    return (
        <ShopLayout title={'Pinner - Hombres'} pageDescription='Encuentra los mejores productos para ellos'>
            <Typography variant='h1' component='h1'>Hombres</Typography>
            <Typography variant='h2'>Productos para ellos</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }
        </ShopLayout>
    )
}

export default MenPage