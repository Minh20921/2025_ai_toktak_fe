'use client';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import API from '@service/api';
import { styled, tableCellClasses } from '@mui/material';

interface ILog {
  id: string;
  ai_type: string;
  post_id: string;
  request: string;
  response: string;
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export default function LogTable() {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const logConfig = useRef(
    new API(`/api/v1/setting/get_logs?page=1&per_page=30`, 'GET', {
      success: (res) => {
        setLogs(res.data as ILog[]);
      },
      error: (err) => {
        console.error('Failed to fetch logs:', err);
      },
    }),
  );

  useEffect(() => {
    logConfig.current.call();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: 'auto' }}>
      <Table stickyHeader sx={{ minWidth: 1000 }} aria-label="log table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" sx={{ width: '10%' }}>
              ID
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '10%' }}>
              Type
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '10%' }}>
              Post ID
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '40%' }}>
              Request
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '40%' }}>
              Response
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((row) => {
            let parsedRequest, parsedResponse;

            try {
              parsedRequest = JSON.parse(row.request);
            } catch {
              parsedRequest = row.request;
            }

            try {
              parsedResponse = JSON.parse(row.response);
            } catch {
              parsedResponse = row.response;
            }

            const isExpanded = expandedRows.has(row.id);

            return (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center">{row.id}</StyledTableCell>
                <StyledTableCell align="center">{row.ai_type}</StyledTableCell>
                <StyledTableCell align="center">{row.post_id}</StyledTableCell>
                <StyledTableCell align="left" sx={{ wordBreak: 'break-word' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', maxHeight: isExpanded ? 'none' : '100px', overflow: 'hidden' }}>
                    {typeof parsedRequest === 'object' ? JSON.stringify(parsedRequest, null, 2) : parsedRequest}
                  </pre>
                  <Button size="small" onClick={() => toggleExpand(row.id)}>
                    {isExpanded ? 'Thu gọn' : 'Mở rộng'}
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ wordBreak: 'break-word' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', maxHeight: isExpanded ? 'none' : '100px', overflow: 'hidden' }}>
                    {typeof parsedResponse === 'object' ? JSON.stringify(parsedResponse, null, 2) : parsedResponse}
                  </pre>
                  <Button size="small" onClick={() => toggleExpand(row.id)}>
                    {isExpanded ? 'Thu gọn' : 'Mở rộng'}
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
