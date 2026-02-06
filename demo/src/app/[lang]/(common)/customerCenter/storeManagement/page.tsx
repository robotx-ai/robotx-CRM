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
  IconButton,
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
  Link as MuiLink,
} from '@mui/material';
import { useMemo } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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

export default function StoreManagementPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const rows = useMemo(
    () =>
      isZh
        ? [
            {
              clientCount: 128,
              company: 'Robotx AI Inc.',
              account: 'robotx_admin',
              location: '美国 · 加州',
              area: '北美',
              storeCount: 32,
              bindingCount: 96,
              superior: 'Pudu Technology',
              createdAt: '2026-01-18 10:42',
              status: '启用',
            },
            {
              clientCount: 64,
              company: '星云智服',
              account: 'nebulax',
              location: '中国 · 上海',
              area: '华东',
              storeCount: 18,
              bindingCount: 41,
              superior: '普渡科技',
              createdAt: '2026-01-22 16:05',
              status: '待审核',
            },
            {
              clientCount: 22,
              company: '鸿景机器人',
              account: 'horizon_ops',
              location: '中国 · 北京',
              area: '华北',
              storeCount: 8,
              bindingCount: 12,
              superior: '普渡科技',
              createdAt: '2025-12-28 09:12',
              status: '停用',
            },
          ]
        : [
            {
              clientCount: 128,
              company: 'Robotx AI Inc.',
              account: 'robotx_admin',
              location: 'USA · California',
              area: 'North America',
              storeCount: 32,
              bindingCount: 96,
              superior: 'Pudu Technology',
              createdAt: '2026-01-18 10:42',
              status: 'Active',
            },
            {
              clientCount: 64,
              company: 'Nebula Service',
              account: 'nebulax',
              location: 'China · Shanghai',
              area: 'East China',
              storeCount: 18,
              bindingCount: 41,
              superior: 'Pudu Technology',
              createdAt: '2026-01-22 16:05',
              status: 'Pending',
            },
            {
              clientCount: 22,
              company: 'Horizon Robotics',
              account: 'horizon_ops',
              location: 'China · Beijing',
              area: 'North China',
              storeCount: 8,
              bindingCount: 12,
              superior: 'Pudu Technology',
              createdAt: '2025-12-28 09:12',
              status: 'Inactive',
            },
          ],
    [isZh]
  );

  const statusTip = (
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
              {isZh ? '门店管理' : 'Store Management'}
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
                {isZh ? '门店管理' : 'Store Management'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {isZh
                  ? '统一查看代理门店与客户数据，快速定位问题。'
                  : 'Review agent stores and customer metrics in one place.'}
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
                  <MenuItem value='na'>{isZh ? '北美' : 'North America'}</MenuItem>
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
                {isZh ? '门店列表' : 'Store List'}
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
                    <TableCell>
                      <Box
                        component='span'
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box component='span'>{isZh ? '状态' : 'Status'}</Box>
                        <Tooltip title={statusTip} placement='top'>
                          <IconButton
                            size='small'
                            aria-label='status-help'
                            sx={{ color: 'inherit', p: 0.25 }}
                          >
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
