'use client';
import {
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from '@jumbo/vendors/react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';
import { getValidationSchema } from './validation';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

const SignupForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = React.useState<boolean>(false);
  const [values, setValues] = React.useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();

  const pathLocale = pathname?.split('/')[1];
  const lang =
    pathLocale && supportedLocales.includes(pathLocale) ? pathLocale : 'en-US';
  const isZh = lang === 'zh-CN';
  const validationSchema = React.useMemo(() => getValidationSchema(isZh), [isZh]);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const handleSignup = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setSignupSuccess(false);

    try {
      const response = await fetch('/api/v1/auth/signup/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          full_name: data.name.trim(),
          password: data.password,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        enqueueSnackbar(
          payload?.detail ||
            (isZh ? '注册失败，请稍后再试。' : 'Sign-up failed. Please try again.'),
          { variant: 'error' },
        );
        return;
      }

      setSignupSuccess(true);
      enqueueSnackbar(
        isZh
          ? '注册成功，请前往邮箱完成验证后登录。'
          : 'Sign-up successful. Verify your email before logging in.',
        { variant: 'success' },
      );
      router.push(`/${lang}/auth/login-1`);
      router.refresh();
    } catch {
      enqueueSnackbar(
        isZh ? '注册服务不可用，请稍后重试。' : 'Sign-up service is unavailable.',
        { variant: 'error' },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleSignup}
      onChange={() => {}}
    >
      <Stack spacing={3} mb={3}>
        {signupSuccess && (
          <Alert severity='success'>
            {isZh
              ? '请检查您的邮箱，完成验证后再登录。'
              : 'Check your email to verify your account before logging in.'}
          </Alert>
        )}
        <JumboInput fieldName={'name'} label={isZh ? '姓名' : 'Name'} defaultValue='' />
        <JumboInput
          fullWidth
          fieldName={'email'}
          label={isZh ? '邮箱' : 'Email'}
          defaultValue=''
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
          defaultValue=''
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
        <JumboOutlinedInput
          fieldName={'confirmPassword'}
          label={isZh ? '确认密码' : 'Confirm Password'}
          type={values.showConfirmPassword ? 'text' : 'password'}
          margin='none'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle confirm password visibility'
                onClick={handleClickShowConfirmPassword}
                edge='end'
              >
                {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          defaultValue=''
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
        <LoadingButton
          fullWidth
          type='submit'
          variant='contained'
          size='large'
          loading={loading}
        >
          {isZh ? '注册' : 'Sign up'}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { SignupForm };
