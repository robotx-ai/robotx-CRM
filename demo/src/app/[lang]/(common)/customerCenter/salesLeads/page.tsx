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
  Link as MuiLink,
  Skeleton,
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
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type LeadStatus = 'Unfollowed' | 'Following Up' | 'Converted' | 'Lost';
type LeadSource = 'Sales Email' | 'Shopify Website';

type SalesLeadRow = {
  id: string;
  owner_user_id: string;
  contact_name: string;
  contact_email: string;
  phone_number: string | null;
  interested_product: string | null;
  message: string | null;
  location: string | null;
  lead_source: LeadSource;
  source_campaign: string | null;
  lead_status: LeadStatus;
  created_at: string | null;
  updated_at: string | null;
};

type SalesLeadListResponse = {
  total: number;
  items: SalesLeadRow[];
};

type LeadFilters = {
  keyword: string;
  status: '' | LeadStatus;
  leadSource: '' | LeadSource;
  location: string;
};

const defaultFilters: LeadFilters = {
  keyword: '',
  status: '',
  leadSource: '',
  location: '',
};

const statusColorMap: Record<
  LeadStatus,
  'warning' | 'info' | 'success' | 'default'
> = {
  Unfollowed: 'warning',
  'Following Up': 'info',
  Converted: 'success',
  Lost: 'default',
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

function formatUsPhoneNumber(value: string | null): string {
  if (!value) {
    return '-';
  }

  const digits = value.replace(/\D/g, '');
  if (digits.length < 10) {
    return value;
  }

  const trimmed = digits.slice(0, 10);
  return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6, 10)}`;
}

function getStatusLabel(status: LeadStatus, isZh: boolean): string {
  if (!isZh) {
    return status;
  }

  if (status === 'Unfollowed') return '未跟进';
  if (status === 'Following Up') return '跟进中';
  if (status === 'Converted') return '已转化';
  return '未成交';
}

function getSourceLabel(source: LeadSource, isZh: boolean): string {
  if (!isZh) {
    return source;
  }

  if (source === 'Sales Email') {
    return '销售邮件';
  }
  return 'Shopify 网站';
}

export default function SalesLeadsManagementPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : (langParam ?? 'en-US');
  const isZh = lang === 'zh-CN';

  const [rows, setRows] = useState<SalesLeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);

  const loadLeads = useCallback(
    async (nextFilters: LeadFilters) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.set('limit', '200');

        const keyword = nextFilters.keyword.trim();
        const location = nextFilters.location.trim();

        if (keyword) {
          query.set('keyword', keyword);
        }
        if (nextFilters.status) {
          query.set('status', nextFilters.status);
        }
        if (nextFilters.leadSource) {
          query.set('lead_source', nextFilters.leadSource);
        }
        if (location) {
          query.set('location', location);
        }

        const response = await fetch(
          `/api/v1/customerCenter/salesLeads?${query.toString()}`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load sales leads: ${response.status}`);
        }

        const payload = (await response.json()) as SalesLeadListResponse;
        setRows(payload.items ?? []);
        setTotal(payload.total ?? 0);
      } catch (error) {
        console.error(error);
        setRows([]);
        setTotal(0);
        window.alert(isZh ? '销售线索加载失败' : 'Failed to load sales leads');
      } finally {
        setLoading(false);
      }
    },
    [isZh]
  );

  useEffect(() => {
    void loadLeads(defaultFilters);
  }, [loadLeads]);

  const handleSearch = useCallback(() => {
    void loadLeads(filters);
  }, [filters, loadLeads]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    void loadLeads(defaultFilters);
  }, [loadLeads]);

  const statistics = useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      Unfollowed: 0,
      'Following Up': 0,
      Converted: 0,
      Lost: 0,
    };

    rows.forEach((row) => {
      counts[row.lead_status] += 1;
    });

    return [
      {
        key: 'unfollowed',
        title: isZh ? '未跟进' : 'Unfollowed',
        value: counts.Unfollowed,
        icon: <ReportProblemOutlinedIcon color='warning' />,
      },
      {
        key: 'following',
        title: isZh ? '跟进中' : 'Following Up',
        value: counts['Following Up'],
        icon: <ForumOutlinedIcon color='info' />,
      },
      {
        key: 'converted',
        title: isZh ? '已转化' : 'Converted',
        value: counts.Converted,
        icon: <ThumbUpAltOutlinedIcon color='success' />,
      },
      {
        key: 'lost',
        title: isZh ? '未成交' : 'Lost',
        value: counts.Lost,
        icon: <SentimentDissatisfiedOutlinedIcon color='disabled' />,
      },
    ];
  }, [isZh, rows]);

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
                  ? '聚合联系表单线索并按状态跟进，提升线索转化效率。'
                  : 'Track contact-form leads and follow-up status to improve conversion speed.'}
              </Typography>
            </Box>
            <Stack direction='row' spacing={1.5}>
              <Button variant='outlined'>
                {isZh ? '导出线索' : 'Export Leads'}
              </Button>
              <Button
                variant='contained'
                startIcon={<ContactPhoneOutlinedIcon />}
              >
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
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='flex-start'
                  >
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
              <Typography variant='h6'>
                {isZh ? '筛选条件' : 'Filters'}
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={isZh ? '关键词' : 'Keyword'}
                  placeholder={
                    isZh
                      ? '姓名 / 邮箱 / 电话 / 意向产品'
                      : 'Name / Email / Phone / Product'
                  }
                  value={filters.keyword}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      keyword: event.target.value,
                    }))
                  }
                />
                <TextField
                  select
                  fullWidth
                  label={isZh ? '线索状态' : 'Lead Status'}
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: (event.target.value as '' | LeadStatus) ?? '',
                    }))
                  }
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='Unfollowed'>
                    {isZh ? '未跟进' : 'Unfollowed'}
                  </MenuItem>
                  <MenuItem value='Following Up'>
                    {isZh ? '跟进中' : 'Following Up'}
                  </MenuItem>
                  <MenuItem value='Converted'>
                    {isZh ? '已转化' : 'Converted'}
                  </MenuItem>
                  <MenuItem value='Lost'>{isZh ? '未成交' : 'Lost'}</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label={isZh ? '线索来源' : 'Lead Source'}
                  value={filters.leadSource}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      leadSource: (event.target.value as '' | LeadSource) ?? '',
                    }))
                  }
                >
                  <MenuItem value=''>{isZh ? '全部' : 'All'}</MenuItem>
                  <MenuItem value='Sales Email'>
                    {isZh ? '销售邮件' : 'Sales Email'}
                  </MenuItem>
                  <MenuItem value='Shopify Website'>
                    {isZh ? 'Shopify 网站' : 'Shopify Website'}
                  </MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label={isZh ? '地区' : 'Location'}
                  placeholder={
                    isZh ? '输入地区关键字' : 'Type location keyword'
                  }
                  value={filters.location}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                />
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
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Typography variant='h6'>
                {isZh ? '线索列表' : 'Leads List'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isZh ? `共 ${total} 条记录` : `${total} records`}
              </Typography>
            </Stack>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '姓名' : 'Name'}</TableCell>
                    <TableCell sx={{ width: 200 }}>
                      {isZh ? '邮箱' : 'Email'}
                    </TableCell>
                    <TableCell sx={{ width: 130 }}>
                      {isZh ? '电话' : 'Phone Number'}
                    </TableCell>
                    <TableCell>
                      {isZh ? '意向产品' : 'Interested Product'}
                    </TableCell>
                    <TableCell>{isZh ? '留言' : 'Message'}</TableCell>
                    <TableCell>{isZh ? '线索状态' : 'Lead Status'}</TableCell>
                    <TableCell>{isZh ? '线索来源' : 'Lead Source'}</TableCell>
                    <TableCell>{isZh ? '地区' : 'Location'}</TableCell>
                    <TableCell>{isZh ? '创建时间' : 'Created At'}</TableCell>
                    <TableCell align='right'>
                      {isZh ? '操作' : 'Operation'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading &&
                    Array.from({ length: 4 }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        <TableCell colSpan={10}>
                          <Skeleton variant='rounded' height={26} />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!loading &&
                    rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.contact_name}</TableCell>
                        <TableCell sx={{ width: 200, maxWidth: 200 }}>
                          <Typography noWrap title={row.contact_email}>
                            {row.contact_email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 130, maxWidth: 130 }}>
                          <Typography noWrap>
                            {formatUsPhoneNumber(row.phone_number)}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.interested_product ?? '-'}</TableCell>
                        <TableCell>
                          <Typography
                            variant='body2'
                            sx={{ maxWidth: 320 }}
                            noWrap
                          >
                            {row.message ?? '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size='small'
                            label={getStatusLabel(row.lead_status, isZh)}
                            color={statusColorMap[row.lead_status]}
                          />
                        </TableCell>
                        <TableCell>
                          {getSourceLabel(row.lead_source, isZh)}
                        </TableCell>
                        <TableCell>{row.location ?? '-'}</TableCell>
                        <TableCell>{formatDateTime(row.created_at)}</TableCell>
                        <TableCell align='right'>
                          <Stack
                            direction='row'
                            spacing={0.5}
                            alignItems='center'
                            justifyContent='flex-end'
                          >
                            <Button size='small'>
                              {isZh ? '查看' : 'View'}
                            </Button>
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
                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align='center'>
                        {isZh ? '暂无销售线索' : 'No sales leads found'}
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
