import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TabIndicatorProps,
} from '@chakra-ui/react';

type PnLModalType = {
  rows: object;
  sum: number;
  endIsOpen: boolean;
  endOnOpen: Function;
  endOnClose: Function;
};

// @ts-ignore
const PnLModal = ({ rows, sum, endIsOpen, endOnOpen, endOnClose }) => {
  const players = Object.keys(rows);
  // @ts-ignore
  const scores = players.map((player) => rows[player]);

  return (
    <Modal isOpen={endIsOpen} onClose={endOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Final Results</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text fontSize="lg">True Sum: {sum}</Text>
            <Table aria-label='simple table'>
              <Thead>
                <Tr sx={{ 'td, th': { border: 0 } }}>
                  <Th >
                    <Text fontSize='lg'>Player</Text>
                  </Th>
                  <Th >
                    <Text fontSize='lg'>PnL</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {players.map((player, index) => (
                  <Tr key={index} sx={{ td: { border: 0 } }}>
                    <Td >{player}</Td>
                    <Td >{scores[index]}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PnLModal;
