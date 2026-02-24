'use client';

import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
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
  CircularProgress,
  Divider,
  IconButton,
  Menu,
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
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

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

type SortField = 'lead_status' | 'lead_source' | 'created_at';
type SortDirection = 'asc' | 'desc';

const defaultFilters: LeadFilters = {
  keyword: '',
  status: '',
  leadSource: '',
  location: '',
};

const statusSortOrder: Record<LeadStatus, number> = {
  'Following Up': 0,
  Unfollowed: 1,
  Lost: 2,
  Converted: 3,
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
  const [statsLoading, setStatsLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState<Record<LeadStatus, number>>({
    Unfollowed: 0,
    'Following Up': 0,
    Converted: 0,
    Lost: 0,
  });
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [hideLostLeads, setHideLostLeads] = useState(false);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<
    Record<string, boolean>
  >({});
  const [deletingLeadIds, setDeletingLeadIds] = useState<Record<string, boolean>>(
    {}
  );
  const [removingLeadIds, setRemovingLeadIds] = useState<Record<string, boolean>>(
    {}
  );
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusMenu, setStatusMenu] = useState<{
    leadId: string;
    anchorEl: HTMLElement;
  } | null>(null);

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

  const loadGlobalStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const statuses: LeadStatus[] = [
        'Unfollowed',
        'Following Up',
        'Converted',
        'Lost',
      ];

      const totalsByStatus = await Promise.all(
        statuses.map(async (status) => {
          const query = new URLSearchParams();
          query.set('limit', '1');
          query.set('status', status);

          const response = await fetch(
            `/api/v1/customerCenter/salesLeads?${query.toString()}`,
            { cache: 'no-store' }
          );
          if (!response.ok) {
            throw new Error(`Failed to load stats for ${status}: ${response.status}`);
          }

          const payload = (await response.json()) as SalesLeadListResponse;
          return [status, payload.total ?? 0] as const;
        })
      );

      setStatusCounts({
        Unfollowed: totalsByStatus.find(([status]) => status === 'Unfollowed')?.[1] ?? 0,
        'Following Up':
          totalsByStatus.find(([status]) => status === 'Following Up')?.[1] ?? 0,
        Converted: totalsByStatus.find(([status]) => status === 'Converted')?.[1] ?? 0,
        Lost: totalsByStatus.find(([status]) => status === 'Lost')?.[1] ?? 0,
      });
    } catch (error) {
      console.error(error);
      setStatusCounts({
        Unfollowed: 0,
        'Following Up': 0,
        Converted: 0,
        Lost: 0,
      });
      window.alert(isZh ? '统计数据加载失败' : 'Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  }, [isZh]);

  useEffect(() => {
    void loadLeads(defaultFilters);
    void loadGlobalStatistics();
  }, [loadGlobalStatistics, loadLeads]);

  const handleSearch = useCallback(() => {
    void loadLeads(filters);
  }, [filters, loadLeads]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setHideLostLeads(false);
    void loadLeads(defaultFilters);
  }, [loadLeads]);

  const applyStatusFilter = useCallback(
    (status: LeadStatus) => {
      if (hideLostLeads && status === 'Lost') {
        setHideLostLeads(false);
      }

      const nextFilters: LeadFilters = {
        ...filters,
        status: filters.status === status ? '' : status,
      };
      setFilters(nextFilters);
      void loadLeads(nextFilters);
    },
    [filters, hideLostLeads, loadLeads]
  );

  const handleToggleHideLostLeads = useCallback(() => {
    const nextHideLostLeads = !hideLostLeads;
    setHideLostLeads(nextHideLostLeads);

    if (nextHideLostLeads && filters.status === 'Lost') {
      const nextFilters = { ...filters, status: '' as '' | LeadStatus };
      setFilters(nextFilters);
      void loadLeads(nextFilters);
    }
  }, [filters, hideLostLeads, loadLeads]);

  const handleLeadStatusChange = useCallback(
    async (leadId: string, previousStatus: LeadStatus, nextStatus: LeadStatus) => {
      if (previousStatus === nextStatus) {
        return;
      }

      setUpdatingStatusIds((prev) => ({ ...prev, [leadId]: true }));
      setRows((prev) =>
        prev.map((row) =>
          row.id === leadId ? { ...row, lead_status: nextStatus } : row
        )
      );
      setStatusCounts((prev) => ({
        ...prev,
        [previousStatus]: Math.max(0, prev[previousStatus] - 1),
        [nextStatus]: prev[nextStatus] + 1,
      }));

      try {
        const response = await fetch(`/api/v1/customerCenter/salesLeads/${leadId}`, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            lead_status: nextStatus,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update lead status: ${response.status}`);
        }
        const updatedLead = (await response.json()) as SalesLeadRow;
        setRows((prev) =>
          prev.map((row) => (row.id === leadId ? updatedLead : row))
        );
      } catch (error) {
        console.error(error);
        setRows((prev) =>
          prev.map((row) =>
            row.id === leadId ? { ...row, lead_status: previousStatus } : row
          )
        );
        setStatusCounts((prev) => ({
          ...prev,
          [nextStatus]: Math.max(0, prev[nextStatus] - 1),
          [previousStatus]: prev[previousStatus] + 1,
        }));
        window.alert(
          isZh ? '更新线索状态失败' : 'Failed to update lead status'
        );
      } finally {
        setUpdatingStatusIds((prev) => {
          const next = { ...prev };
          delete next[leadId];
          return next;
        });
      }
    },
    [isZh]
  );

  const handleOpenStatusMenu = useCallback(
    (leadId: string, event: MouseEvent<HTMLElement>) => {
      setStatusMenu({
        leadId,
        anchorEl: event.currentTarget,
      });
    },
    []
  );

  const handleCloseStatusMenu = useCallback(() => {
    setStatusMenu(null);
  }, []);

  const handleSelectStatusFromMenu = useCallback(
    (nextStatus: LeadStatus) => {
      if (!statusMenu) {
        return;
      }

      const row = rows.find((item) => item.id === statusMenu.leadId);
      if (!row) {
        setStatusMenu(null);
        return;
      }

      void handleLeadStatusChange(row.id, row.lead_status, nextStatus);
      setStatusMenu(null);
    },
    [handleLeadStatusChange, rows, statusMenu]
  );

  const handleDeleteLead = useCallback(
    async (lead: SalesLeadRow) => {
      if (deletingLeadIds[lead.id]) {
        return;
      }

      setDeletingLeadIds((prev) => ({ ...prev, [lead.id]: true }));
      try {
        const response = await fetch(`/api/v1/customerCenter/salesLeads/${lead.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete lead: ${response.status}`);
        }

        setRemovingLeadIds((prev) => ({ ...prev, [lead.id]: true }));
        window.setTimeout(() => {
          setRows((prev) => prev.filter((row) => row.id !== lead.id));
          setTotal((prev) => Math.max(0, prev - 1));
          setStatusCounts((prev) => ({
            ...prev,
            [lead.lead_status]: Math.max(0, prev[lead.lead_status] - 1),
          }));
          setRemovingLeadIds((prev) => {
            const next = { ...prev };
            delete next[lead.id];
            return next;
          });
        }, 240);
      } catch (error) {
        console.error(error);
        window.alert(isZh ? '删除线索失败' : 'Failed to delete lead');
      } finally {
        setDeletingLeadIds((prev) => {
          const next = { ...prev };
          delete next[lead.id];
          return next;
        });
      }
    },
    [deletingLeadIds, isZh]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField !== field) {
        setSortField(field);
        setSortDirection('asc');
        return;
      }

      if (sortDirection === 'asc') {
        setSortDirection('desc');
        return;
      }

      setSortField(null);
      setSortDirection('asc');
    },
    [sortDirection, sortField]
  );

  const statistics = useMemo(() => {
    return [
      {
        key: 'unfollowed',
        status: 'Unfollowed' as LeadStatus,
        title: isZh ? '未跟进' : 'Unfollowed',
        value: statusCounts.Unfollowed,
        icon: <ReportProblemOutlinedIcon color='warning' />,
      },
      {
        key: 'following',
        status: 'Following Up' as LeadStatus,
        title: isZh ? '跟进中' : 'Following Up',
        value: statusCounts['Following Up'],
        icon: <ForumOutlinedIcon color='info' />,
      },
      {
        key: 'converted',
        status: 'Converted' as LeadStatus,
        title: isZh ? '已转化' : 'Converted',
        value: statusCounts.Converted,
        icon: <ThumbUpAltOutlinedIcon color='success' />,
      },
      {
        key: 'lost',
        status: 'Lost' as LeadStatus,
        title: isZh ? '未成交' : 'Lost',
        value: statusCounts.Lost,
        icon: <SentimentDissatisfiedOutlinedIcon color='disabled' />,
      },
    ];
  }, [isZh, statusCounts]);

  const visibleRows = useMemo(() => {
    const filtered = hideLostLeads
      ? rows.filter((row) => row.lead_status !== 'Lost')
      : rows;

    return [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortField === null || sortField === 'lead_status') {
        compare = statusSortOrder[a.lead_status] - statusSortOrder[b.lead_status];
      } else if (sortField === 'lead_source') {
        compare = a.lead_source.localeCompare(b.lead_source);
      } else {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        compare = aTime - bTime;
      }
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [hideLostLeads, rows, sortDirection, sortField]);

  const visibleTotal = hideLostLeads ? visibleRows.length : total;

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

        <Stack spacing={1.5}>
          <Stack direction='row' justifyContent='flex-end'>
            <Button
              variant={hideLostLeads ? 'contained' : 'outlined'}
              size='small'
              onClick={handleToggleHideLostLeads}
            >
              {isZh
                ? hideLostLeads
                  ? '显示未成交线索'
                  : '隐藏未成交线索'
                : hideLostLeads
                  ? 'Show Lost Leads'
                  : 'Hide Lost Leads'}
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {statistics.map((item) => (
              <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  onClick={() => applyStatusFilter(item.status)}
                  sx={{
                    cursor: 'pointer',
                    border:
                      filters.status === item.status
                        ? (theme) => `1px solid ${theme.palette.primary.main}`
                        : '1px solid transparent',
                  }}
                >
                  <CardContent>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='flex-start'
                    >
                      <Stack spacing={1}>
                        <Typography variant='body1' color='text.secondary'>
                          {item.title}
                        </Typography>
                        <Typography variant='h4' sx={{ fontWeight: 700 }}>
                          {statsLoading ? '-' : item.value}
                        </Typography>
                      </Stack>
                      {item.icon}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
                {isZh ? `共 ${visibleTotal} 条记录` : `${visibleTotal} records`}
              </Typography>
            </Stack>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{isZh ? '姓名' : 'Name'}</TableCell>
                    <TableCell sx={{ width: 160 }}>
                      {isZh ? '邮箱' : 'Email'}
                    </TableCell>
                    <TableCell sx={{ width: 130 }}>
                      {isZh ? '电话' : 'Phone Number'}
                    </TableCell>
                    <TableCell>
                      {isZh ? '意向产品' : 'Interested Product'}
                    </TableCell>
                    <TableCell sx={{ width: 160, minWidth: 160 }}>
                      {isZh ? '留言' : 'Message'}
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'lead_status'}
                        direction={sortField === 'lead_status' ? sortDirection : 'asc'}
                        onClick={() => handleSort('lead_status')}
                      >
                        {isZh ? '线索状态' : 'Lead Status'}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'lead_source'}
                        direction={sortField === 'lead_source' ? sortDirection : 'asc'}
                        onClick={() => handleSort('lead_source')}
                      >
                        {isZh ? '线索来源' : 'Lead Source'}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>{isZh ? '地区' : 'Location'}</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'created_at'}
                        direction={sortField === 'created_at' ? sortDirection : 'asc'}
                        onClick={() => handleSort('created_at')}
                      >
                        {isZh ? '创建时间' : 'Created At'}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        position: 'sticky',
                        right: 0,
                        zIndex: 3,
                        backgroundColor: 'background.paper',
                        minWidth: 180,
                      }}
                    >
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
                    visibleRows.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          transition: 'opacity 240ms ease, transform 240ms ease',
                          opacity: removingLeadIds[row.id] ? 0 : 1,
                          transform: removingLeadIds[row.id]
                            ? 'translateX(8px)'
                            : 'translateX(0)',
                          pointerEvents: removingLeadIds[row.id] ? 'none' : 'auto',
                        }}
                      >
                        <TableCell>{row.contact_name}</TableCell>
                        <TableCell sx={{ width: 160, maxWidth: 160 }}>
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
                        <TableCell sx={{ width: 160, minWidth: 160 }}>
                          <Typography
                            variant='body2'
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              wordBreak: 'break-word',
                            }}
                          >
                            {row.message ?? '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size='small'
                            label={
                              updatingStatusIds[row.id] ? (
                                <Stack
                                  direction='row'
                                  spacing={0.75}
                                  alignItems='center'
                                >
                                  <CircularProgress size={12} color='inherit' />
                                  <span>
                                    {getStatusLabel(row.lead_status, isZh)}
                                  </span>
                                </Stack>
                              ) : (
                                getStatusLabel(row.lead_status, isZh)
                              )
                            }
                            color={statusColorMap[row.lead_status]}
                            onClick={(event) => {
                              if (!updatingStatusIds[row.id]) {
                                handleOpenStatusMenu(row.id, event);
                              }
                            }}
                            sx={{
                              cursor: updatingStatusIds[row.id]
                                ? 'not-allowed'
                                : 'pointer',
                              opacity: updatingStatusIds[row.id] ? 0.7 : 1,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {getSourceLabel(row.lead_source, isZh)}
                        </TableCell>
                        <TableCell>{row.location ?? '-'}</TableCell>
                        <TableCell>{formatDateTime(row.created_at)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{
                            position: 'sticky',
                            right: 0,
                            zIndex: 2,
                            backgroundColor: 'background.paper',
                            minWidth: 180,
                            boxShadow: (theme) => `-1px 0 0 ${theme.palette.divider}`,
                          }}
                        >
                          <Stack
                            direction='row'
                            spacing={0.5}
                            alignItems='center'
                            justifyContent='flex-end'
                          >
                            <Button
                              size='small'
                              component={Link}
                              href={`/${lang}/sales-leads/detail?id=${encodeURIComponent(
                                row.id
                              )}`}
                            >
                              {isZh ? '查看' : 'View'}
                            </Button>
                            <Typography color='text.disabled'>|</Typography>
                            <Button size='small' color='secondary'>
                              {isZh ? '跟进' : 'Follow-up'}
                            </Button>
                            <Typography color='text.disabled'>|</Typography>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => void handleDeleteLead(row)}
                              disabled={Boolean(deletingLeadIds[row.id])}
                            >
                              {deletingLeadIds[row.id] ? (
                                <CircularProgress size={14} color='inherit' />
                              ) : (
                                <DeleteOutlineOutlinedIcon fontSize='small' />
                              )}
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!loading && visibleRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align='center'>
                        {isZh ? '暂无销售线索' : 'No sales leads found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Menu
              anchorEl={statusMenu?.anchorEl}
              open={Boolean(statusMenu)}
              onClose={handleCloseStatusMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <MenuItem onClick={() => handleSelectStatusFromMenu('Unfollowed')}>
                <Chip
                  size='small'
                  label={getStatusLabel('Unfollowed', isZh)}
                  color={statusColorMap.Unfollowed}
                />
              </MenuItem>
              <MenuItem onClick={() => handleSelectStatusFromMenu('Following Up')}>
                <Chip
                  size='small'
                  label={getStatusLabel('Following Up', isZh)}
                  color={statusColorMap['Following Up']}
                />
              </MenuItem>
              <MenuItem onClick={() => handleSelectStatusFromMenu('Converted')}>
                <Chip
                  size='small'
                  label={getStatusLabel('Converted', isZh)}
                  color={statusColorMap.Converted}
                />
              </MenuItem>
              <MenuItem onClick={() => handleSelectStatusFromMenu('Lost')}>
                <Chip
                  size='small'
                  label={getStatusLabel('Lost', isZh)}
                  color={statusColorMap.Lost}
                />
              </MenuItem>
            </Menu>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
