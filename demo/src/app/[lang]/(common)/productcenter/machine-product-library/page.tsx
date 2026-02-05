import { Box, Typography } from '@mui/material';

export default function MachineProductLibraryPage({
  params,
}: {
  params: { lang: string };
}) {
  const isZh = params.lang === 'zh-CN';

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
        {isZh ? '机器产品库' : 'Machine Product Library'}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        {isZh
          ? '在这里浏览和管理所有机器产品型号与规格。'
          : 'Browse and manage all machine product models and specifications.'}
      </Typography>
    </Box>
  );
}
