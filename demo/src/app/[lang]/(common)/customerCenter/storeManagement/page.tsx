'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link as MuiLink,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type StoreStatus = 'active' | 'pending' | 'inactive';

type StoreManagementRow = {
  store_id: string;
  store_name: string | null;
  storeName?: string | null;
  authorization_code: string | null;
  agent_company_name: string | null;
  proxy_account: string | null;
  company_location: string | null;
  sales_area: string | null;
  store_count: number;
  binding_count: number;
  superior_agent_name: string | null;
  created_at: string | null;
  status: StoreStatus;
  client_count: number;
};

type StoreManagementListResponse = {
  total: number;
  items: StoreManagementRow[];
};

type StoreFilters = {
  agentNameOrAccount: string;
  clientCount: string;
  companyLocation: string;
  creationTime: string;
  status: '' | StoreStatus;
};

const defaultFilters: StoreFilters = {
  agentNameOrAccount: '',
  clientCount: '',
  companyLocation: '',
  creationTime: '',
  status: '',
};

const statusColorByCode: Record<StoreStatus, 'success' | 'warning' | 'default'> = {
  active: 'success',
  pending: 'warning',
  inactive: 'default',
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
}

function getStatusLabel(status: StoreStatus, isZh: boolean): string {
  if (isZh) {
    if (status === 'active') return '启用';
    if (status === 'pending') return '待审核';
    return '停用';
  }

  if (status === 'active') return 'Active';
  if (status === 'pending') return 'Pending';
  return 'Inactive';
}

export default function StoreManagementPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const [rows, setRows] = useState<StoreManagementRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<StoreFilters>(defaultFilters);

  const loadStores = useCallback(async (nextFilters: StoreFilters) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('limit', '200');

      const agentNameOrAccount = nextFilters.agentNameOrAccount.trim();
      const companyLocation = nextFilters.companyLocation.trim();
      const creationTime = nextFilters.creationTime.trim();
      const clientCount = nextFilters.clientCount.trim();

      if (agentNameOrAccount) {
        query.set('agent_name_or_account', agentNameOrAccount);
      }
      if (companyLocation) {
        query.set('company_location', companyLocation);
      }
      if (creationTime) {
        query.set('creation_time', creationTime);
      }
      if (nextFilters.status) {
        query.set('status', nextFilters.status);
      }
      if (clientCount) {
        const parsed = Number.parseInt(clientCount, 10);
        if (!Number.isNaN(parsed) && parsed >= 0) {
          query.set('client_count', String(parsed));
        }
      }

      const response = await fetch(`/api/v1/customerCenter/storeManagement?${query.toString()}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Failed to load stores: ${response.status}`);
      }

      const payload = (await response.json()) as StoreManagementListResponse;
      setRows(payload.items ?? []);
      setTotal(payload.total ?? 0);
    } catch (error) {
      console.error(error);
      setRows([]);
      setTotal(0);
      window.alert(isZh ? '门店列表加载失败' : 'Failed to load store list');
    } finally {
      setLoading(false);
    }
  }, [isZh]);

  useEffect(() => {
    void loadStores(defaultFilters);
  }, [loadStores]);

  const handleSearch = useCallback(() => {
    void loadStores(filters);
  }, [filters, loadStores]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    void loadStores(defaultFilters);
  }, [loadStores]);

  const handleDelete = useCallback(
    async (storeId: string, storeName: string) => {
      const confirmed = window.confirm(
        isZh
          ? `你确定要删除门店「${storeName}」吗？此操作不可恢复。`
          : `Are you sure you want to delete "${storeName}"? This action cannot be undone.`,
      );
      if (!confirmed) {
        return;
      }

      setDeletingId(storeId);
      try {
        const response = await fetch(`/api/v1/customerCenter/storeManagement/${storeId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Delete failed: ${response.status}`);
        }

        await loadStores(filters);
      } catch (error) {
        console.error(error);
        window.alert(isZh ? '删除失败，请稍后重试' : 'Delete failed, please try again later');
      } finally {
        setDeletingId(null);
      }
    },
    [filters, isZh, loadStores],
  );

  const statusTip = useMemo(
    () => (
      <Box sx={{ maxWidth: 380 }}>
        <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 1 }}>
          {isZh ? '门店状态说明' : 'Store Status Notes'}
        </Typography>
        <Box component='ol' sx={{ pl: 2, m: 0 }}>
          <li>
            <Typography variant='body2'>
              {isZh
                ? '启用状态：门店正常运营，可编辑或关联机器人。一旦关联机器人，门店不可关闭，以免影响机器人运行。'
                : 'Active status: The store operates normally and can be edited or linked to robots. Once linked to a robot, the store cannot be closed as it would affect robot operations.'}
            </Typography>
          </li>
          <li>
            <Typography variant='body2'>
              {isZh
                ? '关闭状态：当没有机器人绑定时可关闭。关闭后门店可删除并注销。'
                : 'Closed state: When no robots are bound to the store, it can be closed. After closing, the store can be deleted and deregistered.'}
            </Typography>
          </li>
          <li>
            <Typography variant='body2'>
              {isZh
                ? '上级代理仅可查看下级代理门店信息，不能删除下级代理门店。'
                : "Superior agents can only view subordinate agents' store info and cannot delete their stores."}
            </Typography>
          </li>
        </Box>
      </Box>
    ),
    [isZh],
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
            <Typography color='text.primary'>{isZh ? '门店管理' : 'Store Management'}</Typography>
          </Breadcrumbs>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent='space-between'
            spacing={2}
          >
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                {isZh ? '门店管理' : 'Store Management'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {isZh
                  ? '统一查看代理门店与客户数据，快速定位问题。'
                  : 'Review agent stores and customer metrics in one place.'}
              </Typography>
            </Box>
            <Button variant='contained' component={Link} href={`/${lang}/customerCenter/storeManagement/add`}>
              {isZh ? '新增' : 'Add'}
            </Button>
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
                  value={filters.agentNameOrAccount}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, agentNameOrAccount: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '代理客户数' : 'Client Number by Proxy'}
                  placeholder={isZh ? '输入客户数' : 'Enter client count'}
                  value={filters.clientCount}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, clientCount: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '公司所在地' : 'Company location'}
                  placeholder={isZh ? '输入城市 / 国家' : 'Type city or country'}
                  value={filters.companyLocation}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, companyLocation: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '创建时间' : 'Creation Time'}
                  placeholder={isZh ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                  value={filters.creationTime}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, creationTime: event.target.value }))
                  }
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  select
                  fullWidth
                  label={isZh ? '状态' : 'Status'}
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: (event.target.value as '' | StoreStatus) ?? '',
                    }))
                  }
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='active'>{isZh ? '启用' : 'Active'}</MenuItem>
                  <MenuItem value='pending'>{isZh ? '待审核' : 'Pending'}</MenuItem>
                  <MenuItem value='inactive'>{isZh ? '停用' : 'Inactive'}</MenuItem>
                </TextField>
              </Stack>
              <Divider />
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined' onClick={handleReset}>
                  {isZh ? '重置' : 'Reset'}
                </Button>
                <Button variant='contained' onClick={handleSearch}>
                  {isZh ? '搜索' : 'Search'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
              <Typography variant='h6'>{isZh ? '门店列表' : 'Store List'}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? `共 ${total} 条记录` : `${total} records`}
              </Typography>
            </Stack>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '代理客户数' : 'Client Number by Proxy'}</TableCell>
                    <TableCell>{isZh ? '门店名称' : 'Store Name'}</TableCell>
                    <TableCell>{isZh ? '代理公司名称' : 'Agent Company Name'}</TableCell>
                    <TableCell>{isZh ? '代理账号' : 'Proxy account'}</TableCell>
                    <TableCell>{isZh ? '公司所在地' : 'Company location'}</TableCell>
                    <TableCell>{isZh ? '销售区域' : 'Sales Area'}</TableCell>
                    <TableCell>{isZh ? '拓展门店数' : 'Expanding the number of stores'}</TableCell>
                    <TableCell>{isZh ? '激活绑定数' : 'Activation Binding Number'}</TableCell>
                    <TableCell>{isZh ? '上级代理名称' : 'Superior Agent Name'}</TableCell>
                    <TableCell>{isZh ? '创建时间' : 'Creation Time'}</TableCell>
                    <TableCell>
                      <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <Box component='span'>{isZh ? '状态' : 'Status'}</Box>
                        <Tooltip title={statusTip} placement='top'>
                          <IconButton size='small' aria-label='status-help' sx={{ color: 'inherit', p: 0.25 }}>
                            <InfoOutlinedIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align='right'>{isZh ? '操作' : 'Operation'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.store_id} hover>
                      <TableCell>{row.client_count}</TableCell>
                      <TableCell>{row.store_name ?? row.storeName ?? '-'}</TableCell>
                      <TableCell>{row.agent_company_name ?? '-'}</TableCell>
                      <TableCell>{row.proxy_account ?? '-'}</TableCell>
                      <TableCell>{row.company_location ?? '-'}</TableCell>
                      <TableCell>{row.sales_area ?? '-'}</TableCell>
                      <TableCell>{row.store_count}</TableCell>
                      <TableCell>{row.binding_count}</TableCell>
                      <TableCell>{row.superior_agent_name ?? '-'}</TableCell>
                      <TableCell>{formatDateTime(row.created_at)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(row.status, isZh)}
                          size='small'
                          color={statusColorByCode[row.status]}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Stack direction='row' spacing={1} justifyContent='flex-end'>
                          <Button
                            size='small'
                            component={Link}
                            href={`/${lang}/customerCenter/storeManagement/view?id=${encodeURIComponent(row.authorization_code ?? row.store_id)}&name=${encodeURIComponent(row.store_name ?? row.storeName ?? '')}`}
                          >
                            {isZh ? '查看' : 'View'}
                          </Button>
                          <Button size='small' color='secondary'>
                            {isZh ? '编辑' : 'Edit'}
                          </Button>
                          <Button
                            size='small'
                            color='error'
                            disabled={deletingId === row.store_id}
                            onClick={() =>
                              void handleDelete(
                                row.store_id,
                                row.store_name ?? row.storeName ?? row.store_id,
                              )
                            }
                          >
                            {deletingId === row.store_id
                              ? isZh
                                ? '删除中...'
                                : 'Deleting...'
                              : isZh
                                ? '删除门店'
                                : 'Delete Store'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12} align='center'>
                        {isZh ? '暂无数据' : 'No data'}
                      </TableCell>
                    </TableRow>
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
