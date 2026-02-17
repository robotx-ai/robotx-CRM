'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

type MachineProductRow = {
  id: string;
  product_name: string | null;
  product_nickname: string | null;
  sn_pid: string;
  agent_id: string | null;
  agent_name?: string | null;
  import_time: string | null;
  status: string;
  software_version: string | null;
  firmware_version: string | null;
  use_type: string | null;
  site_use: string | null;
  store_id: string | null;
};

type MachineProductListResponse = {
  total: number;
  items: MachineProductRow[];
};

type AgentOption = {
  id: string;
  name: string;
  email?: string | null;
};

type AgentOptionListResponse = {
  total: number;
  items: AgentOption[];
};

type MachineFilters = {
  modelOrProductName: string;
  snPid: string;
  status: string;
  agentId: string;
  softwareVersion: string;
  firmwareVersion: string;
};

const defaultFilters: MachineFilters = {
  modelOrProductName: '',
  snPid: '',
  status: '',
  agentId: '',
  softwareVersion: '',
  firmwareVersion: '',
};

const statusColorByCode: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  active: 'success',
  idle: 'info',
  offline: 'error',
  maintenance: 'warning',
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

function inferStatusCode(status: string): string {
  const value = status.toLowerCase();
  if (value.includes('maint') || value.includes('维护')) return 'maintenance';
  if (value.includes('offline') || value.includes('离线')) return 'offline';
  if (value.includes('idle') || value.includes('空闲')) return 'idle';
  if (value.includes('active') || value.includes('运行') || value.includes('启用')) return 'active';
  return 'active';
}

function getStatusLabel(status: string, isZh: boolean): string {
  const code = inferStatusCode(status);
  if (isZh) {
    if (code === 'maintenance') return '维护中';
    if (code === 'offline') return '离线';
    if (code === 'idle') return '空闲';
    if (code === 'active') return '运行中';
    return status;
  }

  if (code === 'maintenance') return 'Maintenance';
  if (code === 'offline') return 'Offline';
  if (code === 'idle') return 'Idle';
  if (code === 'active') return 'Active';
  return status;
}

function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  const code = inferStatusCode(status);
  return statusColorByCode[code] ?? 'default';
}

function shortId(value: string | null): string {
  if (!value) {
    return '-';
  }
  if (value.length <= 14) {
    return value;
  }
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function getProductImage(name: string | null): string {
  const value = (name || '').toLowerCase();
  if (value.includes('mt1 max')) return '/assets/images/products/pudu-mt1-max.png';
  if (value.includes('mt1 vac')) return '/assets/images/products/pudu-mt1-vac.png';
  return '/assets/images/products/pudu-cc1.png';
}

export default function MachineProductLibraryPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const [storeTab, setStoreTab] = useState(0);
  const [filters, setFilters] = useState<MachineFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<MachineFilters>(defaultFilters);
  const [rows, setRows] = useState<MachineProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [agentNameById, setAgentNameById] = useState<Record<string, string>>({});

  const loadAgentOptions = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/customerCenter/storeManagement/agents/options?limit=500', {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Failed to load agents: ${response.status}`);
      }

      const payload = (await response.json()) as AgentOptionListResponse;
      const mapping: Record<string, string> = {};
      for (const item of payload.items ?? []) {
        if (item.id && item.name) {
          mapping[item.id] = item.name;
        }
      }
      setAgentNameById(mapping);
    } catch (error) {
      console.error(error);
      setAgentNameById({});
    }
  }, []);

  const loadRows = useCallback(
    async (nextFilters: MachineFilters, tab: number) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.set('limit', '200');
        query.set('store_scope', tab === 0 ? 'installed' : 'unbound');

        const modelOrName = nextFilters.modelOrProductName.trim();
        const snPid = nextFilters.snPid.trim();
        const status = nextFilters.status.trim();
        const agentId = nextFilters.agentId.trim();
        const softwareVersion = nextFilters.softwareVersion.trim();
        const firmwareVersion = nextFilters.firmwareVersion.trim();

        if (modelOrName) query.set('model_or_product_name', modelOrName);
        if (snPid) query.set('sn_pid', snPid);
        if (status) query.set('status', status);
        if (agentId) query.set('agent_id', agentId);
        if (softwareVersion) query.set('software_version', softwareVersion);
        if (firmwareVersion) query.set('firmware_version', firmwareVersion);

        const response = await fetch(
          `/api/v1/productCenter/machineProductLibrary?${query.toString()}`,
          { cache: 'no-store' },
        );
        if (!response.ok) {
          throw new Error(`Failed to load machine products: ${response.status}`);
        }

        const payload = (await response.json()) as MachineProductListResponse;
        setRows(payload.items ?? []);
        setTotal(payload.total ?? 0);
      } catch (error) {
        console.error(error);
        setRows([]);
        setTotal(0);
        window.alert(isZh ? '机器产品列表加载失败' : 'Failed to load machine product list');
      } finally {
        setLoading(false);
      }
    },
    [isZh],
  );

  useEffect(() => {
    void loadRows(appliedFilters, storeTab);
  }, [appliedFilters, loadRows, storeTab]);

  useEffect(() => {
    void loadAgentOptions();
  }, [loadAgentOptions]);

  const handleSearch = useCallback(() => {
    setAppliedFilters({ ...filters });
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  }, []);

  const handleAdd = useCallback(async () => {
    const snPid = window.prompt(isZh ? '请输入 SN(PID)' : 'Please enter SN(PID)');
    if (!snPid || !snPid.trim()) return;

    const productName = window.prompt(
      isZh ? '请输入产品名称（可选）' : 'Please enter product name (optional)',
      '',
    );
    const status =
      window.prompt(
        isZh ? '请输入状态（例如 active/idle/offline/maintenance）' : 'Enter status',
        'active',
      ) || 'active';

    setCreating(true);
    try {
      const response = await fetch('/api/v1/productCenter/machineProductLibrary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sn_pid: snPid.trim(),
          status: status.trim(),
          product_name: productName?.trim() || null,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Create failed: ${response.status}`);
      }

      void loadRows(appliedFilters, storeTab);
    } catch (error) {
      console.error(error);
      window.alert(isZh ? '新增失败，请检查输入字段' : 'Create failed, please check input fields');
    } finally {
      setCreating(false);
    }
  }, [appliedFilters, isZh, loadRows, storeTab]);

  const handleEdit = useCallback(
    async (row: MachineProductRow) => {
      const nextNickname = window.prompt(
        isZh ? '请输入新的机器人昵称（可留空）' : 'Enter new robot nickname (optional)',
        row.product_nickname || '',
      );
      if (nextNickname === null) return;

      const nextUseType = window.prompt(
        isZh ? '请输入使用类型（Purchase/Lease/Trial）' : 'Enter use type (Purchase/Lease/Trial)',
        row.use_type || '',
      );
      if (nextUseType === null) return;

      const payload: Record<string, string> = {};
      if (nextNickname.trim() !== (row.product_nickname || '')) {
        payload.product_nickname = nextNickname.trim();
      }
      if (nextUseType.trim() !== (row.use_type || '')) {
        payload.use_type = nextUseType.trim();
      }

      if (Object.keys(payload).length === 0) {
        return;
      }

      setEditingId(row.id);
      try {
        const response = await fetch(`/api/v1/productCenter/machineProductLibrary/${row.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `Update failed: ${response.status}`);
        }

        void loadRows(appliedFilters, storeTab);
      } catch (error) {
        console.error(error);
        window.alert(isZh ? '编辑失败，请稍后重试' : 'Edit failed, please try again later');
      } finally {
        setEditingId(null);
      }
    },
    [appliedFilters, isZh, loadRows, storeTab],
  );

  const handleDelete = useCallback(
    async (row: MachineProductRow) => {
      const confirmed = window.confirm(
        isZh
          ? `确定删除产品「${row.product_name || row.sn_pid}」吗？`
          : `Are you sure you want to delete "${row.product_name || row.sn_pid}"?`,
      );
      if (!confirmed) return;

      setDeletingId(row.id);
      try {
        const response = await fetch(`/api/v1/productCenter/machineProductLibrary/${row.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `Delete failed: ${response.status}`);
        }

        void loadRows(appliedFilters, storeTab);
      } catch (error) {
        console.error(error);
        window.alert(isZh ? '删除失败，请稍后重试' : 'Delete failed, please try again later');
      } finally {
        setDeletingId(null);
      }
    },
    [appliedFilters, isZh, loadRows, storeTab],
  );

  const agentOptions = useMemo(
    () =>
      Object.entries(agentNameById)
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [agentNameById],
  );
  const softwareOptions = useMemo(
    () => Array.from(new Set(rows.map((item) => item.software_version).filter(Boolean) as string[])),
    [rows],
  );
  const firmwareOptions = useMemo(
    () => Array.from(new Set(rows.map((item) => item.firmware_version).filter(Boolean) as string[])),
    [rows],
  );

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            {isZh ? '机器产品库' : 'Machine Product Library'}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            {isZh
              ? '查看产品状态，快速筛选并定位机器型号。'
              : 'Review product status and filter to locate machine models quickly.'}
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Tabs
              value={storeTab}
              onChange={(_, value) => setStoreTab(value)}
              textColor='primary'
              indicatorColor='primary'
              sx={{ '& .MuiTab-root': { textTransform: 'none' } }}
            >
              <Tab label={isZh ? '门店已安装' : 'Installed in store'} />
              <Tab label={isZh ? '库存未绑定' : 'Unbound in stock'} />
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant='h6'>{isZh ? '筛选条件' : 'Filters'}</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '产品型号 / 名称' : 'Model / Product name'}
                  placeholder={isZh ? '输入型号或名称' : 'Type model or name'}
                  value={filters.modelOrProductName}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, modelOrProductName: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '序列号' : 'Serial Number'}
                  placeholder={isZh ? '输入SN' : 'Enter SN'}
                  value={filters.snPid}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, snPid: event.target.value }))
                  }
                />
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '状态' : 'Status'}</InputLabel>
                  <Select
                    label={isZh ? '状态' : 'Status'}
                    value={filters.status}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, status: String(event.target.value) }))
                    }
                  >
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='active'>{isZh ? '运行中' : 'Active'}</MenuItem>
                    <MenuItem value='idle'>{isZh ? '空闲' : 'Idle'}</MenuItem>
                    <MenuItem value='offline'>{isZh ? '离线' : 'Offline'}</MenuItem>
                    <MenuItem value='maintenance'>{isZh ? '维护中' : 'Maintenance'}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '代理' : 'Agent'}</InputLabel>
                  <Select
                    label={isZh ? '代理' : 'Agent'}
                    value={filters.agentId}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, agentId: String(event.target.value) }))
                    }
                  >
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    {agentOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '软件版本' : 'Software Version'}</InputLabel>
                  <Select
                    label={isZh ? '软件版本' : 'Software Version'}
                    value={filters.softwareVersion}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, softwareVersion: String(event.target.value) }))
                    }
                  >
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    {softwareOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '固件版本' : 'Firmware Version'}</InputLabel>
                  <Select
                    label={isZh ? '固件版本' : 'Firmware Version'}
                    value={filters.firmwareVersion}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, firmwareVersion: String(event.target.value) }))
                    }
                  >
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    {firmwareOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Divider />
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined' onClick={handleReset}>
                  {isZh ? '重置' : 'Reset'}
                </Button>
                <Button variant='contained' onClick={handleSearch}>
                  {isZh ? '查询' : 'Search'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
              <Typography variant='h6'>{isZh ? '产品列表' : 'Product List'}</Typography>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant='body2' color='text.secondary'>
                  {isZh ? `共 ${total} 条记录` : `${total} records`}
                </Typography>
                <Button variant='contained' onClick={() => void handleAdd()} disabled={creating}>
                  {creating ? (isZh ? '新增中...' : 'Adding...') : isZh ? '新增产品' : 'Add Product'}
                </Button>
              </Stack>
            </Stack>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '产品名称' : 'Product name'}</TableCell>
                    <TableCell>{isZh ? '序列号' : 'Serial Number'}</TableCell>
                    <TableCell>{isZh ? '代理' : 'Agent'}</TableCell>
                    <TableCell>{isZh ? '导入时间' : 'Import Time'}</TableCell>
                    <TableCell>{isZh ? '状态' : 'Status'}</TableCell>
                    <TableCell>{isZh ? '软件版本' : 'Software Version'}</TableCell>
                    <TableCell>{isZh ? '固件版本' : 'Firmware Version'}</TableCell>
                    <TableCell align='right'>{isZh ? '操作' : 'Operation'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Stack direction='row' spacing={2} alignItems='center'>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: 'grey.100',
                              border: '1px solid',
                              borderColor: 'divider',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={getProductImage(row.product_name)}
                              alt={row.product_name || row.sn_pid}
                              width={40}
                              height={40}
                              style={{ objectFit: 'contain' }}
                            />
                          </Box>
                          <Box>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                              {row.product_name || '-'}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {row.product_nickname || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{row.sn_pid}</TableCell>
                      <TableCell>
                        {row.agent_name || (row.agent_id ? agentNameById[row.agent_id] : null) || shortId(row.agent_id)}
                      </TableCell>
                      <TableCell>{formatDateTime(row.import_time)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(row.status, isZh)}
                          size='small'
                          color={getStatusColor(row.status)}
                        />
                      </TableCell>
                      <TableCell>{row.software_version || '-'}</TableCell>
                      <TableCell>{row.firmware_version || '-'}</TableCell>
                      <TableCell align='right'>
                        <Stack direction='row' spacing={1} justifyContent='flex-end'>
                          <Button
                            size='small'
                            component={Link}
                            href={`/${lang}/productcenter/machine-product-library/product-info?sn=${encodeURIComponent(row.sn_pid)}`}
                          >
                            {isZh ? '查看' : 'View'}
                          </Button>
                          <Button
                            size='small'
                            color='secondary'
                            disabled={editingId === row.id}
                            onClick={() => void handleEdit(row)}
                          >
                            {editingId === row.id ? (isZh ? '编辑中...' : 'Editing...') : isZh ? '编辑' : 'Edit'}
                          </Button>
                          <Button
                            size='small'
                            color='error'
                            disabled={deletingId === row.id}
                            onClick={() => void handleDelete(row)}
                          >
                            {deletingId === row.id ? (isZh ? '删除中...' : 'Deleting...') : isZh ? '删除' : 'Delete'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align='center'>
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
