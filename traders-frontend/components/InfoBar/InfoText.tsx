import { Box, Text } from '@chakra-ui/react'
import styles from './InfoText.module.scss';

type InfoTextProps = {
  title: string;
  value: string;
  change?: string;
}

const InfoText = ({title, value, change} : InfoTextProps) => {
  return (
    <Box className={styles['container']}>
      <Text fontSize="md">{title}</Text>
      <Text fontSize="xs">{value}</Text>
      {change && <h6>{change}</h6>}
    </Box>
  )
}

export default InfoText;
