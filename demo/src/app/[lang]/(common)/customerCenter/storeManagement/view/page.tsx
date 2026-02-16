'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type DetailItem = {
  key: string;
  value: string;
};

function safeDecodeTwice(value: string) {
  try {
    return decodeURIComponent(decodeURIComponent(value));
  } catch {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
}

export default function StoreDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';
  const [tab, setTab] = useState(0);

  const storeNameRaw = searchParams.get('name') ?? 'Demo%20Robotx';
  const storeName = safeDecodeTwice(storeNameRaw);

  const shopInfoLeft = useMemo<DetailItem[]>(
    () =>
      isZh
        ? [
            { key: '门店名称', value: storeName },
            { key: '门店地址', value: 'United States / Irvine, CA, USA' },
            { key: '联络官职位', value: 'tech' },
            { key: '联系邮箱', value: '-' },
            { key: '代理客户代码', value: 'US0266' },
            { key: '授权码', value: searchParams.get('id') ?? '603270020' },
          ]
        : [
            { key: 'Store name', value: storeName },
            { key: 'Store address', value: 'United States / Irvine, CA, USA' },
            { key: 'Liaison Officer position', value: 'tech' },
            { key: 'Contact email', value: '-' },
            { key: 'Agent Customer Code', value: 'US0266' },
            { key: 'Authorization code', value: searchParams.get('id') ?? '603270020' },
          ],
    [isZh, searchParams, storeName]
  );

  const shopInfoRight = useMemo<DetailItem[]>(
    () =>
      isZh
        ? [
            { key: '行业领域', value: 'Industrial Facility/Paper and Paper Products Manufacturing' },
            { key: '门店联系人', value: 'Aaron' },
            { key: '电话', value: '-' },
            { key: '代理', value: 'Robotx AI Inc.' },
            { key: '平台源地址', value: 'us-east-1' },
          ]
        : [
            { key: 'Industry Sector', value: 'Industrial Facility/Paper and Paper Products Manufacturing' },
            { key: 'Store contact', value: 'Aaron' },
            { key: 'Phone Number', value: '-' },
            { key: 'Agent', value: 'Robotx AI Inc.' },
            { key: 'Platform source address', value: 'us-east-1' },
          ],
    [isZh]
  );

  const merchantInfo = useMemo<DetailItem[]>(
    () =>
      isZh
        ? [
            { key: '商户名称', value: '-' },
            { key: '管理员账号', value: '-' },
            { key: '管理员邮箱', value: '-' },
          ]
        : [
            { key: 'merchant name', value: '-' },
            { key: 'Administrator account', value: '-' },
            { key: 'Administrator email', value: '-' },
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
            <MuiLink
              component={Link}
              underline='hover'
              color='text.secondary'
              href={`/${lang}/customerCenter/storeManagement`}
            >
              {isZh ? '门店管理' : 'Store Management'}
            </MuiLink>
            <Typography color='text.primary'>
              {isZh ? '门店详情' : 'Store Details'}
            </Typography>
          </Breadcrumbs>
        </Stack>

        <Card>
          <CardContent sx={{ pb: 2 }}>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
              <Typography variant='h5' sx={{ fontWeight: 700 }}>
                {storeName}
              </Typography>
            </Stack>

            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label={isZh ? '门店信息' : 'shop information'} />
              <Tab label={isZh ? '门店账号' : 'Store Account'} />
              <Tab label={isZh ? '门店地图' : 'Store Map'} />
            </Tabs>
            <Divider sx={{ mb: 3 }} />

            {tab === 0 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
                    {isZh ? '商户信息' : 'Merchant Information'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.25}>
                        <Typography color='text.secondary'>
                          {merchantInfo[0].key}: <Box component='span' color='text.primary'>{merchantInfo[0].value}</Box>
                        </Typography>
                        <Typography color='text.secondary'>
                          {merchantInfo[2].key}: <Box component='span' color='text.primary'>{merchantInfo[2].value}</Box>
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography color='text.secondary'>
                        {merchantInfo[1].key}: <Box component='span' color='text.primary'>{merchantInfo[1].value}</Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
                    {isZh ? '门店信息' : 'shop information'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.25}>
                        {shopInfoLeft.map((item) => (
                          <Typography key={item.key} color='text.secondary'>
                            {item.key}: <Box component='span' color='text.primary'>{item.value}</Box>
                          </Typography>
                        ))}
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.25}>
                        {shopInfoRight.map((item) => (
                          <Typography key={item.key} color='text.secondary'>
                            {item.key}: <Box component='span' color='text.primary'>{item.value}</Box>
                          </Typography>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 700, mb: 1.5 }}>
                    {isZh ? '服务员信息' : 'Waitstaff Information'}
                  </Typography>
                  <Typography color='text.secondary'>
                    {isZh ? '关联员工' : 'Associated Employee'}:{' '}
                    <Box component='span' color='text.primary'>
                      Aaron Yang (tech@usrobotx.com)
                    </Box>
                  </Typography>
                </Box>
              </Stack>
            )}

            {tab === 1 && (
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>{isZh ? '账号' : 'Account'}</TableCell>
                      <TableCell>{isZh ? '角色' : 'Role'}</TableCell>
                      <TableCell>{isZh ? '邮箱' : 'Email'}</TableCell>
                      <TableCell>{isZh ? '状态' : 'Status'}</TableCell>
                      <TableCell>{isZh ? '操作' : 'Operation'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                        <Stack alignItems='center' spacing={1}>
                          <InboxOutlinedIcon color='disabled' sx={{ fontSize: 38 }} />
                          <Typography variant='body2' color='text.secondary'>
                            {isZh ? '暂无数据' : 'No data'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tab === 2 && (
              <Box sx={{ py: 8 }}>
                <Stack alignItems='center' spacing={1.5}>
                  <InboxOutlinedIcon color='disabled' sx={{ fontSize: 42 }} />
                  <Typography color='text.secondary'>
                    {isZh ? '暂无门店地图数据' : 'No store map data'}
                  </Typography>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        <Stack direction='row' justifyContent='center'>
          <Button
            variant='contained'
            component={Link}
            href={`/${lang}/customerCenter/storeManagement`}
          >
            {isZh ? '返回' : 'Return'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
