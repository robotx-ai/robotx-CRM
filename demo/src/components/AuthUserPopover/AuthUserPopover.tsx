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
import { FALLBACK_AUTH_USER } from './data';

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type SessionPayload = {
  user?: SessionUser | null;
};

const AuthUserPopover = () => {
  const { theme } = useJumboTheme();
  const pathname = usePathname();
  const [displayUser, setDisplayUser] = React.useState(FALLBACK_AUTH_USER);

  React.useEffect(() => {
    let active = true;

    const resolveSessionUser = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as SessionPayload | null;
        const sessionUser = payload?.user;

        const email = sessionUser?.email?.trim() || '';
        const fallbackNameFromEmail = email.includes('@')
          ? email.split('@')[0]
          : '';
        const name = sessionUser?.name?.trim() || fallbackNameFromEmail || 'User';
        const image = sessionUser?.image?.trim() || FALLBACK_AUTH_USER.profile_pic;

        if (!active) {
          return;
        }

        setDisplayUser({
          ...FALLBACK_AUTH_USER,
          email,
          handle: email,
          name,
          profile_pic: image,
        });
      } catch {
        // Keep fallback identity on fetch/session parsing failures.
      }
    };

    void resolveSessionUser();

    return () => {
      active = false;
    };
  }, []);

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
            src={displayUser.profile_pic}
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
            src={displayUser.profile_pic}
            alt={displayUser.name}
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography variant={'h5'}>{displayUser.name}</Typography>
          <Typography variant={'body1'} color='text.secondary'>
            {displayUser.handle}
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
