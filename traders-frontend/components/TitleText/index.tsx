import React from 'react'
import { Box } from '@chakra-ui/react'

type TitleTextProps = {
    title: string;
    description: string;
}


const TitleText = ({title, description}: TitleTextProps) => {
    return (
        <Box>
            <Box>
                {title}
            </Box>
            <Box>
                {description}
            </Box>
        </Box>
    )
}

export default TitleText