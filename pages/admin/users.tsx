import React, { useEffect, useState } from 'react'
import { PeopleOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { AdminLayout } from '../../components/layouts'
import { Grid, MenuItem, Select } from '@mui/material'
import useSWR from 'swr'
import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'

const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data)
        }
    }, [data])


    if (!data && !error) return (<></>);

    const onRoleUpdated = async (userId: string, role: string) => {
        const oldUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId == user._id ? role : user.role
        }))

        setUsers(updatedUsers);
        try {
            await tesloApi.put(`/admin/users`, { userId, role });
        } catch (error) {
            setUsers(oldUsers);
            console.log(error);
            alert('No se puede actualizar el role del usuario');
        }
    };

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        {
            field: 'role', headerName: 'Rol', width: 300, renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label='Rol'
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users!.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout
            title='Usuarios'
            subtitle='Mantenimiento de usuarios'
            icon={<PeopleOutlined />}
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

export default UsersPage