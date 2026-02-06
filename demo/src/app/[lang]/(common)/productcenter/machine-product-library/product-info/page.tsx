'use client';

import Image from 'next/image';
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
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';

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

export default function ProductInfoPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const productInfo = {
    name: 'PUDU CC1 Pro',
    description: isZh
      ? 'PUDU CC1 Pro，CCBC02，美规，灰色 & 黄绿色'
      : 'PUDU CC1 Pro, CCBC02, USA standard, Grey & Yellow Green',
    status: isZh ? '已激活' : 'Activated',
  };

  const infoItems = isZh
    ? [
        { label: '昵称', value: 'CC1 pro' },
        { label: 'SN(PID)', value: '8880R5A16070015' },
        { label: 'MAC', value: 'F4:AB:5C:4E:E2:83' },
        { label: '软件版本', value: 'SC5.14.46.2512092039-cc1' },
        { label: '固件版本', value: '22.2.12' },
        { label: '使用场景', value: '测试机器人' },
        { label: '机器分组', value: '默认分组' },
        { label: '机器分组ID', value: 'YzzQqwVEoaToCSCmloWKE' },
        { label: '服务责任', value: '代理服务' },
      ]
    : [
        { label: 'Nick name', value: 'CC1 pro' },
        { label: 'SN (PID)', value: '8880R5A16070015' },
        { label: 'MAC', value: 'F4:AB:5C:4E:E2:83' },
        { label: 'Software version', value: 'SC5.14.46.2512092039-cc1' },
        { label: 'Firmware version', value: '22.2.12' },
        { label: 'Site use', value: 'Test Robot' },
        { label: 'Machine grouping', value: 'Default group' },
        { label: 'Machine grouping ID', value: 'YzzQqwVEoaToCSCmloWKE' },
        { label: 'Service Responsibility', value: 'Agent Service' },
      ];

  const operationRecords = isZh
    ? [
        {
          time: '2026-01-12 12:24:22',
          title: '激活',
          lines: ['来自门店：Demo Robotx', '操作人：系统操作'],
        },
        {
          time: '2026-01-12 12:24:02',
          title: '绑定代理',
          lines: ['代理商：Robotx AI Inc.', '门店：tech@usrobotx.com'],
        },
        {
          time: '2025-12-24 17:01:41',
          title: '下发至子代理',
          lines: [
            '发货方：深圳市普渡科技有限公司（美国虚拟客户）',
            '说明：erp outbound',
            '服务：erp-service',
          ],
        },
      ]
    : [
        {
          time: '2026-01-12 12:24:22',
          title: 'Activation',
          lines: ['From store: Demo Robotx', 'Operator: System Operations'],
        },
        {
          time: '2026-01-12 12:24:02',
          title: 'Bind Proxy',
          lines: ['Proxy: Robotx AI Inc.', 'Store: tech@usrobotx.com'],
        },
        {
          time: '2025-12-24 17:01:41',
          title: 'Outgoing products to sub-agents',
          lines: [
            'From: Shenzhen Pudu Technology Co., Ltd. (US virtual customer)',
            'Instructions: erp outbound',
            'Service: erp-service',
          ],
        },
      ];

  const emptyStates = isZh
    ? {
        maintenance: '暂无维护记录。',
        accessories: '暂无配件记录。',
        calibration: '尚未上传标定文件。',
      }
    : {
        maintenance: 'No maintenance records yet.',
        accessories: 'No accessories records yet.',
        calibration: 'No calibration files uploaded.',
      };

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
            <Typography color='text.primary'>
              {isZh ? '查看产品信息' : 'View Product Information'}
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
                {isZh ? '查看产品信息' : 'View Product Information'}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                {isZh
                  ? '查看产品状态、关键参数与操作记录。'
                  : 'Review product status, key parameters, and operation history.'}
              </Typography>
            </Box>
            <Button
              component={Link}
              href={`/${lang}/productcenter/machine-product-library`}
              variant='outlined'
            >
              {isZh ? '返回产品库' : 'Back to Library'}
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
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
                    src='/assets/images/products/pudu-cc1.png'
                    alt='PUDU CC1 Pro'
                    width={88}
                    height={88}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Stack direction='row' spacing={1.5} alignItems='center' flexWrap='wrap'>
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                      {productInfo.name}
                    </Typography>
                    <Chip label={productInfo.status} color='success' size='small' />
                  </Stack>
                  <Typography variant='body2' color='text.secondary'>
                    {productInfo.description}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <Typography variant='h6'>
                {isZh ? '产品信息' : 'Product information'}
              </Typography>
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
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2 }}>
              {isZh ? '产品操作记录' : 'Product operation record'}
            </Typography>
            <Stack spacing={2}>
              {operationRecords.map((record, index) => (
                <Box key={`${record.time}-${record.title}`}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ md: 'flex-start' }}
                  >
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ minWidth: { md: 180 } }}
                    >
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
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 1 }}>
                {isZh ? '维护信息' : 'Maintenance information'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {emptyStates.maintenance}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 1 }}>
                {isZh ? '配件信息' : 'Accessories information'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {emptyStates.accessories}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 1 }}>
                {isZh ? '前置摄像头标定文件' : 'Front Camera Calibration Files'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {emptyStates.calibration}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Stack direction='row' justifyContent='flex-end'>
          <Button
            component={Link}
            href={`/${lang}/productcenter/machine-product-library`}
            variant='contained'
          >
            {isZh ? '返回' : 'Return'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
