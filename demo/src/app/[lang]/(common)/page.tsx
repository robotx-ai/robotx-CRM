import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function Home({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const isZh = lang === 'zh-CN';

  return (
    <Box
      component='main'
      sx={{
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 8 },
        minHeight: { xs: 'calc(100vh - 160px)', md: 'calc(100vh - 120px)' },
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(600px 420px at 12% 20%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(520px 380px at 88% 80%, rgba(34,197,94,0.16), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 5, md: 8 }}
        alignItems='center'
        justifyContent='space-between'
        sx={{ position: 'relative', width: '100%' }}
      >
        <Box sx={{ maxWidth: 560 }}>
          <Typography
            variant='overline'
            sx={{
              letterSpacing: 3,
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            ROBOTX CRM
          </Typography>
          <Typography
            variant='h2'
            sx={{
              mt: 1.5,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {isZh ? '欢迎来到你的指挥中心' : 'Welcome to your command center'}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              mt: 2,
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.05rem' },
            }}
          >
            {isZh
              ? '在同一处集中管理客户、交易和团队进度，让关键信号一目了然。'
              : 'Monitor customers, deals, and team momentum in one place. This workspace keeps every signal visible, actionable, and fast.'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button
              component={Link}
              href={`/${lang}/dashboards/crm`}
              variant='contained'
              size='large'
            >
              {isZh ? '进入CRM看板' : 'Open CRM Dashboard'}
            </Button>
            <Button
              component={Link}
              href={`/${lang}/modules`}
              variant='outlined'
              size='large'
            >
              {isZh ? '浏览功能模块' : 'Explore Modules'}
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: 560 },
            maxWidth: 620,
            flexShrink: 0,
          }}
        >
          <Image
            src='/assets/robotx-welcome.svg'
            alt='Robotx CRM welcome graphic'
            width={1200}
            height={900}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
