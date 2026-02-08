'use client';

import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
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
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

type LeadStatusEn = 'Unfollowed' | 'Following Up' | 'Converted' | 'Lost';
type LeadStatusZh = '未跟进' | '跟进中' | '已转化' | '未成交';

type LeadRow = {
  id: string;
  companyName: string;
  leadStatus: LeadStatusEn | LeadStatusZh;
  owner: string;
  source: string;
  sourceCampaign: string;
  location: string;
  createdAt: string;
};

const statusColorMapEn: Record<LeadStatusEn, 'warning' | 'info' | 'success' | 'default'> = {
  Unfollowed: 'warning',
  'Following Up': 'info',
  Converted: 'success',
  Lost: 'default',
};

const statusColorMapZh: Record<LeadStatusZh, 'warning' | 'info' | 'success' | 'default'> = {
  未跟进: 'warning',
  跟进中: 'info',
  已转化: 'success',
  未成交: 'default',
};

export default function SalesLeadsManagementPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const statistics = useMemo(
    () =>
      isZh
        ? [
            {
              key: 'unfollowed',
              title: '未跟进',
              value: 24,
              icon: <ReportProblemOutlinedIcon color='warning' />,
            },
            {
              key: 'following',
              title: '跟进中',
              value: 2,
              icon: <ForumOutlinedIcon color='info' />,
            },
            {
              key: 'converted',
              title: '已转化',
              value: 0,
              icon: <ThumbUpAltOutlinedIcon color='success' />,
            },
            {
              key: 'lost',
              title: '未成交',
              value: 0,
              icon: <SentimentDissatisfiedOutlinedIcon color='disabled' />,
            },
          ]
        : [
            {
              key: 'unfollowed',
              title: 'Unfollowed',
              value: 24,
              icon: <ReportProblemOutlinedIcon color='warning' />,
            },
            {
              key: 'following',
              title: 'Following Up',
              value: 2,
              icon: <ForumOutlinedIcon color='info' />,
            },
            {
              key: 'converted',
              title: 'Converted',
              value: 0,
              icon: <ThumbUpAltOutlinedIcon color='success' />,
            },
            {
              key: 'lost',
              title: 'Lost',
              value: 0,
              icon: <SentimentDissatisfiedOutlinedIcon color='disabled' />,
            },
          ],
    [isZh]
  );

  const rows = useMemo<LeadRow[]>(
    () =>
      isZh
        ? [
            {
              id: 'SL-1001',
              companyName: 'Robotx AI Inc.',
              leadStatus: '跟进中',
              owner: 'Robotx AI Inc.',
              source: '官网',
              sourceCampaign: '-',
              location: 'CA / CA',
              createdAt: '2026-02-03 10:20',
            },
            {
              id: 'SL-1002',
              companyName: 'Aster Robotics',
              leadStatus: '跟进中',
              owner: 'Robotx AI Inc.',
              source: '线上营销 - Google',
              sourceCampaign: 'Product Search',
              location: 'CA / LA',
              createdAt: '2026-02-02 08:14',
            },
            {
              id: 'SL-1003',
              companyName: 'Summit Dining Group',
              leadStatus: '未跟进',
              owner: 'Robotx AI Inc.',
              source: '线上营销 - Facebook',
              sourceCampaign: '-',
              location: 'CA / Poway',
              createdAt: '2026-02-01 16:36',
            },
            {
              id: 'SL-1004',
              companyName: 'Blue Harbor Hospitality',
              leadStatus: '未跟进',
              owner: 'Robotx AI Inc.',
              source: '官网',
              sourceCampaign: '-',
              location: 'CA / San Francisco',
              createdAt: '2026-01-29 12:09',
            },
            {
              id: 'SL-1005',
              companyName: 'North Peak Casino',
              leadStatus: '未跟进',
              owner: 'Robotx AI Inc.',
              source: '线上营销 - Google',
              sourceCampaign: '-',
              location: 'CA / Sacramento',
              createdAt: '2026-01-28 09:03',
            },
          ]
        : [
            {
              id: 'SL-1001',
              companyName: 'Robotx AI Inc.',
              leadStatus: 'Following Up',
              owner: 'Robotx AI Inc.',
              source: 'Official Website',
              sourceCampaign: '-',
              location: 'CA / CA',
              createdAt: '2026-02-03 10:20',
            },
            {
              id: 'SL-1002',
              companyName: 'Aster Robotics',
              leadStatus: 'Following Up',
              owner: 'Robotx AI Inc.',
              source: 'Online Marketing - Google',
              sourceCampaign: 'Product Search',
              location: 'CA / LA',
              createdAt: '2026-02-02 08:14',
            },
            {
              id: 'SL-1003',
              companyName: 'Summit Dining Group',
              leadStatus: 'Unfollowed',
              owner: 'Robotx AI Inc.',
              source: 'Online Marketing - Facebook',
              sourceCampaign: '-',
              location: 'CA / Poway',
              createdAt: '2026-02-01 16:36',
            },
            {
              id: 'SL-1004',
              companyName: 'Blue Harbor Hospitality',
              leadStatus: 'Unfollowed',
              owner: 'Robotx AI Inc.',
              source: 'Official Website',
              sourceCampaign: '-',
              location: 'CA / San Francisco',
              createdAt: '2026-01-29 12:09',
            },
            {
              id: 'SL-1005',
              companyName: 'North Peak Casino',
              leadStatus: 'Unfollowed',
              owner: 'Robotx AI Inc.',
              source: 'Online Marketing - Google',
              sourceCampaign: '-',
              location: 'CA / Sacramento',
              createdAt: '2026-01-28 09:03',
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
              {isZh ? '销售线索管理' : 'Sales Leads Management'}
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
                {isZh ? '销售线索管理' : 'Sales Leads Management'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {isZh
                  ? '聚合线索状态、来源与归属，提升线索转化效率。'
                  : 'Track lead status, source, and ownership to improve conversion speed.'}
              </Typography>
            </Box>
            <Stack direction='row' spacing={1.5}>
              <Button variant='outlined'>{isZh ? '导出线索' : 'Export Leads'}</Button>
              <Button variant='contained' startIcon={<ContactPhoneOutlinedIcon />}>
                {isZh ? '新增线索' : 'Add Lead'}
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {statistics.map((item) => (
            <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Stack spacing={1}>
                      <Stack direction='row' spacing={0.75} alignItems='center'>
                        <Typography variant='body1' color='text.secondary'>
                          {item.title}
                        </Typography>
                        <Tooltip
                          title={
                            isZh
                              ? '统计结果基于当前筛选条件'
                              : 'Statistics are based on current filters'
                          }
                        >
                          <InfoOutlinedIcon fontSize='small' color='disabled' />
                        </Tooltip>
                      </Stack>
                      <Typography variant='h4' sx={{ fontWeight: 700 }}>
                        {item.value}
                      </Typography>
                    </Stack>
                    {item.icon}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant='h6'>{isZh ? '筛选条件' : 'Filters'}</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '公司名称' : 'Company Name'}
                  placeholder={
                    isZh ? '请输入公司名称关键字' : 'Enter company name keyword'
                  }
                />
                <TextField
                  select
                  fullWidth
                  label={isZh ? '线索状态' : 'Lead Status'}
                  defaultValue=''
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='unfollowed'>{isZh ? '未跟进' : 'Unfollowed'}</MenuItem>
                  <MenuItem value='following'>{isZh ? '跟进中' : 'Following Up'}</MenuItem>
                  <MenuItem value='converted'>{isZh ? '已转化' : 'Converted'}</MenuItem>
                  <MenuItem value='lost'>{isZh ? '未成交' : 'Lost'}</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label={isZh ? '线索来源' : 'Lead Source'}
                  defaultValue=''
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='official'>{isZh ? '官网' : 'Official Website'}</MenuItem>
                  <MenuItem value='google'>
                    {isZh ? '线上营销 - Google' : 'Online Marketing - Google'}
                  </MenuItem>
                  <MenuItem value='facebook'>
                    {isZh ? '线上营销 - Facebook' : 'Online Marketing - Facebook'}
                  </MenuItem>
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
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography variant='h6'>{isZh ? '线索列表' : 'Leads List'}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? `共 ${rows.length} 条记录` : `${rows.length} records`}
              </Typography>
            </Stack>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '公司名称' : 'Company Name'}</TableCell>
                    <TableCell>{isZh ? '线索状态' : 'Lead Status'}</TableCell>
                    <TableCell>{isZh ? '线索归属' : 'Lead Owner'}</TableCell>
                    <TableCell>{isZh ? '线索来源' : 'Lead Source'}</TableCell>
                    <TableCell>
                      {isZh ? '来源市场活动' : 'Source Campaign'}
                    </TableCell>
                    <TableCell>{isZh ? '地区' : 'Location'}</TableCell>
                    <TableCell>{isZh ? '创建时间' : 'Created At'}</TableCell>
                    <TableCell align='right'>{isZh ? '操作' : 'Operation'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.companyName}</TableCell>
                      <TableCell>
                        <Chip
                          size='small'
                          label={row.leadStatus}
                          color={
                            isZh
                              ? statusColorMapZh[row.leadStatus as LeadStatusZh]
                              : statusColorMapEn[row.leadStatus as LeadStatusEn]
                          }
                        />
                      </TableCell>
                      <TableCell>{row.owner}</TableCell>
                      <TableCell>{row.source}</TableCell>
                      <TableCell>{row.sourceCampaign}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell align='right'>
                        <Stack
                          direction='row'
                          spacing={0.5}
                          alignItems='center'
                          justifyContent='flex-end'
                        >
                          <Button size='small'>{isZh ? '查看' : 'View'}</Button>
                          <Typography color='text.disabled'>|</Typography>
                          <Button size='small' color='secondary'>
                            {isZh ? '填写跟进记录' : 'Add Follow-up'}
                          </Button>
                          <Tooltip title={isZh ? '更多操作' : 'More actions'}>
                            <IconButton size='small'>
                              <MoreHorizOutlinedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
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
