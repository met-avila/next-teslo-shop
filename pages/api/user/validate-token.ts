import type { NextApiRequest, NextApiResponse } from 'next'
import bcrytp from 'bcryptjs';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data =
    | { message: string }
    | {
        token: string,
        user: {
            name: string;
            email: string;
            role: string;
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return validateJWT(req, res);

        default:
            res.status(400).json({ message: 'Bad request' });
    }
}

const validateJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken(token);
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    await db.connect();
    const user = await User.findById(userId).lean();
    await db.disconnect();

    if (!user) {
        return res.status(400).json({ message: 'No existe usuario con id: ' + userId });
    }

    const { _id, name, email, role } = user;

    return res.status(200).json({
        token: jwt.signToken(_id, email),
        user: {
            name, email, role
        }
    });
}


