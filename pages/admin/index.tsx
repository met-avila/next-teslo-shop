import { AccessAlarmOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interfaces'

const DashboardPage = () => {
    const [refreshIn, setRefreshIn] = useState(30);
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [])


    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000, // 30 seg
    });

    if (!error && !data) {
        return <>Cargando...</>
    }

    if (error) {
        console.log(error);
        return <Typography>Error al cargar la información</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders,
    } = data!;

    return (
        <AdminLayout
            title='Dashboard'
            subtitle='Estadisticas generales'
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={numberOfOrders}>
                <SummaryTile
                    title={1}
                    subtitle='Ordenes totales'
                    icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={paidOrders}
                    subtitle='Ordenes pagadas'
                    icon={<AttachMoneyOutlined color='secondary' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={notPaidOrders}
                    subtitle='Ordenes pendientes'
                    icon={<GroupOutlined color='error' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={numberOfClients}
                    subtitle='Clientes'
                    icon={<AttachMoneyOutlined color='primary' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={numberOfProducts}
                    subtitle='Productos'
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={productsWithNoInventory}
                    subtitle='Sin Existencias'
                    icon={<CancelPresentationOutlined color='warning' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={lowInventory}
                    subtitle='Bajo inventario'
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={refreshIn}
                    subtitle='Actualición en:'
                    icon={<AccessAlarmOutlined color='secondary' sx={{ fontSize: 40 }} />} />
            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage