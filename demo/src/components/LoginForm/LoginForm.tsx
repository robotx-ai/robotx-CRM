'use client';
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from '@jumbo/vendors/react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Link } from '../NextLink';
import { getValidationSchema } from './validation';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

const LoginForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const pathLocale = pathname?.split('/')[1];
  const lang =
    pathLocale && supportedLocales.includes(pathLocale) ? pathLocale : 'en-US';
  const isZh = lang === 'zh-CN';
  const validationSchema = React.useMemo(
    () => getValidationSchema(isZh),
    [isZh],
  );

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      accessToken: 'ksdjfweirjsljLKDJfksdjfew',
    });

    if (response?.ok) {
      router.push(`/${lang}/welcome`);
      router.refresh();
    } else {
      enqueueSnackbar(isZh ? '邮箱或密码错误' : 'Invalid email or password!', {
        variant: 'error',
      });
      setLoading(false);
    }
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      onChange={() => {}}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={'email'}
          label={isZh ? '邮箱' : 'Email'}
          defaultValue='robotx.tester@local.dev'
        />
        <JumboOutlinedInput
          fieldName={'password'}
          label={isZh ? '密码' : 'Password'}
          type={values.showPassword ? 'text' : 'password'}
          margin='none'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                edge='end'
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          defaultValue={'Robotx#12345'}
        />

        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <JumboCheckbox
            fieldName='rememberMe'
            label={isZh ? '记住我' : 'Remember Me'}
            defaultChecked
          />
          <Typography textAlign={'right'} variant={'body1'}>
            <Link underline='none' href={`/${lang}/auth/forgot-password`}>
              {isZh ? '忘记密码？' : 'Forgot your password?'}
            </Link>
          </Typography>
        </Stack>
        <LoadingButton
          fullWidth
          type='submit'
          variant='contained'
          size='large'
          loading={loading}
        >
          {isZh ? '登录' : 'Login'}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
