import React, { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next'
import { getSession, signIn, getProviders } from 'next-auth/react'
import { useForm } from 'react-hook-form';

import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline, PersonalVideoRounded } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { PromiseProvider } from 'mongoose';

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {
    const router = useRouter();
    // const { loginUser } = useContext(AuthContext);
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov);
        });
    }, [])


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onLogin = async ({ email, password }: FormData) => {
        setShowError(false);

        // const isValidLogin = await loginUser(email, password);

        // if (!isValidLogin) {
        //     setShowError(true);
        //     setTimeout(() => { setShowError(false); }, 3000);
        //     return;
        // }

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
        await signIn('credentials', { email, password });
    };

    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={handleSubmit(onLogin)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Correo'
                                type='email'
                                variant='filled'
                                fullWidth
                                {
                                ...register('email', {
                                    required: 'Este email es requerido',
                                    validate: validations.isEmail
                                })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12}
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'>
                            <TextField
                                label='Contraseña'
                                type='password'
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'La contraseña es requerida',
                                    minLength: {
                                        value: 6, message: 'Mínimo 6 caracteres'
                                    }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <Chip
                                label='El email o la constraseña son inválidos'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ mt: 1, display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}
                                passHref>
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {
                                Object.values(providers).map((provider: any, index: number) => {
                                    return (
                                        <Button
                                            sx={{ display: (provider.id === 'credentials') ? 'none' : 'flex', mb: 1 }}
                                            key={provider.id}
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            onClick={() => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    );
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });

    const { callbackUrl = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: callbackUrl.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default LoginPage