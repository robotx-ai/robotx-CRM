'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';

type MachineProductDetail = {
  id: string;
  product_name: string | null;
  product_nickname: string | null;
  sn_pid: string;
  mac_address: string | null;
  agent_id: string | null;
  use_type: string | null;
  status: string;
  software_version: string | null;
  firmware_version: string | null;
  site_use: string | null;
  group_id: string | null;
  store_id: string | null;
  import_time: string | null;
  store_installation_time: string | null;
  first_active_time: string | null;
  activated_at: string | null;
  status_updated_at: string | null;
  created_at: string | null;
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='body1' sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
  </Box>
);

function getProductImage(name: string | null): string {
  const value = (name || '').toLowerCase();
  if (value.includes('mt1 max')) return '/assets/images/products/pudu-mt1-max.png';
  if (value.includes('mt1 vac')) return '/assets/images/products/pudu-mt1-vac.png';
  return '/assets/images/products/pudu-cc1.png';
}

function formatDateTime(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
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
  if (code === 'maintenance') return 'warning';
  if (code === 'offline') return 'error';
  if (code === 'idle') return 'info';
  if (code === 'active') return 'success';
  return 'default';
}

export default function ProductInfoPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const rowId = searchParams.get('id') || '';
  const sn = searchParams.get('sn') || '';

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<MachineProductDetail | null>(null);

  const loadDetail = useCallback(async () => {
    if (!rowId && !sn) {
      setLoading(false);
      setDetail(null);
      return;
    }

    setLoading(true);
    try {
      const endpoint = rowId
        ? `/api/v1/productCenter/machineProductLibrary/${encodeURIComponent(rowId)}`
        : `/api/v1/productCenter/machineProductLibrary/by-sn/${encodeURIComponent(sn)}`;

      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load product detail: ${response.status}`);
      }

      const payload = (await response.json()) as MachineProductDetail;
      setDetail(payload);
    } catch (error) {
      console.error(error);
      setDetail(null);
      window.alert(isZh ? '加载产品信息失败' : 'Failed to load product information');
    } finally {
      setLoading(false);
    }
  }, [isZh, rowId, sn]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const infoItems = useMemo(() => {
    if (!detail) return [];

    return isZh
      ? [
          { label: '昵称', value: detail.product_nickname || '-' },
          { label: 'SN(PID)', value: detail.sn_pid || '-' },
          { label: 'MAC', value: detail.mac_address || '-' },
          { label: '软件版本', value: detail.software_version || '-' },
          { label: '固件版本', value: detail.firmware_version || '-' },
          { label: '使用场景', value: detail.site_use || '-' },
          { label: '机器分组ID', value: detail.group_id || '-' },
          { label: '使用类型', value: detail.use_type || '-' },
          { label: '代理ID', value: detail.agent_id || '-' },
          { label: '门店ID', value: detail.store_id || '-' },
        ]
      : [
          { label: 'Nick name', value: detail.product_nickname || '-' },
          { label: 'SN (PID)', value: detail.sn_pid || '-' },
          { label: 'MAC', value: detail.mac_address || '-' },
          { label: 'Software version', value: detail.software_version || '-' },
          { label: 'Firmware version', value: detail.firmware_version || '-' },
          { label: 'Site use', value: detail.site_use || '-' },
          { label: 'Group ID', value: detail.group_id || '-' },
          { label: 'Use type', value: detail.use_type || '-' },
          { label: 'Agent ID', value: detail.agent_id || '-' },
          { label: 'Store ID', value: detail.store_id || '-' },
        ];
  }, [detail, isZh]);

  const operationRecords = useMemo(() => {
    if (!detail) return [];

    const records = [
      {
        time: formatDateTime(detail.import_time),
        title: isZh ? '导入产品' : 'Imported product',
        lines: [
          `${isZh ? '产品ID' : 'Product ID'}: ${detail.id}`,
          `${isZh ? '状态' : 'Status'}: ${getStatusLabel(detail.status, isZh)}`,
        ],
      },
      {
        time: formatDateTime(detail.activated_at || detail.first_active_time),
        title: isZh ? '激活记录' : 'Activation',
        lines: [`${isZh ? 'SN(PID)' : 'SN(PID)'}: ${detail.sn_pid}`],
      },
      {
        time: formatDateTime(detail.status_updated_at || detail.created_at),
        title: isZh ? '状态更新' : 'Status update',
        lines: [`${isZh ? '当前状态' : 'Current status'}: ${getStatusLabel(detail.status, isZh)}`],
      },
    ];

    return records.filter((item) => item.time !== '-');
  }, [detail, isZh]);

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Breadcrumbs separator='/' aria-label='breadcrumb'>
            <MuiLink
              component={Link}
              underline='hover'
              color='text.secondary'
              href={`/${lang}/productcenter/machine-product-library`}
            >
              {isZh ? '产品中心' : 'Product Center'}
            </MuiLink>
            <MuiLink
              component={Link}
              underline='hover'
              color='text.secondary'
              href={`/${lang}/productcenter/machine-product-library`}
            >
              {isZh ? '机器产品库' : 'Machine Product Library'}
            </MuiLink>
            <Typography color='text.primary'>{isZh ? '查看产品信息' : 'View Product Information'}</Typography>
          </Breadcrumbs>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent='space-between'
            spacing={2}
          >
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                {isZh ? '查看产品信息' : 'View Product Information'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {isZh
                  ? '查看产品状态、关键参数与操作记录。'
                  : 'Review product status, key parameters, and operation history.'}
              </Typography>
            </Box>
            <Button component={Link} href={`/${lang}/productcenter/machine-product-library`} variant='outlined'>
              {isZh ? '返回产品库' : 'Back to Library'}
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            {loading ? (
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '加载中...' : 'Loading...'}
              </Typography>
            ) : !detail ? (
              <Typography variant='body2' color='text.secondary'>
                {isZh ? '未找到产品信息（请检查 id/sn）' : 'Product not found (please check id/sn).'}
              </Typography>
            ) : (
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 2,
                      bgcolor: 'grey.100',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={getProductImage(detail.product_name)}
                      alt={detail.product_name || detail.sn_pid}
                      width={88}
                      height={88}
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Stack direction='row' spacing={1.5} alignItems='center' flexWrap='wrap'>
                      <Typography variant='h5' sx={{ fontWeight: 700 }}>
                        {detail.product_name || '-'}
                      </Typography>
                      <Chip label={getStatusLabel(detail.status, isZh)} color={getStatusColor(detail.status)} size='small' />
                    </Stack>
                    <Typography variant='body2' color='text.secondary'>
                      {detail.product_nickname || '-'}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Typography variant='h6'>{isZh ? '产品信息' : 'Product information'}</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(3, minmax(0, 1fr))',
                    },
                  }}
                >
                  {infoItems.map((item) => (
                    <InfoItem key={item.label} label={item.label} value={item.value} />
                  ))}
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2 }}>
              {isZh ? '产品操作记录' : 'Product operation record'}
            </Typography>
            <Stack spacing={2}>
              {operationRecords.length === 0 ? (
                <Typography variant='body2' color='text.secondary'>
                  {isZh ? '暂无操作记录。' : 'No operation records yet.'}
                </Typography>
              ) : (
                operationRecords.map((record, index) => (
                  <Box key={`${record.time}-${record.title}`}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }}>
                      <Typography variant='body2' color='text.secondary' sx={{ minWidth: { md: 180 } }}>
                        {record.time}
                      </Typography>
                      <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                          {record.title}
                        </Typography>
                        {record.lines.map((line) => (
                          <Typography key={line} variant='body2' color='text.secondary'>
                            {line}
                          </Typography>
                        ))}
                      </Stack>
                    </Stack>
                    {index < operationRecords.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))
              )}
            </Stack>
          </CardContent>
        </Card>

        <Stack direction='row' justifyContent='flex-end'>
          <Button component={Link} href={`/${lang}/productcenter/machine-product-library`} variant='contained'>
            {isZh ? '返回' : 'Return'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
