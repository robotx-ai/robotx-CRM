'use client';

import { LoginForm } from '@/components/LoginForm';
import { Link } from '@/components/NextLink';
import { ASSET_AVATARS, ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Typography,
  alpha,
} from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

export const Signin1 = () => {
  const pathname = usePathname();
  const pathLocale = pathname?.split('/')[1];
  const lang =
    pathLocale && supportedLocales.includes(pathLocale) ? pathLocale : 'en-US';
  const isZh = lang === 'zh-CN';

  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: (theme) => theme.spacing(4),
      }}
    >
      <Div sx={{ mb: 3, display: 'inline-flex' }}>
        <Image
          height={35}
          width={118}
          src={`${ASSET_IMAGES}/logos/robotx_logo.webp`}
          alt='Robotx CRM'
        />
      </Div>
      <Card sx={{ maxWidth: '100%', width: 360, mb: 4 }}>
        <Div sx={{ position: 'relative', height: '200px' }}>
          <CardMedia
            component='img'
            alt='green iguana'
            height='200'
            image={`${ASSET_IMAGES}/colin-watts.jpg`}
          />
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: (theme) =>
                alpha(theme.palette.common.black, 0.5),
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={'h2'}
              sx={{
                color: 'common.white',
                fontSize: '1.5rem',
                mb: 0,
              }}
            >
              {isZh ? '登录' : 'Sign In'}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Avatar
            alt='Remy Sharp'
            src={getAssetPath(`${ASSET_AVATARS}/robot_1.png`)}
            sx={{
              width: 56,
              height: 56,
              marginLeft: 'auto',
              boxShadow: shadows[3],
              transform: 'translateY(-50%)',
            }}
          />
          <LoginForm />
          <Typography textAlign={'center'} variant={'body1'} mb={1}>
            {isZh ? '还没有账号？' : "Don't have an account?"}{' '}
            <Link underline='none' href={`/${lang}/auth/signup-1`}>
              {isZh ? '立即注册' : 'Sign up now'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Div>
  );
};
