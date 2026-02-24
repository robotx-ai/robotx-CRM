'use client';
import { Link } from '@/components/NextLink';
import { SignupForm } from '@/components/SignupForm';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import AddIcon from '@mui/icons-material/Add';
import {
  alpha,
  Card,
  CardContent,
  CardMedia,
  Fab,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

export function Signup1() {
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
        <Link underline='none' href='#' sx={{ display: 'inline-flex' }}>
          <Image
            height={35}
            width={118}
            src={`${ASSET_IMAGES}/logos/robotx_logo.webp`}
            alt='Robotx CRM'
          />
        </Link>
      </Div>
      <Card sx={{ maxWidth: '100%', width: 360, mb: 4 }}>
        <Div sx={{ position: 'relative', height: '200px' }}>
          <CardMedia
            component='img'
            alt='green iguana'
            height='200'
            image={getAssetPath(`${ASSET_IMAGES}/colin-watts.jpg`, '640x428')}
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
              sx={{ color: 'common.white', fontSize: '1.5rem', mb: 0 }}
            >
              {isZh ? '注册' : 'Sign up'}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Fab
            color='secondary'
            aria-label='add'
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              transform: 'translateY(-50%)',
            }}
          >
            <AddIcon />
          </Fab>
          {/* go to signup form */}
          <SignupForm />
          <Typography textAlign={'center'} variant={'body1'} mb={1}>
            {isZh ? '已有账号？' : 'Have an account?'}{' '}
            <Link underline='none' href={`/${lang}/auth/login-1`}>
              {isZh ? '去登录' : 'Sign in'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Div>
  );
}
