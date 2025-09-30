import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { setFieldName } from '@/app/lib/store/profileSlice';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { IconCamera } from '@/utils/icons/profileLink';
import InputRow from '@/app/components/common/InputRow';
import { profileAPI } from '@/app/(DashboardLayout)/profile-link/api/profile';
import SwitchInput from '@/app/components/common/SwitchInput';
import { FacebookOutLine, Instagram, Spotify, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import CropDialog from '@/app/components/common/CropDialog';

const TabsUserInfo = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = React.useState(false);
  const [nickNameValid, setNickNameValid] = React.useState<boolean | null>(null);
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [cropType, setCropType] = React.useState<'avatar' | 'background' | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCropImageSrc(e.target.result as string);
        setCropType('avatar');
      }
    };
    reader.readAsDataURL(file);
  };
  const handleBackGroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCropImageSrc(e.target.result as string);
        setCropType('background');
      }
    };
    reader.readAsDataURL(file);
  };
  const handleCheckNickName = async () => {
    if (!profile.username) return;

    setChecking(true);
    const isValid = await profileAPI.checkNickName(profile.username);
    if (isValid) {
      dispatch(setFieldName({ field: 'is_check_name', value: true }));
    }
    setNickNameValid(isValid);

    setChecking(false);
  };
  return (
    <Box sx={{ pb: { xs: 12, md: 5 } }}>
      {cropImageSrc && cropType && (
        <CropDialog
          open={!!cropImageSrc}
          imageSrc={cropImageSrc}
          type={cropType}
          aspect={cropType === 'avatar' ? 1 : 22 / 9}
          onClose={() => {
            setCropImageSrc(null);
            setCropType(null);
          }}
          onCropDone={({ base64, file }) => {
            dispatch(
              setFieldName({
                field: cropType === 'avatar' ? 'avatar' : 'background_image',
                value: base64,
              }),
            );
            dispatch(
              setFieldName({
                field: cropType === 'avatar' ? 'avatar_file' : 'background_file',
                value: file,
              }),
            );
          }}
        />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '35px' }}>
        <Box
          sx={{
            position: 'relative',
            mb: 6,
            backgroundColor: '#F8F8F8',
            backgroundImage: `url(${profile.background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '148px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: -18,
              width: 'fit-content',
              left: 0,
              right: 0,
              margin: '0 auto',
            }}
          >
            {profile.avatar ? (
              <Avatar
                src={profile.avatar || '/images/'}
                alt={profile.display_name}
                sx={{
                  width: 96,
                  height: 96,
                  border: '1px solid #eaeaea',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <></>
            )}
            <IconButton
              sx={{
                position: 'absolute',
                bottom: -2,
                right: 0,
                backgroundColor: 'white',
                color: '#686868',
                boxShadow: '0px 2px 10px 0px #00000033',
                width: '36px',
                height: '36px',
                '&:hover': {
                  backgroundColor: '#D9D9D9',
                },
              }}
              onClick={() => avatarInputRef.current?.click()}
            >
              <IconCamera />
            </IconButton>
            <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={handleAvatarChange} />
          </Box>
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              bottom: 14,
              right: 14,
              backgroundColor: 'white',
              color: '#6A6A6A',
              boxShadow: 'none',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
            }}
            onClick={() => backgroundInputRef.current?.click()}
            startIcon={<IconCamera className="w-[18px] h-[18px]" />}
          >
            배너 추가
          </Button>
          <input type="file" hidden ref={backgroundInputRef} accept="image/*" onChange={handleBackGroundChange} />
        </Box>
        <Typography component="div" color="#6A6A6A" sx={{ fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>
          이미지 최소 600x600픽셀 이상이어야 하며, <br />
          JPG 또는 PNG 형식이어야 합니다.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: { xs: 2.25, sm: 5 } }}>
        <InputRow
          label="프로필 이름"
          placeholder="프로필 이름을 입력해주세요. 예시)톡탁"
          value={profile.display_name}
          onChange={(e) =>
            dispatch(
              setFieldName({
                field: 'display_name',
                value: e.target.value as string,
              }),
            )
          }
          maxLength={40}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <InputRow
            label="@ 유저 아이디"
            value={profile.username}
            onChange={(e) => {
              dispatch(setFieldName({ field: 'is_check_name', value: false }));
              dispatch(setFieldName({ field: 'username', value: e.target.value as string }));
              setNickNameValid(null); // reset check khi user đổi input
            }}
            status={nickNameValid == null ? 'default' : nickNameValid ? 'success' : 'error'}
            rules={[
              {
                required: true,
                message: '사용자 이름을 입력해주세요.', // Vui lòng nhập tên người dùng
              },
              {
                max: 40,
                message: '40자 이하로 입력해주세요.', // Vui lòng nhập không quá 40 ký tự
              },
              {
                pattern: /^[a-zA-Z0-9._-]{1,40}$/,
                message: '영문, 숫자, 밑줄(_), 하이픈(-), 마침표(.)만 사용할 수 있어요.', // Chỉ cho phép ký tự a-z, 0-9, _, -, .
              },
            ]}
            maxLength={40}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckNickName}
            disabled={checking || !profile.username}
            sx={{
              minWidth: '88px',
              borderRadius: '10px',
              height: '46px',
              bgcolor: '#E7E7E7',
              boxShadow: 'none',
              color: '#6A6A6A',
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
            }}
          >
            중복확인
          </Button>
        </Box>

        <TextField
          fullWidth
          label="설명"
          variant="outlined"
          multiline
          rows={4}
          value={profile.description}
          onChange={(e) =>
            dispatch(
              setFieldName({
                field: 'description',
                value: e.target.value as string,
              }),
            )
          }
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: { xs: 2.25, sm: 5 }, mt: 3.75 }}>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
        >
          Social Link
        </Typography>
        <SwitchInput
          icon={<Spotify className="text-[#272727] w-8 h-8 p-1" />}
          inputValue={profile.socials?.spotify?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.spotify.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.spotify?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.spotify.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
        <SwitchInput
          icon={<Threads className="text-[#272727] w-8 h-8" />}
          inputValue={profile.socials?.threads?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.threads.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.threads?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.threads.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
        <SwitchInput
          icon={<Youtube className="text-[#272727] w-8 h-8" />}
          inputValue={profile.socials?.youtube?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.youtube.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.youtube?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.youtube.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
        <SwitchInput
          icon={<Twitter className="text-[#272727] w-8 h-8" />}
          inputValue={profile.socials?.x?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.x.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.x?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.x.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
        <SwitchInput
          icon={<Instagram className="text-[#272727] w-8 h-8" />}
          inputValue={profile.socials?.instagram?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.instagram.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.instagram?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.instagram.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
        <SwitchInput
          icon={<TikTok className="text-[#272727] w-8 h-8" />}
          inputValue={profile.socials?.tiktok?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.tiktok.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.tiktok?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.tiktok.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
        <SwitchInput
          icon={<FacebookOutLine className="text-[#272727] w-8 h-8 p-1" />}
          inputValue={profile.socials?.facebook?.url}
          onInputChange={(e) => {
            dispatch(
              setFieldName({
                field: 'socials.facebook.url',
                value: e.target.value as string,
              }),
            );
          }}
          switchValue={!!profile.socials?.facebook?.enabled}
          onSwitchChange={(value) => {
            dispatch(
              setFieldName({
                field: 'socials.facebook.enabled',
                value: value ? 1 : 0,
              }),
            );
          }}
        />
      </Box>
    </Box>
  );
};
export default TabsUserInfo;
