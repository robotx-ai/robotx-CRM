'use client';

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
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AddStorePage() {
  const params = useParams();
  const langParam = params.lang;
  const lang = Array.isArray(langParam) ? langParam[0] : langParam ?? 'en-US';
  const isZh = lang === 'zh-CN';

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
                    sx={{
                      height: '100%',
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
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
                  <Card variant='outlined' sx={{ height: '100%' }}>
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
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '门店地址' : 'Store Address'}
                    placeholder={isZh ? '请输入门店地址' : 'Please enter'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '门店联系人' : 'Store Contact'}
                    placeholder={isZh ? '请输入联系人' : 'Enter contact person'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={isZh ? '联系人职位' : "Contact's position"}
                    placeholder={isZh ? '请输入联系人职位' : 'Enter contact position'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '联系人电话' : 'Contact phone number'}
                    placeholder={isZh ? '请输入联系电话' : 'Enter phone number'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '联系人邮箱' : 'Contact Email'}
                    placeholder={isZh ? '请输入联系人邮箱' : 'Enter contact email'}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={isZh ? '商户名称' : 'Merchant Name'}
                    placeholder={isZh ? '请输入商户名称' : 'Enter merchant name'}
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Divider />
        <Stack direction='row' spacing={2} justifyContent='flex-end'>
          <Button variant='contained'>{isZh ? '保存' : 'Save'}</Button>
          <Button
            variant='outlined'
            component={Link}
            href={`/${lang}/customerCenter/storeManagement`}
          >
            {isZh ? '取消' : 'Cancel'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
