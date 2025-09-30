'use client';
import PageSelectDialog from '@/app/(DashboardLayout)/profile/component/PageSelectDialog';
import { PlatformLink } from '@/app/(DashboardLayout)/profile/page';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { User, login } from '@/app/lib/store/authSlice';
import { PlatformState, setPlatformState } from '@/app/lib/store/platformSlice';
import { setSnsSettingsState } from '@/app/lib/store/snsSettingsSlice';
import { AppDispatch, RootState } from '@/app/lib/store/store';
import { PLATFORM, PLATFORM_TEXT } from '@/utils/constant';
import { showCouponPopup } from '@/utils/custom/couponPopup';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { IconCheck } from '@/utils/icons/icons';
import { Blog, Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { Icon } from '@iconify/react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import API from '@service/api';
import { BASE_URL } from '@service/config';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from '../component/userAvatar';
declare global {
  interface Window {
    ReactNativeWebView: {
      isAvailable: () => boolean;
    };
  }
}
interface ResponseLinked {
  created_at: string;
  id: number;
  link_id: PLATFORM;
  status: number;
  updated_at: string;
  user_id: number;
  avatar: string;
  social_id: number;
  name: string;
  url: string;
}

const INSTAGRAM_CLIENT_ID = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
const THREADS_CLIENT_ID = process.env.NEXT_PUBLIC_THREADS_CLIENT_ID;
const BLOG_CLIENT_ID = process.env.NEXT_PUBLIC_BLOG_CLIENT_ID;
// const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://voda-play.com';
const YOUTUBE_CLIENT_ID = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
const YOUTUBE_SCOPES =
  'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly';
const SocialConnect = ({ profile, getUserInfo }: { profile: User; getUserInfo: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [twitterID, setTwitterID] = useState<string>();
  const platform = useSelector((state: RootState) => state.platform);
  // const profile = useSelector((state: RootState) => state.auth);
  const REDIRECT_URI = `${window.location.origin}/auth/platform`;
  const [openPageSelect, setOpenPageSelect] = useState(false);
  const router = useRouter();
  const getTwitterID = useRef(
    new API('/api/v1/setting/get_config_x', 'GET', {
      success: (res) => {
        setTwitterID(res.data.TWITTER_CLIENT_ID);
      },
      error: (res) => {
        console.log(res);
      },
    }),
  );

  const [avatarList, setAvatarList] = useState([]);

  useEffect(() => {
    if (profile?.level_info) {
      const levelInfo = JSON.parse(profile?.level_info);
      setAvatarList(levelInfo);
      dispatch(login({ user: profile }));
    }
  }, [profile]);

  // const getUserInfo = useRef(
  //   new API('/api/v1/auth/user_profile', 'GET', {
  //     success: (res) => {
  //       // setProfile(res.data);
  //       const levelInfo = JSON.parse(res.data.level_info);
  //       // const levelInfo = JSON.parse(
  //       //   '[{"url": "https://admin.lang.canvasee.com/img/level/level_1.png", "active": ""}, {"url": "https://admin.lang.canvasee.com/img/level/level_2.png", "active": ""}, {"url": "https://admin.lang.canvasee.com/img/level/level_2_next.png", "active": "active"}]',
  //       // );
  //       setAvatarList(levelInfo);
  //     },
  //     error: (res) => {
  //       console.log(res);
  //     },
  //   }),
  // );
  // fetch SNS settings once
  const getSNSSettingsAPI = useRef(
    new API(`/api/v1/user/get-user-link-template`, 'GET', {
      success: (res) => {
        if (res.code === 200) {
          dispatch(setSnsSettingsState({ snsSettings: res.data }));
        }
      },
      error: () => {},
      finally: () => {},
    }),
  );
  const disconnectAPI = useRef(
    new API('/api/v1/user/delete-link-sns', 'POST', {
      success: (res, dataSource) => {
        dispatch(
          setPlatformState({
            platform: (PLATFORM_TEXT as any)[dataSource?.linkId] as keyof PlatformState,
            status: false,
            token: '',
            info: undefined,
          }),
        );
        getUserInfo();
      },
      error: (res) => {
        console.log(res);
      },
    }),
  );

  useEffect(() => {
    getTwitterID.current.call();
    // getUserInfo.current.call();
  }, []);

  const saveBlogURLAPI = useRef(
    new API(`/api/v1/user/new-link`, 'POST', {
      success: (res, dataSource) => {
        if (res?.code === 201) {
          showCouponPopup(
            '유효하지 않은 주소입니다.<br/>블로그 주소/아이디를 확인해 주세요😭',
            '',
            false,
            '확인',
            '',
            () => {},
            'fail_coupon',
          );
          return;
        }
        showCouponPopup('블로그가 정상적으로 연결되었습니다.', '', false, '확인', '', () => {}, 'connect_success');
        const data = platform.blog;
        dispatch(
          setPlatformState({
            platform: 'blog',
            status: true,
            token: '',
            info: {
              social_id: data?.social_id,
              url: data?.url,
              name: data?.name,
              avatar: data?.avatar,
              id: data?.id,
              meta_url: dataSource?.url,
            },
          }),
        );
        getUserInfo();
      },
      error: (err) => {
        showCouponPopup(
          '유효하지 않은 주소입니다.<br/>블로그 주소/아이디를 확인해 주세요😭',
          '',
          false,
          '확인',
          '',
          () => {},
          'fail_coupon',
        );
      },
      finally: () => {},
    }),
  );

  const saveBlogURL = (url: string) => {
    if (
      !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
        url,
      )
    ) {
      showCouponPopup(
        '⚠️ 잘못된 URL이에요!',
        '블로그 주소는 URL 형식으로 입력해 주세요! 😊',
        false,
        '확인',
        '',
        () => {},
        'fail_coupon',
      );
      return;
    }
    saveBlogURLAPI.current.config.data = {
      Link: url,
      link_id: PLATFORM.Blog,
    };
    saveBlogURLAPI.current.call({ url });
  };

  const platforms = useMemo<PlatformLink[]>(
    () => [
      {
        id: 'youtube',
        name: '유튜브',
        icon: <Youtube className=" w-[45px] h-[45px]" />,
        url: platform.youtube.url || 'https://www.youtube.com',
        isConnected: platform.youtube.status,
        handlerConnect: () => {
          showNoticeMUI(
            '유튜브 연동 안내',
            '알림창이 뜨면 **[고급]**을 클릭 후 </br> [toktak.ai(으)로 이동 (안전하지 않음)] 버튼을 눌러주세요.',
            true,
            '확인',
            '취소',
            () => {
              const authURL = `${BASE_URL}/api/v1/user/oauth/youtube-login?user_id=${profile?.id}&link_id=${PLATFORM.Youtube}`;
              !!window.ReactNativeWebView ? (window.location.href = authURL) : window.open(authURL, '_system');
            },
          );
        },
        loginHref: 'https://accounts.google.com/',
        link_id: PLATFORM.Youtube,
      },
      {
        id: 'instagram',
        name: '인스타그램',
        icon: <Instagram className=" w-[45px] h-[45px]" />,
        url: platform.instagram.url || 'https://www.instagram.com',
        isConnected: platform.instagram.status,
        handlerConnect: () => {
          showNoticeMUI(
            '인스타그램 개인 계정은 연동되지 않습니다.',
            '[프로페셔널 계정(비즈니스/크리에이터)]으로 전환 후 연동해주세요. </br> 자세한 방법은 서비스가이드북을 참고 해주세요.',
            true,
            '확인',
            '취소',
            () => {
              const authURL = `https://www.instagram.com/oauth/authorize?enable_fb_login=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_content_publish&state=${!!window.ReactNativeWebView ? 'instagram_app' : 'instagram'}`;
              !!window.ReactNativeWebView ? (window.location.href = authURL) : window.open(authURL, '_system');
            },
          );
        },
        loginHref: 'https://www.instagram.com/accounts/emailsignup/',
        link_id: PLATFORM.Instagram,
      },
      {
        id: 'facebook',
        name: '페이스북',
        icon: <Facebook className=" w-[45px] h-[45px]" />,
        url: platform.facebook.url || 'https://www.facebook.com',
        isConnected: platform.facebook.status,
        handlerConnect: () => {
          if (!window.FB) return;
          showNoticeMUI(
            '페이스북 페이지가 있어야 연동 가능합니다.',
            '아직 없다면 먼저 페이스북 페이지를 생성해 주세요! </br> 자세한 방법은 서비스가이드북을 참고 해주세요.',
            true,
            '확인',
            '취소',
            () => {
              window.FB.login(
                (response) => {
                  if (response.authResponse) {
                    const saveLinked = new API('/api/v1/user/new-link', 'POST', {
                      success(res) {
                        if (res.code == 200) {
                          const data = res?.data;
                          dispatch(
                            setPlatformState({
                              platform: 'facebook',
                              status: true,
                              token: '',
                              info: {
                                social_id: data?.social_id,
                                url: data?.url,
                                name: data?.name,
                                avatar: data?.avatar,
                                id: data?.id,
                                page_id: data?.page_id,
                              },
                            }),
                          );
                          getSNSSettingsAPI.current.call();
                          setOpenPageSelect(true);
                        } else {
                          showNoticeError(res?.message || '', res?.data?.error_message || '', false, '확인');
                        }
                      },
                      error: (err) => {
                        showNoticeError(err?.message || '', err?.data?.error_message || '', false, '확인');
                      },
                    });
                    saveLinked.config.data = { link_id: 1, AccessToken: response.authResponse.accessToken };
                    saveLinked.call();
                  } else {
                  }
                },
                {
                  scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,publish_video,email',
                  // scope: 'email,public_profile',
                  response_type: 'code',
                },
              );
            },
          );
        },
        loginHref: 'https://ko-kr.facebook.com/reg/',
        link_id: PLATFORM.Facebook,
      },
      {
        id: 'tiktok',
        name: '틱톡',
        icon: <TikTok className=" w-[45px] h-[45px]" />,
        url: platform.tiktok.url || 'https://www.tiktok.com',
        isConnected: platform.tiktok.status,
        handlerConnect: () => {
          const authURL = `https://apitoktak.voda-play.com/api/v1/user/oauth/tiktok-login?user_id=${profile?.id}&link_id=${PLATFORM.Tiktok}&redirect_uri=${window.location.origin}/profile`;
          alert(JSON.stringify(window.ReactNativeWebView));
          !!window.ReactNativeWebView ? (window.location.href = authURL) : window.open(authURL, '_system');
        },
        loginHref: 'https://www.tiktok.com/signup',
        link_id: PLATFORM.Tiktok,
      },
      {
        id: 'blog',
        name: '네이버블로그',
        icon: <Blog className=" w-[45px] h-[45px]" />,
        url: platform.blog.meta_url || 'https://blog.naver.com',
        isConnected: platform.blog.status,
        handlerConnect: () => {
          showCouponPopup('블로그 주소를 입력해 주세요.', 'text', true, '등록하기', '취소', saveBlogURL, 'ring');
        },
        loginHref: 'https://help.naver.com/service/5593/contents/15183?lang=ko',
        link_id: PLATFORM.Blog,
      },
      {
        id: 'twitter',
        name: '트위터',
        icon: <Twitter className=" w-[45px] h-[45px]" />,
        url: platform.twitter.url || 'https://twitter.com',
        isConnected: platform.twitter.status,
        handlerConnect: async () => {
          const authURL = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${twitterID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=media.write%20tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20offline.access&state=${!!window.ReactNativeWebView ? 'X_app' : 'X'}&code_challenge=challenge&code_challenge_method=plain`;
          !!window.ReactNativeWebView ? (window.location.href = authURL) : window.open(authURL, '_system');
        },
        loginHref: 'https://x.com/i/flow/signup',
        link_id: PLATFORM.Twitter,
      },
      {
        id: 'threads',
        name: '스레드',
        icon: <Threads className=" w-[45px] h-[45px]" />,
        url: platform.threads.url || 'https://www.threads.net',
        isConnected: platform.threads.status,
        handlerConnect: async () => {
          const authURL = `https://threads.net/oauth/authorize?client_id=${THREADS_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=threads_basic,threads_content_publish&response_type=code&state=${!!window.ReactNativeWebView ? 'threads_app' : 'threads'}`;
          !!window.ReactNativeWebView ? (window.location.href = authURL) : window.open(authURL, '_system');
        },
        handleLogin: () => {
          showNotice('인스타그램  계정으로 로그인 할 수 있어요 😊', '', false, '확인');
        },
        link_id: PLATFORM.Thread,
      },
    ],
    [platform, twitterID, profile.id],
  );
  const apiCheckConnect = useRef(
    new API('/api/v1/user/check_active_link_sns', 'GET', {
      success: (res, dataSource) => {
        if (res.code == 200) {
          dataSource.callback();
        } else if (res.code == 201) {
          showNotice(
            `🔌 무료 요금제에서는 SNS 연동이 안 돼요!`,
            `첫 달 0원 혜택 받고 요금제 업그레이드하면 SNS 연동이 가능해요.`,
            true,
            '확인',
            '취소',
            () => {
              router.push('/rate-plan');
            },
          );
        } else {
          showNoticeError(res?.message || '', res?.data?.error_message || '', false, '확인');
        }
      },
      error: (err) => {},
    }),
  );
  const handleConnectButton = async (callback: () => void) => {
    await apiCheckConnect.current.call({ callback });
  };
  const handleDisconnect = (index: number) => {
    showNotice(
      `${(platforms[index] as any).name} 연결을 해제하시겠어요?`,
      `🚨 연결을 해제하면 ${(platforms[index] as any).name}에 자동 업로드를 할 수 없어요.<br/>설정에서 언제든 다시 연결할 수 있어요.😊`,
      true,
      '확인',
      '취소',
      () => {
        disconnectAPI.current.config.data = {
          link_id: platforms[index].link_id,
        };
        disconnectAPI.current.call({ index, linkId: platforms[index].link_id, id: (platforms[index] as any).id });
      },
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 3, sm: 6 },
        py: { xs: 3, sm: 6 },
        px: { xs: 2.5, md: 0 },
        fontFamily: 'var(--font-pretendard)',
      }}
    >
      <PageSelectDialog open={openPageSelect} onClose={() => setOpenPageSelect(false)} />
      <UserAvatar avatarList={avatarList} />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          mb: 6,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, md: 4 },
          }}
        >
          {platforms.map((platform, index) => (
            <Card
              key={platform.name}
              className="w-full rounded-[14px]"
              sx={{
                boxShadow: '0px 4.14px 31.06px 0px #0000000D',
              }}
            >
              <CardContent
                sx={{
                  py: 2,
                  px: { xs: 3, sm: 4, md: '30px' },
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1, sm: 0 } }}>
                    <Box>{platform.icon}</Box>
                    <Typography fontWeight="bold" fontSize={16}>
                      {platform.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {platform.isConnected && platform.link_id === PLATFORM.Facebook && (
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setOpenPageSelect(true)}
                      >
                        <Icon icon="icon-park-outline:setting-two" width={20} height={20} />
                        <Typography fontSize={12} fontWeight={600} color="#6A6A6A">
                          페이지 설정
                        </Typography>
                      </Box>
                    )}
                    {platform.isConnected && (
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => handleDisconnect(index)}
                      >
                        <Icon icon="garden:link-remove-fill-12" width={14} height={14} />
                        <Typography fontSize={12} fontWeight={600} color="#6A6A6A">
                          연결해제
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* URL */}
                <Typography
                  sx={{
                    mt: 2,
                    mb: 1.5,
                    fontSize: { xs: 14, sm: 16 },
                    color: '#A4A4A4',
                    fontWeight: 500,
                    wordBreak: 'break-all',
                  }}
                >
                  URL{' '}
                  <a href={platform.url} target="_blank" className="ml-2 font-normal">
                    {platform.url}
                  </a>
                </Typography>

                {/* Buttons */}
                {platform.isConnected ? (
                  <Button
                    variant="text"
                    fullWidth
                    sx={{
                      height: 40,
                      backgroundColor: '#F8F8F8',
                      color: '#4776EF',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      py: 3,
                      mt: 2,
                    }}
                    startIcon={<IconCheck />}
                  >
                    연결 완료
                  </Button>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        flex: 1,
                        height: 40,
                        backgroundColor: '#4776EF',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        py: 1,
                      }}
                      onClick={() => !!platform?.handlerConnect && handleConnectButton(platform?.handlerConnect)}
                    >
                      {platform.id === 'blog' ? '블로그 연결' : '계정 연결'}
                    </Button>
                    {platform?.loginHref ? (
                      <a
                        href={platform?.loginHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          height: 40,
                          border: '2px solid #4776EF',
                          color: '#4776EF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 8,
                          fontWeight: 'bold',
                          fontSize: 14,
                          textDecoration: 'none',
                          padding: '8px',
                        }}
                      >
                        회원가입
                      </a>
                    ) : (
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          flex: 1,
                          height: 40,
                          border: '2px solid #4776EF',
                          color: '#4776EF',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          py: 1,
                        }}
                        onClick={platform.handleLogin}
                      >
                        회원가입
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default SocialConnect;
