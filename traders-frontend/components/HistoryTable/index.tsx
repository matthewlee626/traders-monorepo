import * as React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Text,
  Box
} from '@chakra-ui/react'

type HistoryTableRows = {
  rows: any[];
}

const HistoryTable = ({rows} : HistoryTableRows) => {
  const displayedRows = rows.reverse();
  const displayedRowsLength = displayedRows.length;

  return (
    <Box sx={{ overflow: "scroll", height: "50vh" }}>
      <Table aria-label="simple table" >
      <Thead>
        <Tr sx={{ 'td, th': { border: 0 } }}>
          <Th sx={{color: 'white', 'h2' : {margin: 0} }}><Text fontSize="lg">Bid</Text></Th>
          <Th sx={{color: 'white', 'h2' : {margin: 0} }}><Text fontSize="lg">Bid Size</Text></Th>
          <Th sx={{color: 'white', 'h2' : {margin: 0} }}><Text fontSize="lg">Ask</Text></Th>
          <Th sx={{color: 'white', 'h2' : {margin: 0} }}><Text fontSize="lg">Ask Size</Text></Th>
          <Th sx={{color: 'white', 'h2' : {margin: 0} }}><Text fontSize="lg">Action</Text></Th>
          <Th sx={{color: 'white', 'h2' : {margin: 0} }}><Text fontSize="lg">Player Name</Text></Th>
        </Tr>
      </Thead>
      <Tbody>
        {displayedRows.map((row, index) => (
          <Tr
            key={displayedRowsLength - index - 1}
            sx={{ 'td': { border: 0 } }}
          >
            <Td sx={{color: 'white'}}>{row.bidSize}</Td>
            <Td sx={{color: 'white'}}>{row.bidValue}</Td>
            <Td sx={{color: 'white'}}>{row.askValue}</Td>
            <Td sx={{color: 'white'}}>{row.askSize}</Td>
            <Td sx={{color: 'white'}}>{row.action}</Td>
            <Td sx={{color: 'white'}}>{row.name}</Td>
          </Tr>
        ))}
      </Tbody>
      </Table>
    </Box>
  );
}

export default HistoryTable;