'use client';

import useSwalWrapper from '@jumbo/vendors/sweetalert2/hooks';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  Link as MuiLink,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type LeadStatus = 'Unfollowed' | 'Following Up' | 'Converted' | 'Lost';
type LeadSource = 'Sales Email' | 'Shopify Website';

type SalesLeadFormState = {
  contactName: string;
  contactEmail: string;
  phoneNumber: string;
  interestedProduct: string;
  message: string;
  location: string;
  leadSource: LeadSource;
  sourceCampaign: string;
  leadStatus: LeadStatus;
};

type ApiValidationError = {
  loc?: Array<string | number>;
  msg?: string;
};

type ApiErrorPayload = {
  detail?: string | ApiValidationError[] | Record<string, unknown>;
  message?: string;
};

type SalesLeadRead = {
  id: string;
};

const INITIAL_FORM_STATE: SalesLeadFormState = {
  contactName: '',
  contactEmail: '',
  phoneNumber: '',
  interestedProduct: '',
  message: '',
  location: '',
  leadSource: 'Shopify Website',
  sourceCampaign: '',
  leadStatus: 'Unfollowed',
};

export default function AddSalesLeadPage() {
  const Swal = useSwalWrapper();
  const router = useRouter();
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : (langParam ?? 'en-US');
  const isZh = lang === 'zh-CN';

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<SalesLeadFormState>(INITIAL_FORM_STATE);

  const updateField = <K extends keyof SalesLeadFormState>(
    key: K,
    value: SalesLeadFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    const contactName = form.contactName.trim();
    const contactEmail = form.contactEmail.trim();

    if (!contactName || !contactEmail) {
      await Swal.fire({
        icon: 'warning',
        title: isZh ? '请先填写必填项' : 'Please fill required fields',
        text:
          isZh
            ? '联系人姓名和邮箱为必填字段。'
            : 'Contact Name and Contact Email are required.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        contact_name: contactName,
        contact_email: contactEmail,
        phone_number: form.phoneNumber.trim() || null,
        interested_product: form.interestedProduct.trim() || null,
        message: form.message.trim() || null,
        location: form.location.trim() || null,
        lead_source: form.leadSource,
        source_campaign: form.sourceCampaign.trim() || null,
        lead_status: form.leadStatus,
      };

      const response = await fetch('/api/v1/customerCenter/salesLeads', {
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

      const createdLead = (await response.json()) as SalesLeadRead;

      await Swal.fire({
        icon: 'success',
        title: isZh ? '线索创建成功' : 'Sales lead created successfully',
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      });

      router.push(
        `/${lang}/sales-leads/detail?id=${encodeURIComponent(createdLead.id)}`
      );
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
      <Stack component='form' spacing={3} onSubmit={handleSubmit} noValidate>
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
              href={`/${lang}/customerCenter/salesLeads`}
            >
              {isZh ? '销售线索管理' : 'Sales Leads Management'}
            </MuiLink>
            <Typography color='text.primary'>
              {isZh ? '新增线索' : 'Add Sales Lead'}
            </Typography>
          </Breadcrumbs>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            {isZh ? '新增线索' : 'Add Sales Lead'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {isZh
              ? '录入新线索信息并设置初始状态。'
              : 'Create a new lead record with contact details and initial status.'}
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Typography variant='h6'>
                {isZh ? '线索信息' : 'Lead Information'}
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '联系人姓名' : 'Contact Name'}
                    value={form.contactName}
                    onChange={(event) =>
                      updateField('contactName', event.target.value)
                    }
                    inputProps={{ maxLength: 150 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type='email'
                    label={isZh ? '联系人邮箱' : 'Contact Email'}
                    value={form.contactEmail}
                    onChange={(event) =>
                      updateField('contactEmail', event.target.value)
                    }
                    inputProps={{ maxLength: 320 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '联系电话' : 'Phone Number'}
                    value={form.phoneNumber}
                    onChange={(event) =>
                      updateField('phoneNumber', event.target.value)
                    }
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '意向产品' : 'Interested Product'}
                    value={form.interestedProduct}
                    onChange={(event) =>
                      updateField('interestedProduct', event.target.value)
                    }
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '地区' : 'Location'}
                    value={form.location}
                    onChange={(event) => updateField('location', event.target.value)}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '活动来源' : 'Source Campaign'}
                    value={form.sourceCampaign}
                    onChange={(event) =>
                      updateField('sourceCampaign', event.target.value)
                    }
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label={isZh ? '线索来源' : 'Lead Source'}
                    value={form.leadSource}
                    onChange={(event) =>
                      updateField('leadSource', event.target.value as LeadSource)
                    }
                  >
                    <MenuItem value='Sales Email'>
                      {isZh ? '销售邮件' : 'Sales Email'}
                    </MenuItem>
                    <MenuItem value='Shopify Website'>
                      {isZh ? 'Shopify 网站' : 'Shopify Website'}
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label={isZh ? '线索状态' : 'Lead Status'}
                    value={form.leadStatus}
                    onChange={(event) =>
                      updateField('leadStatus', event.target.value as LeadStatus)
                    }
                  >
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
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    label={isZh ? '留言内容' : 'Lead Message'}
                    value={form.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    inputProps={{ maxLength: 4000 }}
                    placeholder={
                      isZh ? '记录客户原始留言...' : 'Capture the customer inquiry...'
                    }
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Divider />

        <Stack direction='row' spacing={1.5} justifyContent='flex-end'>
          <Button
            variant='outlined'
            component={Link}
            href={`/${lang}/customerCenter/salesLeads`}
            disabled={submitting}
          >
            {isZh ? '取消' : 'Cancel'}
          </Button>
          <LoadingButton
            type='submit'
            variant='contained'
            loading={submitting}
            startIcon={<ContactPhoneOutlinedIcon />}
          >
            {isZh ? '保存线索' : 'Save Lead'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
}
