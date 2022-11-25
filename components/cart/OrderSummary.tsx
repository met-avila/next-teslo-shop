import { FC, useContext } from "react"
import { Grid, Typography } from "@mui/material"
import { CartContext } from "../../context";
import { currency } from "../../utils";

interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        total:
        number;
        tax: number;
    }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
    let { numberOfItems, subTotal, total, tax } = useContext(CartContext);

    if (orderValues) {
        numberOfItems = orderValues.numberOfItems;
        subTotal = orderValues.subTotal;
        total = orderValues.total;
        tax = orderValues.tax;
    }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(tax)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{currency.format(total)}</Typography>
            </Grid>
        </Grid>
    )
}
