'use client';

import useSwalWrapper from '@jumbo/vendors/sweetalert2/hooks';
import { LoadingButton } from '@mui/lab';
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
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type StoreFormState = {
  creationType: 'independent' | 'chain';
  storeName: string;
  industrySector: string;
  storeAddress: string;
  storeContact: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
  merchantName: string;
};

type ApiValidationError = {
  loc?: Array<string | number>;
  msg?: string;
};

type ApiErrorPayload = {
  detail?: string | ApiValidationError[] | Record<string, unknown>;
  message?: string;
};

const INITIAL_FORM_STATE: StoreFormState = {
  creationType: 'independent',
  storeName: '',
  industrySector: '',
  storeAddress: '',
  storeContact: '',
  contactPosition: '',
  contactPhone: '',
  contactEmail: '',
  merchantName: '',
};

export default function AddStorePage() {
  const Swal = useSwalWrapper();
  const router = useRouter();
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<StoreFormState>(INITIAL_FORM_STATE);

  const updateField = <K extends keyof StoreFormState>(key: K, value: StoreFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateRequired = () => {
    return (
      form.storeName.trim() &&
      form.industrySector.trim() &&
      form.storeAddress.trim() &&
      form.storeContact.trim() &&
      form.contactPosition.trim()
    );
  };

  const normalizeErrorMessage = (payload: ApiErrorPayload): string => {
    if (typeof payload.detail === 'string' && payload.detail.trim()) {
      return payload.detail;
    }

    if (Array.isArray(payload.detail)) {
      const validationMessages = payload.detail
        .map((item) => {
          const loc = item.loc?.join('.') ?? 'body';
          const msg = item.msg ?? 'Invalid value';
          return `${loc}: ${msg}`;
        })
        .join('; ');

      if (validationMessages) {
        return validationMessages;
      }
    }

    if (payload.message && payload.message.trim()) {
      return payload.message;
    }

    if (payload.detail && typeof payload.detail === 'object') {
      return JSON.stringify(payload.detail);
    }

    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateRequired()) {
      await Swal.fire({
        icon: 'warning',
        title: isZh ? '请先填写必填项' : 'Please fill required fields',
        text: isZh ? '带 * 的字段不能为空。' : 'Fields marked with * are required.',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        create_type: form.creationType,
        store_name: form.storeName.trim(),
        industry_sector: form.industrySector.trim(),
        store_address: form.storeAddress.trim(),
        store_contact: form.storeContact.trim(),
        contact_position: form.contactPosition.trim(),
        contact_phone: form.contactPhone.trim() || null,
        contact_email: form.contactEmail.trim() || null,
        merchant_name: form.merchantName.trim() || null,
      };

      const response = await fetch('/api/v1/customerCenter/storeManagement', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = '';
        try {
          const errorPayload = (await response.json()) as ApiErrorPayload;
          message = normalizeErrorMessage(errorPayload);
        } catch {
          message = await response.text();
        }
        throw new Error(message || `Request failed with status ${response.status}`);
      }

      await Swal.fire({
        icon: 'success',
        title: isZh ? '门店创建成功' : 'Store created successfully',
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      });

      router.push(`/${lang}/customerCenter/storeManagement`);
      router.refresh();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: isZh ? '创建失败' : 'Create failed',
        text:
          error instanceof Error && error.message
            ? error.message
            : isZh
              ? '请稍后重试。'
              : 'Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3} component='form' onSubmit={handleSubmit} noValidate>
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
              {isZh ? '新增门店' : 'New Store Added'}
            </Typography>
          </Breadcrumbs>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            {isZh ? '新增门店' : 'New Store Added'}
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant='h6'>
                {isZh ? '创建方式' : 'Creation Type'}
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant='outlined'
                    onClick={() => updateField('creationType', 'independent')}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      borderColor: form.creationType === 'independent' ? 'primary.main' : 'divider',
                      bgcolor: form.creationType === 'independent' ? 'action.hover' : 'transparent',
                    }}
                  >
                    <CardContent>
                      <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
                        {isZh ? '创建独立门店' : 'Create an independent store'}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {isZh
                          ? '适用于独立门店业务场景'
                          : 'Applicable to independent store business scenarios'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant='outlined'
                    onClick={() => updateField('creationType', 'chain')}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      borderColor: form.creationType === 'chain' ? 'primary.main' : 'divider',
                      bgcolor: form.creationType === 'chain' ? 'action.hover' : 'transparent',
                    }}
                  >
                    <CardContent>
                      <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
                        {isZh ? '创建连锁门店' : 'Creating chain stores'}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {isZh
                          ? '终端客户需要使用同一账号查看所有门店数据。'
                          : 'End customers need to use one account to view data from all stores.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Typography variant='h6'>
                {isZh ? '门店信息' : 'Store Information'}
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '门店名称' : 'Store Name'}
                    placeholder={isZh ? '请输入门店名称' : 'Enter store name'}
                    value={form.storeName}
                    onChange={(event) => updateField('storeName', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '行业领域' : 'Industry Sector'}
                    placeholder={
                      isZh ? '请输入行业领域（可输入关键字）' : 'Please enter or use keywords'
                    }
                    value={form.industrySector}
                    onChange={(event) => updateField('industrySector', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '门店地址' : 'Store Address'}
                    placeholder={isZh ? '请输入门店地址' : 'Please enter'}
                    value={form.storeAddress}
                    onChange={(event) => updateField('storeAddress', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '门店联系人' : 'Store Contact'}
                    placeholder={isZh ? '请输入联系人' : 'Enter contact person'}
                    value={form.storeContact}
                    onChange={(event) => updateField('storeContact', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '联系人职位' : "Contact's position"}
                    placeholder={isZh ? '请输入联系人职位' : 'Enter contact position'}
                    value={form.contactPosition}
                    onChange={(event) => updateField('contactPosition', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '联系人电话' : 'Contact phone number'}
                    placeholder={isZh ? '请输入联系电话' : 'Enter phone number'}
                    value={form.contactPhone}
                    onChange={(event) => updateField('contactPhone', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '联系人邮箱' : 'Contact Email'}
                    placeholder={isZh ? '请输入联系人邮箱' : 'Enter contact email'}
                    value={form.contactEmail}
                    onChange={(event) => updateField('contactEmail', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '商户名称' : 'Merchant Name'}
                    placeholder={isZh ? '请输入商户名称' : 'Enter merchant name'}
                    value={form.merchantName}
                    onChange={(event) => updateField('merchantName', event.target.value)}
                    disabled={submitting}
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Divider />
        <Stack direction='row' spacing={2} justifyContent='flex-end'>
          <LoadingButton loading={submitting} type='submit' variant='contained'>
            {isZh ? '保存' : 'Save'}
          </LoadingButton>
          <Button
            variant='outlined'
            component={Link}
            href={`/${lang}/customerCenter/storeManagement`}
            disabled={submitting}
          >
            {isZh ? '取消' : 'Cancel'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
