import React, { FC, useMemo, useState } from 'react'
import NextLink from 'next/link'
import { Box, Card, Chip, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'

import { IProduct } from '../../interfaces'

interface Props extends React.PropsWithChildren {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {

    const [isHovered, setIsHovered] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    const productImage = useMemo(() => {
        let img1 = product.images[0];
        let img2 = product.images[1];
        img1 = img1.startsWith('http') ? img1 : `/products/${img1}`;
        img2 = img2.startsWith('http') ? img2 : `/products/${img2}`;
        
        return isHovered
            ? img1
            : img2
    }, [isHovered, product.images])

    return (
        <Grid
            item xs={6}
            sm={4}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                    <Link>
                        <CardActionArea>
                            {
                                product.inStock === 0 &&
                                (
                                    <Chip
                                        color='primary'
                                        label='No hay disponibles'
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                                    />
                                )
                            }

                            <CardMedia
                                component='img'
                                className='fadeIn'
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>
        </Grid>
    )
}
