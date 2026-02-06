'use client';

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  Active: 'success',
  Idle: 'info',
  Offline: 'error',
  Maintenance: 'warning',
};

const statusColorsZh: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  运行中: 'success',
  空闲: 'info',
  离线: 'error',
  维护中: 'warning',
};

export default function MachineProductLibraryPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const rows = useMemo(
    () =>
      isZh
        ? [
            {
              model: 'RX-3000 Pro',
              sn: 'RX3P-2024-0012',
              agent: '上海代理',
              importTime: '2026-01-18 10:42',
              status: '运行中',
              software: 'v4.6.2',
              firmware: 'FW-2.1.9',
            },
            {
              model: 'RX-3000 Pro',
              sn: 'RX3P-2024-0147',
              agent: '华南代理',
              importTime: '2026-01-22 16:05',
              status: '空闲',
              software: 'v4.6.2',
              firmware: 'FW-2.1.8',
            },
            {
              model: 'RX-2000',
              sn: 'RX2-2023-0091',
              agent: '北京代理',
              importTime: '2025-12-28 09:12',
              status: '离线',
              software: 'v4.5.9',
              firmware: 'FW-2.0.6',
            },
            {
              model: 'RX-Alpha',
              sn: 'RXA-2025-0004',
              agent: '西南代理',
              importTime: '2026-02-02 11:21',
              status: '维护中',
              software: 'v4.6.1',
              firmware: 'FW-2.1.3',
            },
          ]
        : [
            {
              model: 'RX-3000 Pro',
              sn: 'RX3P-2024-0012',
              agent: 'Shanghai Agent',
              importTime: '2026-01-18 10:42',
              status: 'Active',
              software: 'v4.6.2',
              firmware: 'FW-2.1.9',
            },
            {
              model: 'RX-3000 Pro',
              sn: 'RX3P-2024-0147',
              agent: 'South China Agent',
              importTime: '2026-01-22 16:05',
              status: 'Idle',
              software: 'v4.6.2',
              firmware: 'FW-2.1.8',
            },
            {
              model: 'RX-2000',
              sn: 'RX2-2023-0091',
              agent: 'Beijing Agent',
              importTime: '2025-12-28 09:12',
              status: 'Offline',
              software: 'v4.5.9',
              firmware: 'FW-2.0.6',
            },
            {
              model: 'RX-Alpha',
              sn: 'RXA-2025-0004',
              agent: 'Southwest Agent',
              importTime: '2026-02-02 11:21',
              status: 'Maintenance',
              software: 'v4.6.1',
              firmware: 'FW-2.1.3',
            },
          ],
    [isZh]
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

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='overline' color='text.secondary'>
                {isZh ? '运行中' : 'Active'}
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                128
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '本月 +12 台' : '+12 this month'}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='overline' color='text.secondary'>
                {isZh ? '空闲' : 'Idle'}
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                46
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '等待部署' : 'Awaiting deployment'}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='overline' color='text.secondary'>
                {isZh ? '离线' : 'Offline'}
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                9
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '需要跟进' : 'Requires follow-up'}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='overline' color='text.secondary'>
                {isZh ? '维护中' : 'Maintenance'}
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                4
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '工程师处理中' : 'Engineering in progress'}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant='h6'>
                {isZh ? '筛选条件' : 'Filters'}
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '产品型号 / 名称' : 'Model / Product name'}
                  placeholder={isZh ? '输入型号或名称' : 'Type model or name'}
                />
                <TextField
                  fullWidth
                  label={isZh ? '序列号' : 'Serial Number'}
                  placeholder={isZh ? '输入SN' : 'Enter SN'}
                />
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '状态' : 'Status'}</InputLabel>
                  <Select label={isZh ? '状态' : 'Status'} defaultValue=''>
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='active'>{isZh ? '运行中' : 'Active'}</MenuItem>
                    <MenuItem value='idle'>{isZh ? '空闲' : 'Idle'}</MenuItem>
                    <MenuItem value='offline'>{isZh ? '离线' : 'Offline'}</MenuItem>
                    <MenuItem value='maintenance'>
                      {isZh ? '维护中' : 'Maintenance'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '代理' : 'Agent'}</InputLabel>
                  <Select label={isZh ? '代理' : 'Agent'} defaultValue=''>
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='east'>
                      {isZh ? '上海代理' : 'Shanghai Agent'}
                    </MenuItem>
                    <MenuItem value='south'>
                      {isZh ? '华南代理' : 'South China Agent'}
                    </MenuItem>
                    <MenuItem value='north'>
                      {isZh ? '北京代理' : 'Beijing Agent'}
                    </MenuItem>
                    <MenuItem value='southwest'>
                      {isZh ? '西南代理' : 'Southwest Agent'}
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '软件版本' : 'Software Version'}</InputLabel>
                  <Select label={isZh ? '软件版本' : 'Software Version'} defaultValue=''>
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='v4.6.2'>v4.6.2</MenuItem>
                    <MenuItem value='v4.6.1'>v4.6.1</MenuItem>
                    <MenuItem value='v4.5.9'>v4.5.9</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '固件版本' : 'Firmware Version'}</InputLabel>
                  <Select label={isZh ? '固件版本' : 'Firmware Version'} defaultValue=''>
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='fw-2.1.9'>FW-2.1.9</MenuItem>
                    <MenuItem value='fw-2.1.8'>FW-2.1.8</MenuItem>
                    <MenuItem value='fw-2.1.3'>FW-2.1.3</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Divider />
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined'>
                  {isZh ? '重置' : 'Reset'}
                </Button>
                <Button variant='contained'>
                  {isZh ? '查询' : 'Search'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
              <Typography variant='h6'>
                {isZh ? '产品列表' : 'Product List'}
              </Typography>
              <Button variant='contained'>
                {isZh ? '新增产品' : 'Add Product'}
              </Button>
            </Stack>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '型号' : 'Model'}</TableCell>
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
                    <TableRow key={row.sn} hover>
                      <TableCell>{row.model}</TableCell>
                      <TableCell>{row.sn}</TableCell>
                      <TableCell>{row.agent}</TableCell>
                      <TableCell>{row.importTime}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size='small'
                          color={
                            isZh ? statusColorsZh[row.status] : statusColors[row.status]
                          }
                        />
                      </TableCell>
                      <TableCell>{row.software}</TableCell>
                      <TableCell>{row.firmware}</TableCell>
                      <TableCell align='right'>
                        <Stack direction='row' spacing={1} justifyContent='flex-end'>
                          <Button
                            size='small'
                            component={Link}
                            href={`/${lang}/productcenter/machine-product-library/product-info`}
                          >
                            {isZh ? '查看' : 'View'}
                          </Button>
                          <Button
                            size='small'
                            color='secondary'
                            component={Link}
                            href={`/${lang}/productcenter/machine-product-library/product-edit`}
                          >
                            {isZh ? '编辑' : 'Edit'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
