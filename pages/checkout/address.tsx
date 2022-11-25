import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'
import { countries } from '../../utils/countries'
import { CartContext } from '../../context'

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const AddressPage = () => {
    const router = useRouter();
    const { updateShippingAddress, shippingAddress } = useContext(CartContext);
    const { reset, register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onFormSubmit = (data: FormData) => {
        updateShippingAddress(data);
        router.push('/checkout/summary');
    }

    useEffect(() => {
        reset({ ...shippingAddress });
    }, [shippingAddress, reset])

    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
            <form onSubmit={handleSubmit(onFormSubmit)} noValidate >
                <Typography variant='h1' component='h1'>Dirección</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant='filled'
                            fullWidth
                            {
                            ...register('firstName', {
                                required: 'Este nombre es requerido',
                            })
                            }
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellidos'
                            variant='filled'
                            fullWidth
                            {
                            ...register('lastName', {
                                required: 'El apellido es requerido',
                            })
                            }
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant='filled'
                            fullWidth
                            {
                            ...register('address', {
                                required: 'La dirección es requerida',
                            })
                            }
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2'
                            variant='filled'
                            fullWidth
                            {
                            ...register('address2')
                            }
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Código Postal'
                            variant='filled'
                            fullWidth
                            {
                            ...register('zip', {
                                required: 'El código postal es requerido',
                            })
                            }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant='filled'
                            fullWidth
                            {
                            ...register('city', {
                                required: 'La ciudad es requerida',
                            })
                            }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                id='select'
                                select
                                variant='filled'
                                label='País'
                                defaultValue={shippingAddress?.country || ''}
                                {
                                ...register('country', {
                                    required: 'El país es requerido',
                                })
                                }
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}>{country.name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Teléfono'
                            variant='filled'
                            fullWidth
                            {
                            ...register('phone', {
                                required: 'El teléfono es requerido',
                            })
                            }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        ></TextField>

                    </Grid>
                </Grid>
                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button
                        type='submit'
                        color='secondary'
                        className='circular-btn'
                        size='large'
                    >
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}

export default AddressPage;
