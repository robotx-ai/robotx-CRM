import Image from 'next/image';
import { Box, Stack, Typography } from '@mui/material';
import { Params } from '@/types/paramsType';

export default async function Home(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const isZh = lang === 'zh-CN';

  return (
    <Box
      component='main'
      sx={{
        px: { xs: 2.5, md: 4 },
        py: { xs: 4, md: 5 },
        minHeight: { xs: 'calc(100vh - 150px)', md: 'calc(100vh - 110px)' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        spacing={3}
        alignItems='center'
        justifyContent='center'
        sx={{ width: '100%', maxWidth: 760 }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: 520 },
            maxWidth: '100%',
          }}
        >
          <Image
            src='/assets/images/pages/welcome_landscape.png'
            alt='Robotx CRM welcome illustration'
            width={1536}
            height={1024}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>

        <Typography
          variant='h3'
          sx={{ fontWeight: 700, textAlign: 'center', color: 'text.primary' }}
        >
          {isZh ? '欢迎' : 'Welcome'}
        </Typography>
      </Stack>
    </Box>
  );
}
