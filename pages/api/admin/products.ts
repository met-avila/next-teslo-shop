import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data =
    | { message: string }
    | IProduct[]
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'POST':
            return createProduct(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const products = await Product.find().sort({ title: 'asc' }).lean();
    await db.disconnect();

    // TODO: actualizar las imagenes

    return res.status(200).json(products);
}


const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;

    console.log({ _id })
    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    try {
        await db.connect();

        const product = await Product.findById(_id);
        if (!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el producto con el id' });
        }

        // TODO: eliminar imagenes en Cloudinary
        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                await cloudinary.uploader.destroy(fileId)
            }
        });

        req.body.sizes = sortSizes(req.body.sizes);

        await product.update(req.body);
        await db.disconnect();
        return res.status(200).json(product);
    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(400).json({ message: 'No se pudo actualizar el producto' });
    }
}

const sortSizes = (sizes: string[]) => {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].filter(s => sizes.includes(s));
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }

    // TODO: posiblemente tendremos un localhost:3000/products/aasas.jpg

    try {
        await db.connect();

        const productInDB = await Product.findOne({ slug: req.body.slud }).lean()
        if (productInDB) {
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
        }

        const product = new Product(req.body);
        product.save();
        await db.disconnect();

        return res.status(201).json(product);
    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(400).json({ message: 'No se pudo crear el producto' });
    }

}

