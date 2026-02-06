'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material';

const ReadOnlyField = ({ value }: { value: string }) => (
  <Box
    sx={{
      minHeight: 40,
      px: 1.5,
      py: 0.75,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'grey.50',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Typography variant='body2' sx={{ fontWeight: 600 }}>
      {value || '-'}
    </Typography>
  </Box>
);

const FieldRow = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={{ xs: 1, sm: 2 }}
    alignItems={{ sm: 'center' }}
  >
    <Typography
      variant='body2'
      color='text.secondary'
      sx={{
        minWidth: { sm: 160 },
        fontWeight: 600,
      }}
    >
      {label}
      {required && (
        <Box component='span' sx={{ color: 'error.main', ml: 0.5 }}>
          *
        </Box>
      )}
    </Typography>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Stack>
);

type FieldType = 'readonly' | 'input' | 'select';

interface FieldConfig {
  label: string;
  type: FieldType;
  value?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  inputType?: string;
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

export default function ProductEditPage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const selectPlaceholder = isZh ? '请选择' : 'Please select';

  const sections: SectionConfig[] = isZh
    ? [
        {
          title: '产品信息',
          fields: [
            {
              label: 'SN(PID)',
              type: 'readonly',
              value: '8880R5A16070015',
              required: true,
            },
            {
              label: 'MAC 地址',
              type: 'readonly',
              value: 'F4:AB:5C:4E:E2:83',
              required: true,
            },
            {
              label: '产品名称',
              type: 'readonly',
              value: 'PUDU CC1 Pro',
              required: true,
            },
            {
              label: '型号',
              type: 'readonly',
              value: 'PUDU CC1 Pro，CCBC02，美规，灰色 & 黄绿色',
              required: true,
            },
            {
              label: '产品编码',
              type: 'readonly',
              value: '10240-000033',
              required: true,
            },
            {
              label: '机器人昵称',
              type: 'input',
              value: 'CC1 pro',
              placeholder: '请输入机器人昵称',
              required: true,
            },
            {
              label: '使用场景',
              type: 'select',
              value: '测试机器人',
              options: ['测试机器人', '餐厅配送', '仓储拣选'],
              placeholder: selectPlaceholder,
              required: true,
            },
            {
              label: '机器分组',
              type: 'select',
              value: '默认分组',
              options: ['默认分组', '华东运营', '华南运营'],
              placeholder: selectPlaceholder,
              required: true,
            },
            {
              label: '软件版本',
              type: 'readonly',
              value: 'SC5.14.46.2512092039-cc1',
            },
            {
              label: '固件版本',
              type: 'readonly',
              value: '22.2.12',
            },
          ],
        },
        {
          title: '运营信息',
          fields: [
            {
              label: '使用状态',
              type: 'readonly',
              value: '正常使用',
            },
            {
              label: '电量',
              type: 'readonly',
              value: '-',
            },
            {
              label: '保修期（月）',
              type: 'input',
              value: '12',
              inputType: 'number',
              required: true,
            },
            {
              label: '上次启动',
              type: 'readonly',
              value: '2026-01-26 15:43:35',
            },
            {
              label: '激活时间',
              type: 'readonly',
              value: '2026-01-12 12:24:23',
            },
            {
              label: '状态更新时间',
              type: 'readonly',
              value: '2026-01-26 15:43:41',
            },
            {
              label: '到期时间',
              type: 'readonly',
              value: '无限期',
            },
            {
              label: '运行状态',
              type: 'readonly',
              value: '-',
            },
            {
              label: '使用类型',
              type: 'select',
              value: '购买',
              options: ['购买', '租赁', '试用'],
              placeholder: selectPlaceholder,
              required: true,
            },
            {
              label: '冻结时间',
              type: 'readonly',
              value: '-',
            },
          ],
        },
        {
          title: '服务信息',
          fields: [
            {
              label: '门店',
              type: 'readonly',
              value: 'Demo Robotx',
            },
          ],
        },
        {
          title: '关联合同',
          fields: [
            {
              label: '合同类型',
              type: 'select',
              value: '',
              options: ['销售合同', '租赁合同', '合作协议'],
              placeholder: selectPlaceholder,
            },
            {
              label: '合同编号',
              type: 'input',
              value: '',
              placeholder: '请输入合同编号',
            },
          ],
        },
      ]
    : [
        {
          title: 'Product information',
          fields: [
            {
              label: 'SN(PID)',
              type: 'readonly',
              value: '8880R5A16070015',
              required: true,
            },
            {
              label: 'MAC address',
              type: 'readonly',
              value: 'F4:AB:5C:4E:E2:83',
              required: true,
            },
            {
              label: 'Product name',
              type: 'readonly',
              value: 'PUDU CC1 Pro',
              required: true,
            },
            {
              label: 'Model',
              type: 'readonly',
              value: 'PUDU CC1 Pro, CCBC02, USA standard, Grey & Yellow Green',
              required: true,
            },
            {
              label: 'Product code',
              type: 'readonly',
              value: '10240-000033',
              required: true,
            },
            {
              label: 'Robot nickname',
              type: 'input',
              value: 'CC1 pro',
              placeholder: 'Please enter the robot nickname',
              required: true,
            },
            {
              label: 'On-site use',
              type: 'select',
              value: 'Test Robot',
              options: ['Test Robot', 'Restaurant Delivery', 'Warehouse Picking'],
              placeholder: selectPlaceholder,
              required: true,
            },
            {
              label: 'Robot group',
              type: 'select',
              value: 'Default group',
              options: ['Default group', 'East Ops', 'South Ops'],
              placeholder: selectPlaceholder,
              required: true,
            },
            {
              label: 'Software version',
              type: 'readonly',
              value: 'SC5.14.46.2512092039-cc1',
            },
            {
              label: 'Firmware version',
              type: 'readonly',
              value: '22.2.12',
            },
          ],
        },
        {
          title: 'Operating information',
          fields: [
            {
              label: 'Use status',
              type: 'readonly',
              value: 'Normal use',
            },
            {
              label: 'Batter level',
              type: 'readonly',
              value: '-',
            },
            {
              label: 'Warranty period (Months)',
              type: 'input',
              value: '12',
              inputType: 'number',
              required: true,
            },
            {
              label: 'Last boot',
              type: 'readonly',
              value: '2026-01-26 15:43:35',
            },
            {
              label: 'Activated on',
              type: 'readonly',
              value: '2026-01-12 12:24:23',
            },
            {
              label: 'Status updated on',
              type: 'readonly',
              value: '2026-01-26 15:43:41',
            },
            {
              label: 'Deadline',
              type: 'readonly',
              value: 'unlimited',
            },
            {
              label: 'Operating status',
              type: 'readonly',
              value: '-',
            },
            {
              label: 'Use type',
              type: 'select',
              value: 'Purchase',
              options: ['Purchase', 'Lease', 'Trial'],
              placeholder: selectPlaceholder,
              required: true,
            },
            {
              label: 'Frozen on',
              type: 'readonly',
              value: '-',
            },
          ],
        },
        {
          title: 'Service Information',
          fields: [
            {
              label: 'Store',
              type: 'readonly',
              value: 'Demo Robotx',
            },
          ],
        },
        {
          title: 'Associated contract',
          fields: [
            {
              label: 'Type of contract',
              type: 'select',
              value: '',
              options: ['Sales contract', 'Lease contract', 'Partner agreement'],
              placeholder: selectPlaceholder,
            },
            {
              label: 'Contract Number',
              type: 'input',
              value: '',
              placeholder: 'Please enter the contract number',
            },
          ],
        },
      ];

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
              {isZh ? '编辑信息' : 'Edit information'}
            </Typography>
          </Breadcrumbs>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              {isZh ? '编辑信息' : 'Edit information'}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              {isZh
                ? '更新产品信息、运营状态与合同信息。'
                : 'Update product details, operating status, and contract info.'}
            </Typography>
          </Box>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              {sections.map((section, index) => (
                <Stack key={section.title} spacing={2}>
                  {index > 0 && <Divider />}
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        lg: 'repeat(2, minmax(0, 1fr))',
                      },
                      gap: 2,
                    }}
                  >
                    {section.fields.map((field) => (
                      <FieldRow
                        key={`${section.title}-${field.label}`}
                        label={field.label}
                        required={field.required}
                      >
                        {field.type === 'readonly' && (
                          <ReadOnlyField value={field.value ?? '-'} />
                        )}
                        {field.type === 'input' && (
                          <TextField
                            size='small'
                            fullWidth
                            defaultValue={field.value ?? ''}
                            placeholder={field.placeholder}
                            type={field.inputType ?? 'text'}
                          />
                        )}
                        {field.type === 'select' && (
                          <TextField
                            select
                            size='small'
                            fullWidth
                            defaultValue={field.value ?? ''}
                            SelectProps={{
                              displayEmpty: true,
                              renderValue: (selected) => {
                                if (!selected) {
                                  return (
                                    <Typography
                                      variant='body2'
                                      color='text.secondary'
                                    >
                                      {field.placeholder ?? selectPlaceholder}
                                    </Typography>
                                  );
                                }
                                return String(selected);
                              },
                            }}
                          >
                            <MenuItem value=''>
                              {field.placeholder ?? selectPlaceholder}
                            </MenuItem>
                            {(field.options ?? []).map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      </FieldRow>
                    ))}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          mt: 3,
          py: 2,
          px: { xs: 3, md: 6 },
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -6px 16px rgba(0,0,0,0.04)',
        }}
      >
        <Stack direction='row' spacing={2} justifyContent='flex-end'>
          <Button variant='contained'>
            {isZh ? '保存' : 'Save'}
          </Button>
          <Button
            component={Link}
            href={`/${lang}/productcenter/machine-product-library`}
            variant='outlined'
          >
            {isZh ? '取消' : 'Cancel'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
