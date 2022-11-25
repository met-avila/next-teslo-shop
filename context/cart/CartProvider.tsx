import { FC, useEffect, useReducer, useState } from 'react';
import Cookies from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;
}



const cartFromCookie = (): ICartProduct[] => {
    let products: ICartProduct[] = [];
    try {
        const cookie = Cookies.get('cart');
        products = (cookie) ? JSON.parse(cookie) : [];

    } catch (error) { }
    return products;
};

const shippingAddressFromCookie = (): ShippingAddress => {
    let address = undefined;
    try {
        const cookie = Cookies.get('chekoutAddress');
        address = (cookie) ? JSON.parse(cookie) : undefined;
    } catch (error) {
    }
    return address;
};

const CART_INITIAL_STATE: CartState = {
    isLoaded: true,
    cart: cartFromCookie(),
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

export const CartProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => { setHasMounted(true); }, []);

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => { Cookies.set('cart', JSON.stringify(state.cart)); }, [state.cart]);

    useEffect(() => {
        const shippingAddress = shippingAddressFromCookie();
        if (shippingAddress) {
            updateShippingAddress(shippingAddress);
        }
    }, []);

    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, product) => prev + product.quantity, 0);
        const subTotal = state.cart.reduce((prev, product) => prev + (product.quantity * product.price), 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (1 + taxRate)
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
    }, [state.cart])


    const addProductToCart = (product: ICartProduct) => {
        const productsInCart = [...state.cart];
        const productInCart = productsInCart.find(item => item._id === product._id && item.size === product.size);
        if (productInCart) {
            productInCart.quantity += product.quantity;
        } else {
            productsInCart.push({ ...product });
        }
        dispatch({ type: '[Cart] - Update products in cart', payload: productsInCart });
    }

    const updateCartProductQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Update product cart quantity', payload: product });
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Remove product cart', payload: product });
    }

    const updateShippingAddress = (address: ShippingAddress) => {
        Cookies.set('chekoutAddress', JSON.stringify(address));
        dispatch({ type: '[Cart] - Load shipping address', payload: address });
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {

        if (!state.shippingAddress) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart,
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try {
            const { data } = await tesloApi.post('/orders', body);
            dispatch({ type: '[Cart] - Order complete' })

            return {
                hasError: false,
                message: data._id
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response!.data.message
                }
            }

            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

    if (!hasMounted) { return null; }
    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartProductQuantity,
            removeCartProduct,
            updateShippingAddress,

            // Orders 
            createOrder,
        }}>
            {children}
        </CartContext.Provider>
    )
};