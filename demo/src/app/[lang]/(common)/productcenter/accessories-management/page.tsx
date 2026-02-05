import { Box, Typography } from '@mui/material';

export default function AccessoriesManagementPage({
  params,
}: {
  params: { lang: string };
}) {
  const isZh = params.lang === 'zh-CN';

  return (
    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
        {isZh ? '配件管理' : 'Accessories Management'}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        {isZh
          ? '管理配件清单、库存与关联机型。'
          : 'Manage accessories catalog, inventory, and related machine models.'}
      </Typography>
    </Box>
  );
}
