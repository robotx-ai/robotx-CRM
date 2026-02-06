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
import { useMemo, useState } from 'react';

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
  const [storeTab, setStoreTab] = useState(0);

  const rows = useMemo(
    () =>
      isZh
        ? [
            {
              model: 'PUDU CC1 Pro',
              subtitle: 'PUDU CC1 Pro，CCBC02，美规，灰色 & 黄绿色',
              image: '/assets/images/products/pudu-cc1.png',
              sn: '8880R5A16070015',
              agent: 'Robotx AI Inc.',
              importTime: '2026-01-12 12:24:02',
              status: '运行中',
              software: 'SC5.14.46.2512092039-cc1',
              firmware: '22.2.12',
            },
            {
              model: 'PUDU MT1 Max',
              subtitle: 'PUDU MT1 Max，MTBC03，美规，黑色',
              image: '/assets/images/products/pudu-mt1-max.png',
              sn: '868025B09070060',
              agent: 'Robotx AI Inc.',
              importTime: '2026-01-12 11:30:14',
              status: '运行中',
              software: 'SC5.17.13.2511182031-mt1',
              firmware: '22.2.40',
            },
            {
              model: 'PUDU MT1 Vac',
              subtitle: 'PUDU MT1 Vac，MTBC02，美规，黑色',
              image: '/assets/images/products/pudu-mt1-vac.png',
              sn: '899025921070013',
              agent: 'Robotx AI Inc.',
              importTime: '2026-01-12 10:13:36',
              status: '运行中',
              software: 'SC5.16.11.2510101914-mt1',
              firmware: '22.2.39',
            },
          ]
        : [
            {
              model: 'PUDU CC1 Pro',
              subtitle: 'PUDU CC1 Pro, CCBC02, USA standard, Grey & Yellow Green',
              image: '/assets/images/products/pudu-cc1.png',
              sn: '8880R5A16070015',
              agent: 'Robotx AI Inc.',
              importTime: '2026-01-12 12:24:02',
              status: 'Active',
              software: 'SC5.14.46.2512092039-cc1',
              firmware: '22.2.12',
            },
            {
              model: 'PUDU MT1 Max',
              subtitle: 'PUDU MT1 Max, MTBC03, USA standard, Black',
              image: '/assets/images/products/pudu-mt1-max.png',
              sn: '868025B09070060',
              agent: 'Robotx AI Inc.',
              importTime: '2026-01-12 11:30:14',
              status: 'Active',
              software: 'SC5.17.13.2511182031-mt1',
              firmware: '22.2.40',
            },
            {
              model: 'PUDU MT1 Vac',
              subtitle: 'PUDU MT1 Vac, MTBC02, USA standard, Black',
              image: '/assets/images/products/pudu-mt1-vac.png',
              sn: '899025921070013',
              agent: 'Robotx AI Inc.',
              importTime: '2026-01-12 10:13:36',
              status: 'Active',
              software: 'SC5.16.11.2510101914-mt1',
              firmware: '22.2.39',
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

        <Card>
          <CardContent>
            <Tabs
              value={storeTab}
              onChange={(_, value) => setStoreTab(value)}
              textColor='primary'
              indicatorColor='primary'
              sx={{ '& .MuiTab-root': { textTransform: 'none' } }}
            >
              <Tab
                label={isZh ? '门店已安装 (3)' : 'Installed in the store (3)'}
              />
              <Tab label={isZh ? '库存未绑定' : 'Unbound in stock'} />
            </Tabs>
          </CardContent>
        </Card>

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
                    <TableRow key={row.sn} hover>
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
                              src={row.image}
                              alt={row.model}
                              width={40}
                              height={40}
                              style={{ objectFit: 'contain' }}
                            />
                          </Box>
                          <Box>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                              {row.model}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {row.subtitle}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
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
