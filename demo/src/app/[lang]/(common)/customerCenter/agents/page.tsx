'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

type RowStatus = 'active' | 'pending' | 'inactive';

type SubordinateAgentItem = {
  agent_id: string;
  agent_company_name: string;
  proxy_account: string | null;
  client_count: number;
  company_location: string | null;
  sales_area: string | null;
  store_count: number;
  binding_count: number;
  superior_agent_name: string | null;
  created_at: string | null;
  status: RowStatus;
};

type ApiResponse = {
  total: number;
  items: SubordinateAgentItem[];
};

const statusColors: Record<RowStatus, 'success' | 'warning' | 'default'> = {
  active: 'success',
  pending: 'warning',
  inactive: 'default',
};

function toStatusLabel(status: RowStatus, isZh: boolean): string {
  if (isZh) {
    if (status === 'active') return '启用';
    if (status === 'pending') return '待审核';
    return '停用';
  }
  if (status === 'active') return 'Active';
  if (status === 'pending') return 'Pending';
  return 'Inactive';
}

function formatTime(value: string | null): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
}

export default function SubordinateAgentManagementPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [rows, setRows] = useState<SubordinateAgentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    const query = new URLSearchParams();
    query.set('limit', '200');
    if (keyword.trim()) query.set('keyword', keyword.trim());
    if (status) query.set('status', status);

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/customerCenter/agents?${query.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) {
        let detail = `Failed to fetch agents (${res.status})`;
        try {
          const payload = (await res.json()) as { detail?: string };
          if (payload?.detail) detail = payload.detail;
        } catch {
          // ignore response parse error and keep default message
        }
        throw new Error(detail);
      }

      const payload = (await res.json()) as ApiResponse;
      setRows(Array.isArray(payload.items) ? payload.items : []);
      setTotal(typeof payload.total === 'number' ? payload.total : 0);
    } catch (err) {
      setRows([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [keyword, status]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const noRowsText = useMemo(
    () => (isZh ? '暂无下级代理数据' : 'No subordinate agents yet'),
    [isZh]
  );

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Breadcrumbs separator='/' aria-label='breadcrumb'>
            <MuiLink
              component={Link}
              underline='hover'
              color='text.secondary'
              href={`/${lang}/customerCenter/storeManagement`}
            >
              {isZh ? '客户中心' : 'Customer Center'}
            </MuiLink>
            <Typography color='text.primary'>
              {isZh ? '下级代理管理' : 'Subordinate Agent Management'}
            </Typography>
          </Breadcrumbs>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent='space-between'
            spacing={2}
          >
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                {isZh ? '下级代理管理' : 'Subordinate Agent Management'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {isZh
                  ? '集中管理下级代理，查看门店与绑定情况。'
                  : 'Manage subordinate agents and review store bindings.'}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant='h6'>{isZh ? '筛选条件' : 'Filters'}</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '代理名称 / 账号' : 'Agency Name / Account'}
                  placeholder={isZh ? '输入代理名称或账号' : 'Type name or account'}
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setKeyword(keywordInput);
                    }
                  }}
                />
                <TextField
                  select
                  fullWidth
                  label={isZh ? '状态' : 'Status'}
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='active'>{isZh ? '启用' : 'Active'}</MenuItem>
                  <MenuItem value='pending'>{isZh ? '待审核' : 'Pending'}</MenuItem>
                  <MenuItem value='inactive'>{isZh ? '停用' : 'Inactive'}</MenuItem>
                </TextField>
              </Stack>
              <Divider />
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setKeywordInput('');
                    setKeyword('');
                    setStatus('');
                  }}
                >
                  {isZh ? '重置' : 'Reset'}
                </Button>
                <Button variant='contained' onClick={() => setKeyword(keywordInput)}>
                  {isZh ? '搜索' : 'Search'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
              <Typography variant='h6'>{isZh ? '代理列表' : 'Agent List'}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? `共 ${total} 条记录` : `${total} records`}
              </Typography>
            </Stack>

            {error ? <Alert severity='error'>{error}</Alert> : null}

            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '代理客户数' : 'Client Number by Proxy'}</TableCell>
                    <TableCell>{isZh ? '代理公司名称' : 'Agent Company Name'}</TableCell>
                    <TableCell>{isZh ? '代理账号' : 'Proxy account'}</TableCell>
                    <TableCell>{isZh ? '公司所在地' : 'Company location'}</TableCell>
                    <TableCell>{isZh ? '销售区域' : 'Sales Area'}</TableCell>
                    <TableCell>
                      {isZh ? '拓展门店数' : 'Expanding the number of stores'}
                    </TableCell>
                    <TableCell>{isZh ? '激活绑定数' : 'Activation Binding Number'}</TableCell>
                    <TableCell>{isZh ? '上级代理名称' : 'Superior Agent Name'}</TableCell>
                    <TableCell>{isZh ? '创建时间' : 'Creation Time'}</TableCell>
                    <TableCell>{isZh ? '状态' : 'Status'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <CircularProgress size={18} />
                          <Typography variant='body2' color='text.secondary'>
                            {isZh ? '加载中...' : 'Loading...'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Typography variant='body2' color='text.secondary'>
                          {noRowsText}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.agent_id} hover>
                        <TableCell>{row.client_count}</TableCell>
                        <TableCell>{row.agent_company_name}</TableCell>
                        <TableCell>{row.proxy_account || '-'}</TableCell>
                        <TableCell>{row.company_location || '-'}</TableCell>
                        <TableCell>{row.sales_area || '-'}</TableCell>
                        <TableCell>{row.store_count}</TableCell>
                        <TableCell>{row.binding_count}</TableCell>
                        <TableCell>{row.superior_agent_name || '-'}</TableCell>
                        <TableCell>{formatTime(row.created_at)}</TableCell>
                        <TableCell>
                          <Chip
                            label={toStatusLabel(row.status, isZh)}
                            size='small'
                            color={statusColors[row.status]}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
