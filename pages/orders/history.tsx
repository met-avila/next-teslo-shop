import React from 'react'
import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { ShopLayout } from '../../components/layouts'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'
import { IOrder } from '../../interfaces'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    width: 200,
    headerName: 'Pagada',
    description: 'Muestra información si está pagada la orden o no',
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid
        ? <Chip color='success' label='Pagada' variant='outlined' />
        : <Chip color='error' label='No pagada' variant='outlined' />
    }
  },
  {
    field: 'orden',
    width: 200,
    sortable: false,
    headerName: 'Ver orden',
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      )
    }
  }
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id
  }))
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
      <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, widht: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
          />
        </Grid>
      </Grid>

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/history`,
        permanent: false
      }
    }
  }

  console.log({ session })
  const orders = await dbOrders.getOrdersByUser(session.user.id);

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage