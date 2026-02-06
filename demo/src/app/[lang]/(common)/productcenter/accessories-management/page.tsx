'use client';

import Link from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputAdornment,
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
  Link as MuiLink,
} from '@mui/material';

export default function AccessoriesManagementPage({
  params,
}: {
  params: { lang: string };
}) {
  const isZh = params.lang === 'zh-CN';

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Breadcrumbs separator='/' aria-label='breadcrumb'>
            <MuiLink
              component={Link}
              underline='hover'
              color='text.secondary'
              href={`/${params.lang}/productcenter/machine-product-library`}
            >
              {isZh ? '产品中心' : 'Product Center'}
            </MuiLink>
            <Typography color='text.primary'>
              {isZh ? '配件管理' : 'Accessories Management'}
            </Typography>
          </Breadcrumbs>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              {isZh ? '配件管理' : 'Accessories Management'}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              {isZh
                ? '查看配件状态，跟踪维护与到期信息。'
                : 'Review accessory status and track maintenance and expiration details.'}
            </Typography>
          </Box>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h6'>{isZh ? '筛选条件' : 'Filters'}</Typography>
                <Button size='small'>{isZh ? '收起' : 'Collapse'}</Button>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '配件名称' : 'Accessory name'}
                  placeholder={isZh ? '输入配件名称' : 'Enter accessory name'}
                />
                <TextField
                  fullWidth
                  label='SN/MAC'
                  placeholder={isZh ? '输入SN或MAC' : 'Enter SN or MAC'}
                />
                <TextField
                  fullWidth
                  label={isZh ? '门店名称' : 'Store name'}
                  placeholder={isZh ? '输入门店名称' : 'Enter store name'}
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '剩余维保天数' : 'Remaining maintenance days'}
                  placeholder={isZh ? '输入天数' : 'Enter days'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {isZh ? '天' : 'Days'}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label={isZh ? '激活时间' : 'Activation time'}
                  placeholder={isZh ? '选择时间' : 'Select time'}
                />
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '软件版本' : 'Software version'}</InputLabel>
                  <Select label={isZh ? '软件版本' : 'Software version'} defaultValue=''>
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='sc5.14'>SC5.14</MenuItem>
                    <MenuItem value='sc5.16'>SC5.16</MenuItem>
                    <MenuItem value='sc5.17'>SC5.17</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>{isZh ? '固件版本' : 'Firmware version'}</InputLabel>
                  <Select label={isZh ? '固件版本' : 'Firmware version'} defaultValue=''>
                    <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                    <MenuItem value='22.2.12'>22.2.12</MenuItem>
                    <MenuItem value='22.2.39'>22.2.39</MenuItem>
                    <MenuItem value='22.2.40'>22.2.40</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Divider />
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined'>{isZh ? '重置' : 'Reset'}</Button>
                <Button variant='contained'>{isZh ? '查询' : 'query'}</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '配件名称' : 'Accessory name'}</TableCell>
                    <TableCell>{isZh ? '代理' : 'Agent'}</TableCell>
                    <TableCell>{isZh ? '维保状态' : 'Maintenance status'}</TableCell>
                    <TableCell>
                      {isZh ? '维保到期时间' : 'Maintenance expiration date'}
                    </TableCell>
                    <TableCell>{isZh ? '状态' : 'Status'}</TableCell>
                    <TableCell align='right'>{isZh ? '操作' : 'Operation'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      <Typography variant='body2' color='text.secondary'>
                        {isZh ? '暂无数据' : 'No data'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
              {isZh ? '总计 0 条' : 'Total 0'}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
