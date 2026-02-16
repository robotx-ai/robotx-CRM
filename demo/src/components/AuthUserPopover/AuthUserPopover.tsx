import { JumboDdPopover } from '@jumbo/components';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Div } from '@jumbo/shared';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { authUser } from './data';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

const AuthUserPopover = () => {
  const { theme } = useJumboTheme();
  const pathname = usePathname();

  const logout = React.useCallback(() => {
    (async () => {
      const pathLocale = pathname?.split('/')[1];
      const locale =
        pathLocale && supportedLocales.includes(pathLocale)
          ? pathLocale
          : 'en-US';

      await signOut({
        callbackUrl: `/${locale}/auth/login-1`,
      });
    })();
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={authUser?.profile_pic}
            sizes={'small'}
            sx={{ boxShadow: 23, cursor: 'pointer' }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            p: (theme) => theme.spacing(2.5),
          }}
        >
          <Avatar
            src={authUser?.profile_pic}
            alt={authUser.name}
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography variant={'h5'}>{authUser.name}</Typography>
          <Typography variant={'body1'} color='text.secondary'>
            {authUser.handle}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary='Profile' sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Edit Profile' sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <RepeatOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                // onClick={() => navigate('/samples/content-layout')}
                primary='Switch User'
                sx={{ my: 0 }}
              />
            </ListItemButton>
            <ListItemButton onClick={logout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary='Logout' sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { AuthUserPopover };
