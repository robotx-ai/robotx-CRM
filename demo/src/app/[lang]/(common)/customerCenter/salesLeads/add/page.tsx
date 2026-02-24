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

type LeadStatus =
  | 'Unfollowed'
  | 'Following Up'
  | 'Converted'
  | 'Lost'
  | 'Followed but No Reply'
  | 'Followed with Reply'
  | 'Sales Pending'
  | 'Sales Rejected';

type LeadSource =
  | 'Sales Email'
  | 'Shopify Website'
  | 'Referral'
  | 'Manufacturer Referral';

type CustomerType = 'Education' | 'Individual' | 'Warehouse' | 'Hotel' | 'Hospital';

type SalesLeadFormState = {
  contactName: string;
  contactEmail: string;
  phoneNumber: string;
  organizationName: string;
  customerType: CustomerType;
  interestedProduct: string;
  message: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  leadSource: LeadSource;
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string;
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

const LEAD_SOURCE_OPTIONS: LeadSource[] = [
  'Sales Email',
  'Shopify Website',
  'Referral',
  'Manufacturer Referral',
];

const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'Unfollowed',
  'Following Up',
  'Converted',
  'Lost',
  'Followed but No Reply',
  'Followed with Reply',
  'Sales Pending',
  'Sales Rejected',
];

const CUSTOMER_TYPE_OPTIONS: CustomerType[] = [
  'Education',
  'Individual',
  'Warehouse',
  'Hotel',
  'Hospital',
];

const INITIAL_FORM_STATE: SalesLeadFormState = {
  contactName: '',
  contactEmail: '',
  phoneNumber: '',
  organizationName: '',
  customerType: 'Individual',
  interestedProduct: '',
  message: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  leadSource: 'Shopify Website',
  referrerName: '',
  referrerPhone: '',
  referrerEmail: '',
  sourceCampaign: '',
  leadStatus: 'Unfollowed',
};

function getStatusLabel(status: LeadStatus, isZh: boolean): string {
  if (!isZh) return status;
  if (status === 'Unfollowed') return '未跟进';
  if (status === 'Following Up') return '跟进中';
  if (status === 'Converted') return '已转化';
  if (status === 'Lost') return '未成交';
  if (status === 'Followed but No Reply') return '已跟进未回复';
  if (status === 'Followed with Reply') return '已跟进有回复';
  if (status === 'Sales Pending') return '销售待定';
  return '销售拒绝';
}

function getSourceLabel(source: LeadSource, isZh: boolean): string {
  if (!isZh) return source;
  if (source === 'Sales Email') return '销售邮件';
  if (source === 'Shopify Website') return 'Shopify 网站';
  if (source === 'Referral') return '推荐转介';
  return '厂家转介';
}

function formatUsPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function normalizePhoneDigits(value: string): string | null {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  return digits ? digits : null;
}

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
    const organizationName = form.organizationName.trim();

    if (!contactName || !contactEmail || !organizationName || !form.customerType) {
      await Swal.fire({
        icon: 'warning',
        title: isZh ? '请先填写必填项' : 'Please fill required fields',
        text: isZh
          ? '联系人姓名、联系人邮箱、机构/企业名称、客户类型为必填字段。'
          : 'Contact Name, Contact Email, Organization/Business Name, and Customer Type are required.',
      });
      return;
    }

    const isReferral = form.leadSource === 'Referral';
    if (
      isReferral &&
      (!form.referrerName.trim() || !form.referrerPhone.trim() || !form.referrerEmail.trim())
    ) {
      await Swal.fire({
        icon: 'warning',
        title: isZh ? '请补全推荐人信息' : 'Please complete referrer information',
        text: isZh
          ? '当线索来源为“推荐转介”时，推荐人姓名、电话、邮箱为必填。'
          : 'For Referral lead source, referrer name, phone, and email are required.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        contact_name: contactName,
        contact_email: contactEmail,
        phone_number: normalizePhoneDigits(form.phoneNumber),
        organization_name: organizationName,
        customer_type: form.customerType,
        interested_product: form.interestedProduct.trim() || null,
        message: form.message.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        zip_code: form.zipCode.trim() || null,
        lead_source: form.leadSource,
        referrer_name: form.referrerName.trim() || null,
        referrer_phone: normalizePhoneDigits(form.referrerPhone),
        referrer_email: form.referrerEmail.trim() || null,
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

      router.push(`/${lang}/sales-leads/detail?id=${encodeURIComponent(createdLead.id)}`);
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
              <Typography variant='h6'>{isZh ? '线索信息' : 'Lead Information'}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '联系人姓名' : 'Contact Name'}
                    value={form.contactName}
                    onChange={(event) => updateField('contactName', event.target.value)}
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
                    onChange={(event) => updateField('contactEmail', event.target.value)}
                    inputProps={{ maxLength: 320 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '机构/企业名称' : 'Organization / Business Name'}
                    value={form.organizationName}
                    onChange={(event) => updateField('organizationName', event.target.value)}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    required
                    label={isZh ? '客户类型' : 'Customer Type'}
                    value={form.customerType}
                    onChange={(event) => updateField('customerType', event.target.value as CustomerType)}
                  >
                    {CUSTOMER_TYPE_OPTIONS.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '联系电话' : 'Phone Number'}
                    placeholder='(555) 123-4567'
                    value={form.phoneNumber}
                    onChange={(event) =>
                      updateField('phoneNumber', formatUsPhoneInput(event.target.value))
                    }
                    inputProps={{ maxLength: 14 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '意向产品' : 'Interested Product'}
                    value={form.interestedProduct}
                    onChange={(event) => updateField('interestedProduct', event.target.value)}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '地址' : 'Address'}
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '城市' : 'City'}
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '州/省' : 'State'}
                    value={form.state}
                    onChange={(event) => updateField('state', event.target.value)}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '邮编' : 'Zip Code'}
                    value={form.zipCode}
                    onChange={(event) => updateField('zipCode', event.target.value)}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '活动来源' : 'Source Campaign'}
                    value={form.sourceCampaign}
                    onChange={(event) => updateField('sourceCampaign', event.target.value)}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label={isZh ? '线索来源' : 'Lead Source'}
                    value={form.leadSource}
                    onChange={(event) => updateField('leadSource', event.target.value as LeadSource)}
                  >
                    {LEAD_SOURCE_OPTIONS.map((source) => (
                      <MenuItem key={source} value={source}>
                        {getSourceLabel(source, isZh)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label={isZh ? '线索状态' : 'Lead Status'}
                    value={form.leadStatus}
                    onChange={(event) => updateField('leadStatus', event.target.value as LeadStatus)}
                  >
                    {LEAD_STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        {getStatusLabel(status, isZh)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {(form.leadSource === 'Referral' || form.leadSource === 'Manufacturer Referral') && (
                  <>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        required={form.leadSource === 'Referral'}
                        label={isZh ? '推荐人姓名' : 'Referrer Name'}
                        value={form.referrerName}
                        onChange={(event) => updateField('referrerName', event.target.value)}
                        inputProps={{ maxLength: 150 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        required={form.leadSource === 'Referral'}
                        label={isZh ? '推荐人电话' : 'Referrer Phone'}
                        placeholder='(555) 123-4567'
                        value={form.referrerPhone}
                        onChange={(event) =>
                          updateField('referrerPhone', formatUsPhoneInput(event.target.value))
                        }
                        inputProps={{ maxLength: 14 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        required={form.leadSource === 'Referral'}
                        type='email'
                        label={isZh ? '推荐人邮箱' : 'Referrer Email'}
                        value={form.referrerEmail}
                        onChange={(event) => updateField('referrerEmail', event.target.value)}
                        inputProps={{ maxLength: 320 }}
                      />
                    </Grid>
                  </>
                )}

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
                    placeholder={isZh ? '记录客户原始留言...' : 'Capture the customer inquiry...'}
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
