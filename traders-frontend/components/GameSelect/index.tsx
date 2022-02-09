import { Button, ButtonGroup, Box } from '@chakra-ui/react'

import Link from 'next/link';
import Image from 'next/image'

import styles from './GameSelect.module.scss';
import { ArrowRightIcon } from '@chakra-ui/icons'


type GameSelectProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
}

const GameSelect = ({title, description, image, link, buttonText} : GameSelectProps) => {
  return (
    <Box className={styles['container']}>
      {/* <Image src={image} alt={title} /> */}
      {/* use mui avatar? */}
      <Box className={styles['text']}>
        <h3>{title}</h3>
        {/* <p>{description}</p> */}
      </Box>
      <Box className={styles['button']}>
        <Link passHref href={link} as={link}>
          <Button variant="contained" rightIcon={<ArrowRightIcon />} sx={{whiteSpace: 'nowrap', minWidth: "max-content"}}>
            {buttonText}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default GameSelect;
