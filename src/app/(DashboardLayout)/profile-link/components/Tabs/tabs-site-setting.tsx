'use client';

import { Box, InputBase, TextField, Typography } from '@mui/material';
import ColorPicker from '@/app/components/common/ColorPicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { setFieldName } from '@/app/lib/store/profileSlice';
import InputRow from '@/app/components/common/InputRow';

export default function SiteSettings() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  return (
    <Box sx={{ px: { xs: 2.25, md: 5 }, pb: { xs: 12, md: 5 } }}>
      <Typography component="h1" sx={{ mt: 5, mb: 1.5, fontWeight: 'bold', color: '#6A6A6A' }}>
        프로필 레이아웃
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <ColorPicker
          label="배경 색상"
          initialColor={profile.site_setting.background_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.background_color', value: color }))}
        />

        <ColorPicker
          label="메인 텍스트 색상"
          initialColor={profile.site_setting.main_text_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.main_text_color', value: color }))}
        />

        <ColorPicker
          label="서브 텍스트 색상"
          initialColor={profile.site_setting.sub_text_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.sub_text_color', value: color }))}
        />
      </Box>

      <Typography component="h1" sx={{ mt: 5, mb: 1.5, fontWeight: 'bold', color: '#6A6A6A' }}>
        한줄 공지
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <InputRow
          label="한줄 공지"
          value={profile.notice}
          onChange={(e) => dispatch(setFieldName({ field: 'notice', value: e.target.value }))}
        />

        <ColorPicker
          label="텍스트 색상"
          initialColor={profile.site_setting.notice_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.notice_color', value: color }))}
        />

        <ColorPicker
          label="배경 색상"
          initialColor={profile.site_setting.notice_background_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.notice_background_color', value: color }))}
        />
      </Box>

      <Typography component="h1" sx={{ mt: 5, mb: 1.5, fontWeight: 'bold', color: '#6A6A6A' }}>
        상품 블럭
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <ColorPicker
          label="배경 색상"
          initialColor={profile.site_setting.product_background_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.product_background_color', value: color }))}
        />

        <ColorPicker
          label="상품명 텍스트 색상"
          initialColor={profile.site_setting.product_name_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.product_name_color', value: color }))}
        />

        <ColorPicker
          label="가격 색상"
          initialColor={profile.site_setting.product_price_color}
          onChange={(color) => dispatch(setFieldName({ field: 'site_setting.product_price_color', value: color }))}
        />
      </Box>
    </Box>
  );
}
