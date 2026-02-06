'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
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
import { useMemo } from 'react';

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'default',
};

const statusColorsZh: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  启用: 'success',
  待审核: 'warning',
  停用: 'default',
};

export default function SubordinateAgentManagementPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const rows = useMemo(
    () =>
      isZh
        ? [
            {
              clientCount: 84,
              company: '深圳智控科技',
              account: 'sz_control',
              location: '中国 · 深圳',
              area: '华南',
              storeCount: 22,
              bindingCount: 71,
              superior: '普渡科技',
              createdAt: '2026-01-15 11:20',
              status: '启用',
            },
            {
              clientCount: 39,
              company: '星河服务',
              account: 'galaxy_ops',
              location: '中国 · 杭州',
              area: '华东',
              storeCount: 9,
              bindingCount: 18,
              superior: '普渡科技',
              createdAt: '2026-01-19 09:45',
              status: '待审核',
            },
            {
              clientCount: 16,
              company: '北极星机器人',
              account: 'polaris_team',
              location: '中国 · 北京',
              area: '华北',
              storeCount: 6,
              bindingCount: 10,
              superior: '普渡科技',
              createdAt: '2025-12-29 15:12',
              status: '停用',
            },
          ]
        : [
            {
              clientCount: 84,
              company: 'Shenzhen Control Tech',
              account: 'sz_control',
              location: 'China · Shenzhen',
              area: 'South China',
              storeCount: 22,
              bindingCount: 71,
              superior: 'Pudu Technology',
              createdAt: '2026-01-15 11:20',
              status: 'Active',
            },
            {
              clientCount: 39,
              company: 'Galaxy Service',
              account: 'galaxy_ops',
              location: 'China · Hangzhou',
              area: 'East China',
              storeCount: 9,
              bindingCount: 18,
              superior: 'Pudu Technology',
              createdAt: '2026-01-19 09:45',
              status: 'Pending',
            },
            {
              clientCount: 16,
              company: 'Polaris Robotics',
              account: 'polaris_team',
              location: 'China · Beijing',
              area: 'North China',
              storeCount: 6,
              bindingCount: 10,
              superior: 'Pudu Technology',
              createdAt: '2025-12-29 15:12',
              status: 'Inactive',
            },
          ],
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
            <Button variant='contained'>
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
                />
                <TextField
                  fullWidth
                  label={isZh ? '代理客户数' : 'Client Number by Proxy'}
                  placeholder={isZh ? '输入客户数' : 'Enter client count'}
                />
                <TextField
                  fullWidth
                  label={isZh ? '公司所在地' : 'Company location'}
                  placeholder={isZh ? '输入城市 / 国家' : 'Type city or country'}
                />
                <TextField
                  fullWidth
                  label={isZh ? '创建时间' : 'Creation Time'}
                  placeholder={isZh ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  select
                  fullWidth
                  label={isZh ? '状态' : 'Status'}
                  defaultValue=''
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='active'>{isZh ? '启用' : 'Active'}</MenuItem>
                  <MenuItem value='pending'>{isZh ? '待审核' : 'Pending'}</MenuItem>
                  <MenuItem value='inactive'>{isZh ? '停用' : 'Inactive'}</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label={isZh ? '销售区域' : 'Sales Area'}
                  defaultValue=''
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='cn-south'>{isZh ? '华南' : 'South China'}</MenuItem>
                  <MenuItem value='cn-east'>{isZh ? '华东' : 'East China'}</MenuItem>
                  <MenuItem value='cn-north'>{isZh ? '华北' : 'North China'}</MenuItem>
                </TextField>
              </Stack>
              <Divider />
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined'>{isZh ? '重置' : 'Reset'}</Button>
                <Button variant='contained'>{isZh ? '搜索' : 'Search'}</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
              <Typography variant='h6'>
                {isZh ? '代理列表' : 'Agent List'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '共 3 条记录' : '3 records'}
              </Typography>
            </Stack>
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
                    <TableCell>
                      {isZh ? '激活绑定数' : 'Activation Binding Number'}
                    </TableCell>
                    <TableCell>{isZh ? '上级代理名称' : 'Superior Agent Name'}</TableCell>
                    <TableCell>{isZh ? '创建时间' : 'Creation Time'}</TableCell>
                    <TableCell>{isZh ? '状态' : 'Status'}</TableCell>
                    <TableCell align='right'>{isZh ? '操作' : 'Operation'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.account} hover>
                      <TableCell>{row.clientCount}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.account}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.area}</TableCell>
                      <TableCell>{row.storeCount}</TableCell>
                      <TableCell>{row.bindingCount}</TableCell>
                      <TableCell>{row.superior}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size='small'
                          color={isZh ? statusColorsZh[row.status] : statusColors[row.status]}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Stack direction='row' spacing={1} justifyContent='flex-end'>
                          <Button size='small'>{isZh ? '查看' : 'View'}</Button>
                          <Button size='small' color='secondary'>
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
