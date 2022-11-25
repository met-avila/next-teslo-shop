import { Box, Button } from "@mui/material"
import { FC, useState } from "react"
import { ISize } from "../../interfaces"

interface Props extends React.PropsWithChildren {
    selectedSize?: ISize
    sizes: ISize[]

    // Methods
    onSelectedSize: (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {

    return (
        <Box>
            {
                sizes.map(size => (
                    <Button
                        key={size}
                        size='small'
                        color={selectedSize === size ? 'primary' : 'info'}
                        onClick={() => onSelectedSize(size)}
                    >
                        {size}
                    </Button>
                ))
            }
        </Box>
    )
}
