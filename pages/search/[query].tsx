import type { NextPage, GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'

import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
    const description = foundProducts ? 'Productos encontrados para' : 'No encontramos ningún producto para';
    return (
        <ShopLayout title={'Pinner - Search'} pageDescription='Encuentra los mejores productos'>
            <Typography variant='h1' component='h1'>Buscar producto</Typography>
            <Box display='flex'>
                <Typography variant='h2' sx={{ mb: 1 }}>{description}</Typography>
                <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
            </Box>
            <ProductList products={products} />
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    if (!query) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        products = await dbProducts.getAllProducts();
    }

    // TODO: retornar otros productos

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
