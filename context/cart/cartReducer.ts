import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';

type CartAction =
    | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Update product cart quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove product cart', payload: ICartProduct }
    | {
        type: '[Cart] - Update order summary', payload: {
            numberOfItems: number,
            subTotal: number,
            tax: number,
            total: number
        }
    }
    | { type: '[Cart] - Load shipping address', payload: ShippingAddress }
    | { type: '[Cart] - Order complete' }

export const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Update product cart quantity':
            return {
                ...state,
                cart: state.cart.map(item => {
                    if (item._id === action.payload._id && item.size === action.payload.size)
                        return action.payload
                    return item;
                })
            }
        case '[Cart] - Remove product cart':
            return {
                ...state,
                cart: state.cart.filter(item => !(item._id === action.payload._id && item.size === action.payload.size))
            }
        case '[Cart] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        case '[Cart] - Load shipping address':
            return {
                ...state,
                shippingAddress: action.payload
            }
        case '[Cart] - Order complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0
            }
        default:
            return state;
    }
};