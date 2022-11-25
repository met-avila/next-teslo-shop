import React from 'react'
import useSWR from 'swr'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Chip, Grid } from '@mui/material'
import { AdminLayout } from '../../../components/layouts'
import { IOrder, IUser } from '../../../interfaces'


const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 220 },
    { field: 'email', headerName: 'Correo', width: 180 },
    { field: 'name', headerName: 'Nombre completo', width: 150 },
    { field: 'total', headerName: 'Monto total', width: 100 },
    {
        field: 'isPaid', headerName: 'Pagada', width: 120, renderCell: ({ row }: GridRenderCellParams) => {
            return row.isPaid
                ? (<Chip variant='outlined' label='Pagada' color='success' />)
                : (<Chip variant='outlined' label='Pendiente' color='error' />)
        }
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 110 },
    {
        field: 'check', headerName: 'Ver order', renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
                    Ver orden
                </a>
            );
        }
    },
    { field: 'createdAt', headerName: 'Creada', width: 250 },
];


const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
    if (!data && !error) return (<></>);

    const rows = data!.map(order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt
    }));

    return (
        <AdminLayout
            title='Ordenes'
            subtitle='Mantenimiento de ordenes'
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, widht: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default OrdersPage