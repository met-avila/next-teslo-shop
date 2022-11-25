import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data =
    | { message: string }
    | {
        numberOfOrders: number;
        paidOrders: number;   // paid true
        notPaidOrders: number;
        numberOfClients: number;  // role: client
        numberOfProducts: number;
        productsWithNoInventory: number; // productos con 0 inventario
        lowInventory: number; // productos con 10 o menos
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const token = await getToken({ req });
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    await db.connect();
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    ] = await Promise.all([
        Order.count(),
        Order.find({ isPais: true }).count(),
        User.find({ role: 'client' }).count(),
        Product.count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 10 } }).count()
    ])
    await db.disconnect();


    return res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders
    });
}