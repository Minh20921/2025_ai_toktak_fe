import { Box, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { setFieldName } from '@/app/lib/store/profileSlice';
import { layoutOptions } from '@/app/(DashboardLayout)/profile-link/components/const';

export default function LayoutSelector() {
  const dispatch = useDispatch();
  const layoutType = useSelector((state: RootState) => state.profile.site_setting.layout_type);

  return (
    <Stack direction="row" spacing={2}>
      {layoutOptions.map((option) => (
        <Box
          key={option.type}
          onClick={() => dispatch(setFieldName({ field: 'site_setting.layout_type', value: option.type }))}
          sx={{
            border: layoutType === option.type ? '2px solid #4776EF' : '2px solid transparent',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: '#F8F8F8',
            backgroundImage:
              layoutType === option.type
                ? `
      radial-gradient(104.35% 104.35% at 72.69% -9.24%, #DDF7FF 0%, #F8F8F8 52.6%),
      radial-gradient(91.67% 91.67% at 34.17% 0%, rgba(152, 167, 255, 0.2) 6.84%, rgba(248, 248, 248, 0.2) 55.46%)
    `
                : 'none',
            backgroundBlendMode: 'normal',
          }}
        >
          <img src={option.icon} alt={option.type} width={116} height={116} />
        </Box>
      ))}
    </Stack>
  );
}
