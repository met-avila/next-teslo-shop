import axios from 'axios';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return payOrder(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getPaypalBearerToken = async () => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials')

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }
    }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // TODO: Validar session del usuario
    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Debe estar autenticado para hacer esto' });
    }

    // TODO: Validar que el order id sea un mongo id valido
    const { transactionId = '', orderId = '' } = req.body;

    if (!isValidObjectId(orderId)) {
        return res.status(400).json({ message: 'orderId inválido' });
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);

    if (!dbOrder) {
        await db.disconnect();
        return res.status(400).json({ message: 'Orden no existe en base de datos' });
    }

    if (dbOrder.isPaid) {
        await db.disconnect();
        return res.status(400).json({ message: 'La orden ya ha sigo pagada' });
    }

    const paypalBearerToken = await getPaypalBearerToken();

    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' });
    }


    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    })

    if (data.status !== 'COMPLETED') {
        res.status(401).json({ message: 'Orden no reconocida' });
    }

    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de paypal y nuestra orden no son iguales' });
    }

    dbOrder.transacctionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();

    await db.disconnect();


    return res.status(200).json({ message: paypalBearerToken });
}
