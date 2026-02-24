'use client';

import { ScheduleList } from '@/components/ScheduleCard/ScheduleList';
import { ContentLayout } from '@/layouts/ContentLayout';
import { JumboCard, JumboDdMenu } from '@jumbo/components';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { CONTAINER_MAX_WIDTH } from '../../config/layouts';
import { type ScheduleDataObject } from '../ScheduleCard/data';

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

type SalesLeadRow = {
  id: string;
  owner_user_id: string;
  contact_name: string;
  contact_email: string;
  phone_number: string | null;
  organization_name: string;
  customer_type: CustomerType;
  interested_product: string | null;
  message: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  lead_source: LeadSource;
  referrer_name: string | null;
  referrer_phone: string | null;
  referrer_email: string | null;
  source_campaign: string | null;
  lead_status: LeadStatus;
  created_at: string | null;
  updated_at: string | null;
};

type SalesLeadFollowupRow = {
  id: string;
  sales_lead_id: string;
  owner_user_id: string;
  note: string;
  created_at: string | null;
  updated_at: string | null;
};

type SalesLeadFollowupListResponse = {
  total: number;
  items: SalesLeadFollowupRow[];
};

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

const statusColorMap: Record<
  LeadStatus,
  'warning' | 'info' | 'success' | 'default' | 'primary' | 'secondary' | 'error'
> = {
  Unfollowed: 'warning',
  'Following Up': 'info',
  'Followed but No Reply': 'default',
  'Followed with Reply': 'primary',
  'Sales Pending': 'secondary',
  Converted: 'success',
  'Sales Rejected': 'error',
  Lost: 'default',
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

function formatDateTime(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');
}

function formatUsPhoneNumber(value: string | null): string {
  if (!value) return '-';
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10) return value;
  const trimmed = digits.slice(0, 10);
  return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3, 6)}-${trimmed.slice(6, 10)}`;
}

function formatMonthYear(value: string | null): string {
  if (!value) return 'No Date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No Date';
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatFollowupDate(value: string | null): string {
  if (!value) return 'No timestamp';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function composeAddress(lead: SalesLeadRow | null): string {
  if (!lead) return '-';
  const parts = [lead.address, lead.city, lead.state, lead.zip_code]
    .map((part) => (part ? part.trim() : ''))
    .filter(Boolean);
  return parts.length ? parts.join(', ') : '-';
}

const useProfileLayout = () => {
  return useMemo(
    () => ({
      rightSidebarOptions: {
        sx: {
          display: 'flex',
          flexShrink: 0,
          flexDirection: 'column',
          width: { md: 'auto', lg: 350 },
        },
      },
      wrapperOptions: {
        sx: {
          flexDirection: { xs: 'column', lg: 'row' },
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, sm: 0, xs: 0 },
          mr: { lg: 3 },
        },
      },
      mainOptions: {
        sx: {
          minHeight: 0,
        },
      },
    }),
    []
  );
};

export function SalesLeadDetail() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : (langParam ?? 'en-US');
  const isZh = lang === 'zh-CN';
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<SalesLeadRow | null>(null);
  const [followups, setFollowups] = useState<SalesLeadFollowupRow[]>([]);
  const [followupsLoading, setFollowupsLoading] = useState(true);
  const [followupsError, setFollowupsError] = useState<string | null>(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState<HTMLElement | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [addFollowupOpen, setAddFollowupOpen] = useState(false);
  const [newFollowupNote, setNewFollowupNote] = useState('');
  const [addingFollowup, setAddingFollowup] = useState(false);
  const profileLayoutConfig = useProfileLayout();

  const leadId = searchParams.get('id') ?? '';

  useEffect(() => {
    if (!leadId) {
      setLead(null);
      setFollowups([]);
      setError('Missing sales lead id');
      setFollowupsError(null);
      setLoading(false);
      setFollowupsLoading(false);
      return;
    }

    let active = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      setFollowupsLoading(true);
      setFollowupsError(null);
      try {
        const leadResponse = await fetch(`/api/v1/customerCenter/salesLeads/${leadId}`, {
          cache: 'no-store',
        });

        if (!leadResponse.ok) {
          throw new Error(`Failed to load sales lead detail: ${leadResponse.status}`);
        }

        const leadPayload = (await leadResponse.json()) as SalesLeadRow;
        if (!active) return;
        setLead(leadPayload);
      } catch (err) {
        if (!active) return;
        setLead(null);
        setError(err instanceof Error ? err.message : 'Failed to load sales lead detail');
      } finally {
        if (active) {
          setLoading(false);
        }
      }

      try {
        const followupsResponse = await fetch(
          `/api/v1/customerCenter/salesLeads/${leadId}/followups?limit=50`,
          {
            cache: 'no-store',
          }
        );
        if (!followupsResponse.ok) {
          throw new Error(`Failed to load follow-ups: ${followupsResponse.status}`);
        }
        const followupsPayload = (await followupsResponse.json()) as SalesLeadFollowupListResponse;
        if (!active) return;
        setFollowups(followupsPayload.items ?? []);
      } catch (err) {
        if (!active) return;
        setFollowups([]);
        setFollowupsError(err instanceof Error ? err.message : 'Failed to load follow-ups');
      } finally {
        if (active) {
          setFollowupsLoading(false);
        }
      }
    };
    void run();

    return () => {
      active = false;
    };
  }, [leadId]);

  const followupItems = useMemo<ScheduleDataObject[]>(() => {
    return followups.map((followup) => ({
      id: followup.id,
      title: followup.note,
      subTitle: formatFollowupDate(followup.created_at),
      color: '#3BD2A2',
    }));
  }, [followups]);

  const openStatusMenu = (event: MouseEvent<HTMLElement>) => {
    if (updatingStatus || !lead) return;
    setStatusAnchorEl(event.currentTarget);
  };

  const closeStatusMenu = () => {
    setStatusAnchorEl(null);
  };

  const handleStatusChange = async (nextStatus: LeadStatus) => {
    if (!lead || lead.lead_status === nextStatus || !leadId) {
      setStatusAnchorEl(null);
      return;
    }

    const previousStatus = lead.lead_status;
    setStatusAnchorEl(null);
    setUpdatingStatus(true);
    setLead((prev) => (prev ? { ...prev, lead_status: nextStatus } : prev));

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

      const payload = (await response.json()) as SalesLeadRow;
      setLead(payload);
    } catch {
      setLead((prev) => (prev ? { ...prev, lead_status: previousStatus } : prev));
      window.alert(isZh ? '更新线索状态失败' : 'Failed to update lead status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateFollowup = async () => {
    const note = newFollowupNote.trim();
    if (!note || !leadId) {
      return;
    }

    setAddingFollowup(true);
    try {
      const response = await fetch(`/api/v1/customerCenter/salesLeads/${leadId}/followups`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create follow-up: ${response.status}`);
      }
      const payload = (await response.json()) as SalesLeadFollowupRow;
      setFollowups((prev) => [payload, ...prev]);
      setAddFollowupOpen(false);
      setNewFollowupNote('');
    } catch {
      window.alert(isZh ? '创建跟进失败' : 'Failed to add follow-up');
    } finally {
      setAddingFollowup(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <ContentLayout
        rightSidebar={null}
        header={
          <>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                pb: 3,
              }}
              mb={2.5}
            >
              <Stack gap={1.5}>
                <Box>
                  <Button
                    size='small'
                    variant='outlined'
                    startIcon={<ArrowBackOutlinedIcon />}
                    component={Link}
                    href={`/${lang}/customerCenter/salesLeads`}
                  >
                    {isZh ? '返回线索列表' : 'Back to Sales Leads'}
                  </Button>
                </Box>
                {loading ? (
                  <Stack direction={'row'} gap={1.5} alignItems={'center'}>
                    <CircularProgress size={20} />
                    <Typography variant={'body1'}>Loading sales lead...</Typography>
                  </Stack>
                ) : error ? (
                  <Stack gap={1}>
                    <Typography variant={'h5'}>Sales Lead Detail</Typography>
                    <Typography color={'error.main'} variant={'body2'}>
                      {error}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack direction={'row'} alignItems={'center'} mr={2}>
                    <Stack>
                      <Typography variant={'h4'} mb={0.5}>
                        {lead?.contact_name || 'Sales Lead'}
                      </Typography>
                      <Typography variant={'body2'}>{lead?.contact_email || '-'}</Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
              <JumboDdMenu />
            </Stack>

            <List
              disablePadding
              sx={{
                display: 'flex',
                minWidth: 0,
                flexWrap: 'wrap',
                color: 'text.secondary',
                borderBottom: 1,
                borderColor: 'divider',
                mb: 3.75,
                pb: 2,
                '.MuiListItem-root': {
                  pl: 0,
                  py: 0.5,
                  width: { xs: '100%', md: '50%' },
                },
                '.MuiListItemIcon-root': {
                  color: 'inherit',
                  minWidth: 38,
                },
                '.MuiListItemText-root': {
                  display: 'flex',
                  minWidth: 0,
                },
              }}
            >
              <ListItem>
                <ListItemIcon>
                  <FingerprintOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Lead ID</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.id || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Contact Name</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.contact_name || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Status</Typography>}
                  secondary={
                    <Typography component='span' variant='body1' color='text.primary' width={'50%'}>
                      {lead ? (
                        <Chip
                          component='span'
                          size='small'
                          label={
                            updatingStatus ? (
                              <Stack direction='row' spacing={0.75} alignItems='center'>
                                <CircularProgress size={12} color='inherit' />
                                <span>{getStatusLabel(lead.lead_status, isZh)}</span>
                              </Stack>
                            ) : (
                              getStatusLabel(lead.lead_status, isZh)
                            )
                          }
                          color={statusColorMap[lead.lead_status]}
                          onClick={openStatusMenu}
                          sx={{
                            cursor: updatingStatus ? 'not-allowed' : 'pointer',
                            opacity: updatingStatus ? 0.8 : 1,
                          }}
                        />
                      ) : (
                        '-'
                      )}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CategoryOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Source</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.lead_source || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ApartmentOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Organization</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.organization_name || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CategoryOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Customer Type</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.customer_type || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Created At</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {formatDateTime(lead?.created_at ?? null)}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AutorenewOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Last Updated</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {formatDateTime(lead?.updated_at ?? null)}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MailOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Email</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.contact_email ? (
                        <MuiLink href={`mailto:${lead.contact_email}`}>{lead.contact_email}</MuiLink>
                      ) : (
                        '-'
                      )}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Phone</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {formatUsPhoneNumber(lead?.phone_number ?? null)}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Address</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {composeAddress(lead)}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Referrer</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.referrer_name || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Referrer Phone</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {formatUsPhoneNumber(lead?.referrer_phone ?? null)}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AlternateEmailOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Referrer Email</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.referrer_email || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalOfferOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Interested Product</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.interested_product || '-'}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AlternateEmailOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant='body1' width={'50%'}>Campaign</Typography>}
                  secondary={
                    <Typography variant='body1' color='text.primary' width={'50%'}>
                      {lead?.source_campaign || '-'}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </>
        }
        {...profileLayoutConfig}
      >
        <JumboCard
          title={'Lead Message'}
          subheader={'Customer message'}
          action={
            <Button
              variant='contained'
              size='small'
              onClick={() => setAddFollowupOpen(true)}
              disabled={!lead || addingFollowup}
              startIcon={
                addingFollowup ? (
                  <CircularProgress size={14} color='inherit' />
                ) : (
                  <NoteAddOutlinedIcon fontSize='small' />
                )
              }
            >
              {isZh ? '添加跟进' : 'Add Follow up'}
            </Button>
          }
          contentWrapper
          contentSx={{ pt: 0 }}
          sx={{ mb: 3.75 }}
        >
          <Typography variant={'body1'} sx={{ whiteSpace: 'pre-wrap' }}>
            {lead?.message || '-'}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant={'h5'} mb={0.5}>
            Follow-up Chain
          </Typography>
          <Typography variant={'body2'} color={'text.secondary'} mb={2.5}>
            {formatMonthYear(lead?.created_at ?? null)}
          </Typography>
          {followupsLoading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={`followup-loading-${index}`} variant='rounded' animation='wave' height={30} />
              ))}
            </Stack>
          ) : (
            <Fade in timeout={450}>
              <Box>
                <ScheduleList
                  heading={'Lead follow-up history'}
                  emptyText={followupsError || 'No follow-ups yet'}
                  items={followupItems}
                />
              </Box>
            </Fade>
          )}
        </JumboCard>
        <Menu
          anchorEl={statusAnchorEl}
          open={Boolean(statusAnchorEl)}
          onClose={closeStatusMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          {LEAD_STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} onClick={() => void handleStatusChange(status)}>
              <Chip size='small' label={getStatusLabel(status, isZh)} color={statusColorMap[status]} />
            </MenuItem>
          ))}
        </Menu>
        <Dialog
          open={addFollowupOpen}
          onClose={() => {
            if (!addingFollowup) {
              setAddFollowupOpen(false);
            }
          }}
          fullWidth
          maxWidth='sm'
        >
          <DialogTitle>{isZh ? '添加跟进' : 'Add Follow up'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={4}
              maxRows={10}
              margin='dense'
              label={isZh ? '跟进内容' : 'Follow-up note'}
              value={newFollowupNote}
              onChange={(event) => setNewFollowupNote(event.target.value)}
              placeholder={
                isZh ? '输入本次跟进记录...' : 'Write the follow-up note for this lead...'
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddFollowupOpen(false)} disabled={addingFollowup}>
              {isZh ? '取消' : 'Cancel'}
            </Button>
            <Button
              onClick={() => void handleCreateFollowup()}
              variant='contained'
              disabled={addingFollowup || !newFollowupNote.trim()}
              startIcon={
                addingFollowup ? (
                  <CircularProgress size={14} color='inherit' />
                ) : (
                  <NoteAddOutlinedIcon fontSize='small' />
                )
              }
            >
              {isZh ? '保存跟进' : 'Save Follow up'}
            </Button>
          </DialogActions>
        </Dialog>
      </ContentLayout>
    </Container>
  );
}
