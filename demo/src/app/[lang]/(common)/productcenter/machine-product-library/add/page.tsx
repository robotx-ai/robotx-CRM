'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material';

export default function AddMachineProductPage() {
  const params = useParams();
  const router = useRouter();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    sn_pid: '',
    product_name: '',
    product_nickname: '',
    status: 'active',
    software_version: '',
    firmware_version: '',
    use_type: 'Purchase',
    site_use: '',
    warranty_months: '',
    agent_id: '',
    store_id: '',
  });

  const onSave = async () => {
    if (!form.sn_pid.trim()) {
      window.alert(isZh ? 'SN(PID) 为必填项' : 'SN(PID) is required');
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, string | number> = {
        sn_pid: form.sn_pid.trim(),
        status: form.status.trim() || 'active',
      };

      const optionalTextFields = [
        'product_name',
        'product_nickname',
        'software_version',
        'firmware_version',
        'use_type',
        'site_use',
        'agent_id',
        'store_id',
      ] as const;

      for (const key of optionalTextFields) {
        const value = form[key].trim();
        if (value) payload[key] = value;
      }

      if (form.warranty_months.trim()) {
        const parsed = Number.parseInt(form.warranty_months.trim(), 10);
        if (!Number.isNaN(parsed)) payload.warranty_months = parsed;
      }

      const response = await fetch('/api/v1/productCenter/machineProductLibrary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Create failed: ${response.status}`);
      }

      router.push(`/${lang}/productcenter/machine-product-library`);
    } catch (error) {
      console.error(error);
      window.alert(isZh ? '新增失败，请检查字段格式' : 'Create failed, please check field format');
    } finally {
      setSaving(false);
    }
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
            <Typography color='text.primary'>{isZh ? '新增产品' : 'Add Product'}</Typography>
          </Breadcrumbs>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            {isZh ? '新增产品' : 'Add Product'}
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Typography variant='h6'>{isZh ? '基础信息' : 'Basic Information'}</Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <TextField
                  required
                  fullWidth
                  label='SN(PID)'
                  value={form.sn_pid}
                  onChange={(event) => setForm((prev) => ({ ...prev, sn_pid: event.target.value }))}
                />
                <TextField
                  required
                  fullWidth
                  label={isZh ? '状态' : 'Status'}
                  placeholder='active'
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                />
                <TextField
                  fullWidth
                  label={isZh ? '产品名称' : 'Product name'}
                  value={form.product_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, product_name: event.target.value }))}
                />
                <TextField
                  fullWidth
                  label={isZh ? '机器人昵称' : 'Robot nickname'}
                  value={form.product_nickname}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, product_nickname: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '软件版本' : 'Software version'}
                  value={form.software_version}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, software_version: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '固件版本' : 'Firmware version'}
                  value={form.firmware_version}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, firmware_version: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label={isZh ? '使用类型' : 'Use type'}
                  placeholder='Purchase / Lease / Trial'
                  value={form.use_type}
                  onChange={(event) => setForm((prev) => ({ ...prev, use_type: event.target.value }))}
                />
                <TextField
                  fullWidth
                  label={isZh ? '使用场景' : 'Site use'}
                  value={form.site_use}
                  onChange={(event) => setForm((prev) => ({ ...prev, site_use: event.target.value }))}
                />
                <TextField
                  fullWidth
                  type='number'
                  label={isZh ? '保修期（月）' : 'Warranty months'}
                  value={form.warranty_months}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, warranty_months: event.target.value }))
                  }
                />
                <TextField
                  fullWidth
                  label='Agent ID'
                  value={form.agent_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, agent_id: event.target.value }))}
                />
                <TextField
                  fullWidth
                  label='Store ID'
                  value={form.store_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, store_id: event.target.value }))}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Divider />
        <Stack direction='row' spacing={2} justifyContent='flex-end'>
          <Button variant='contained' onClick={() => void onSave()} disabled={saving}>
            {saving ? (isZh ? '保存中...' : 'Saving...') : isZh ? '保存' : 'Save'}
          </Button>
          <Button variant='outlined' component={Link} href={`/${lang}/productcenter/machine-product-library`}>
            {isZh ? '取消' : 'Cancel'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
