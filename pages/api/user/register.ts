import type { NextApiRequest, NextApiResponse } from 'next'
import bcrytp from 'bcryptjs';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

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
        case 'POST':
            return registerUser(req, res);

        default:
            res.status(400).json({ message: 'Bad request' });
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { name = '', email = '', password = '' } = req.body as { name: string, email: string, password: string };

    if (name.length < 2) {
        return res.status(400).json({ message: 'El nombre debe tener por lo menos 2 caracteres' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener por lo menos 6 caracteres' });
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({ message: 'El correo no es válido' });
    }

    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
        await db.disconnect();
        return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const newUser = new User({
        name,
        email: email.toLocaleLowerCase(),
        password: bcrytp.hashSync(password),
        role: 'client'
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Revisar logs del servidor' });
    } finally {
        await db.disconnect();
    }

    const { _id, role } = newUser;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token: token,
        user: {
            name,
            email,
            role
        }
    });
}
