export enum PLATFORM {
  Facebook = 1,
  Instagram = 2,
  Twitter = 3,
  Tiktok = 4,
  Youtube = 5,
  Thread = 6,
  Blog = 7,
}
export const PLATFORM_TEXT = {
  [PLATFORM.Facebook]: 'facebook',
  [PLATFORM.Instagram]: 'instagram',
  [PLATFORM.Twitter]: 'twitter',
  [PLATFORM.Youtube]: 'youtube',
  [PLATFORM.Tiktok]: 'tiktok',
  [PLATFORM.Thread]: 'threads',
  [PLATFORM.Blog]: 'blog',
};
export const voiceOptionsMale = [
  {
    label_orgin: 'Standard-C',
    label: '금융 크리에이터',
    value: '1',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Standard-C.wav',
  },
  {
    label_orgin: 'Standard-D',
    label: '라디오 DJ',
    value: '2',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Standard-D.wav',
  },
  {
    label_orgin: 'Neural2-C',
    label: '비즈니스 발표자',
    value: '15',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Neural2-C.wav',
  },
  {
    label_orgin: 'Wavenet-C',
    label: '전문 강사',
    value: '18',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Wavenet-C.wav',
  },
  {
    label_orgin: 'Wavenet-D',
    label: '경제 크리에이터',
    value: '19',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Wavenet-D.wav',
  },
];

export const voiceOptionsFMale = [
  {
    label_orgin: 'Standard-A',
    label: '친절한 상담원',
    value: '3',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Standard-A.wav',
  },
  {
    label_orgin: 'Standard-B',
    label: '다큐 내레이션 성우',
    value: '4',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Standard-B.wav',
  },
  {
    label_orgin: 'Neural2-A',
    label: 'AI 비서',
    value: '13',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Neural2-A.wav',
  },
  {
    label_orgin: 'Neural2-B',
    label: '광고 내레이션 성우',
    value: '14',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Neural2-B.wav',
  },
  {
    label_orgin: 'Wavenet-A',
    label: '유치원 선생님',
    value: '16',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Wavenet-A.wav',
  },
  {
    label_orgin: 'Wavenet-B',
    label: '뉴스 앵커',
    value: '17',
    audio_url: 'http://apitoktak.voda-play.com/voice/audio/music/ko-KR-Wavenet-B.wav',
  },
];

export enum SEX {
  Male,
  FMale,
}

export enum SEX_STRING {
  Male = 'male',
  FMale = 'female',
}

export enum SOUND_TYPE {
  Google = 'google',
  Typecast = 'typecast',
}

export const IS_NEW_USER_REFERRAL = 'new_user_referral_code';
export const TOKEN_LOGIN = 'token_login';
export const REFRESH_TOKEN = 'refresh_token';
export const REFERRAL_CODE = 'toktak_referral_code';
export const TIME_REFERRAL_CODE_PERIOD = 'referral_code_period';
export const USED_DOMAINS = [
  'domeggook.com',
  'coupang.com',
  'aliexpress.com',
  'amazon.com',
  'amzn.com',
  'ebay.com',
  'walmart.com',
  'amzn.to',
  'naver.com',
];

export const SEO_DATA = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'Toktak.ai - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_HOME = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'Toktak.ai - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_ANALYS = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'Toktak.ai - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_HISTORY = {
  title: '톡탁(TokTak) - 내콘텐츠',
  description: ' 만들고 업로드한 콘텐츠 관리',
  ogTitle: '톡탁(TokTak) - 내콘텐츠',
  ogDescription: '만들고 업로드한 콘텐츠 관리',
  twitterDescription: '만들고 업로드한 콘텐츠 관리',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/history',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_PROFILE_LINK = {
  title: '톡탁(TokTak) - 멀티링크',
  description: '콘텐츠만 톡 올리면 나머지는 멀티링크가 알아서 관리합니다.',
  ogTitle: '톡탁(TokTak) - 멀티링크',
  ogDescription: '콘텐츠만 톡 올리면 나머지는 멀티링크가 알아서 관리합니다.',
  twitterDescription: '콘텐츠만 톡 올리면 나머지는 멀티링크가 알아서 관리합니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/profile-link',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_RATE_PLAN = {
  title: '톡탁(TokTak) - 요금제',
  description: 'SNS 수익 자동화 플랜',
  ogTitle: '톡탁(TokTak) - 요금제',
  ogDescription: 'SNS 수익 자동화 플랜',
  twitterDescription: 'SNS 수익 자동화 플랜',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/rate-plan',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_PAYMENT = {
  title: '톡탁(TokTak) - 요금제',
  description: 'SNS 수익 자동화 플랜',
  ogTitle: '톡탁(TokTak) - 요금제',
  ogDescription: 'SNS 수익 자동화 플랜',
  twitterDescription: 'SNS 수익 자동화 플랜',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/rate-plan',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_NOTIFICATION = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: '톡탁(TokTak) - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/notification',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_PROFILE = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'T톡탁(TokTak) - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/profile',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_UPLOAD = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'Toktak.ai - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_LEGAL = {
  title: '톡탁(TokTak) - AI 기반 SNS 자동화 서비스 플랫폼',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'Toktak.ai - AI 수익 자동화 프로그램',
  ogDescription:
    '상품 URL만 입력하면 블로그 글, 이미지, 영상 콘텐츠를 자동으로 생성하고, 인스타그램, 유튜브, 블로그 등 채널별 형식에 맞춰 자동 게시까지 지원합니다.',
  twitterDescription:
    '쿠팡 파트너스, 알리익스프레스 어필리에이트, 도매꾹 파트너 등 제휴 링크를 연결해 자동 수익화도 가능하여 누구나 손쉽게 SNS 마케팅을 시작할 수 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_TERM = {
  title: '톡탁(TokTak) - 이용 약관',
  description: '이 약관은 톡탁 서비스의 이용과 관련하여 톡탁 서비스를 제공하는 보다플레이(주)',
  ogTitle: 'Toktak.ai - 이용 약관',
  ogDescription: '이 약관은 톡탁 서비스의 이용과 관련하여 톡탁 서비스를 제공하는 보다플레이(주)',
  twitterDescription: '이 약관은 톡탁 서비스의 이용과 관련하여 톡탁 서비스를 제공하는 보다플레이(주)',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/terms',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_POLICY = {
  title: '톡탁(TokTak) - 개인정보 처리방침',
  description:
    '보다플레이(주)(이하 "회사")은 이용자의 개인 정보를 매우 중요하게 생각하며 정보 통신서비스 제공자가 준수하여야 하는 관련 법령 및 규정을 준수하고 있습니다.',
  ogTitle: 'Toktak.ai - 개인정보 처리방침',
  ogDescription:
    '보다플레이(주)(이하 "회사")은 이용자의 개인 정보를 매우 중요하게 생각하며 정보 통신서비스 제공자가 준수하여야 하는 관련 법령 및 규정을 준수하고 있습니다.',
  twitterDescription:
    '보다플레이(주)(이하 "회사")은 이용자의 개인 정보를 매우 중요하게 생각하며 정보 통신서비스 제공자가 준수하여야 하는 관련 법령 및 규정을 준수하고 있습니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/policy',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_COPYRIGHT = {
  title: '톡탁(TokTak) - 저작권 정책',
  description:
    '이 약관은 보다플레이(주)(이하 회사라 한다.)가 운영하는 톡탁 웹사이트와 애플리케이션에서 제공하는 템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 톡탁을 사용하는 사용자는 아래의 항목에 동의한 것으로 간주합니다.',
  ogTitle: 'Toktak.ai - 저작권 정책',
  ogDescription:
    '이 약관은 보다플레이(주)(이하 회사라 한다.)가 운영하는 톡탁 웹사이트와 애플리케이션에서 제공하는 템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 톡탁을 사용하는 사용자는 아래의 항목에 동의한 것으로 간주합니다.',
  twitterDescription:
    '이 약관은 보다플레이(주)(이하 회사라 한다.)가 운영하는 톡탁 웹사이트와 애플리케이션에서 제공하는 템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 톡탁을 사용하는 사용자는 아래의 항목에 동의한 것으로 간주합니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/copyright',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_AI_POLICY = {
  title: '톡탁(TokTak) - 저작권 정책',
  description:
    '이 약관은 보다플레이(주)(이하 회사라 한다.)가 운영하는 톡탁 웹사이트와 애플리케이션에서 제공하는 템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 톡탁을 사용하는 사용자는 아래의 항목에 동의한 것으로 간주합니다.',
  ogTitle: 'Toktak.ai - 저작권 정책',
  ogDescription:
    '이 약관은 보다플레이(주)(이하 회사라 한다.)가 운영하는 톡탁 웹사이트와 애플리케이션에서 제공하는 템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 톡탁을 사용하는 사용자는 아래의 항목에 동의한 것으로 간주합니다.',
  twitterDescription:
    '이 약관은 보다플레이(주)(이하 회사라 한다.)가 운영하는 톡탁 웹사이트와 애플리케이션에서 제공하는 템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 톡탁을 사용하는 사용자는 아래의 항목에 동의한 것으로 간주합니다.',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/ai-policy',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const SEO_DATA_GUIDE = {
  title: '톡탁(TokTak) - 서비스 가이드북',
  description: 'SNS 콘텐츠 제작, 게시, 수익화 과정을 AI로 자동화한 세계 최초 통합 플랫폼입니다.',
  ogTitle: 'T톡탁(TokTak) - 서비스 가이드북',
  ogDescription: 'URL 하나로 수익 시작하기: Toktak 사용 방법',
  twitterDescription: 'URL 하나로 수익 시작하기: Toktak 사용 방법',
  image: 'https://toktak.ai/images/thumb.png',
  canonical: 'https://toktak.ai/',
  site_name: 'Toktak.ai',
  name: '톡탁(TokTak)',
  ratingValue: '4.9',
  reviewCount: '248',
};

export const sampleTemplates = [
  {
    sampleId: 3,
    id: 'a1B2c3D4e5',
  },
  {
    sampleId: 3,
    iframe: '/videos/home/video3.webm',
    id: 'f6G7h8I9j0',
  },
  {
    sampleId: 2,
    id: 'k1L2m3N4o5',
  },
  {
    sampleId: 1,
    id: 'p6Q7r8S9t0',
  },
  {
    sampleId: 2,
    iframe: '/videos/home/video4.webm',
    id: 'u1V2w3X4y5',
  },
  {
    sampleId: 4,
    id: 'z6A7b8C9d0',
  },
  {
    sampleId: 4,
    id: 'e1F2g3H4i5',
  },
  {
    sampleId: 1,
    iframe: '/videos/home/video2.webm',
    id: 'j6K7l8M9n0',
  },
  {
    sampleId: 2,
    id: 'o1P2q3R4s5',
  },
  {
    sampleId: 4,
    iframe: '/videos/home/video1.webm',
    id: 't6U7v8W9x0',
  },
  {
    sampleId: 2,
    id: 'y1Z2a3B4c5',
  },
  {
    sampleId: 1,
    id: 'd6E7f8G9h0',
  },
];

export const BASIC_LIST = ['NEW_USER', 'BASIC', 'COUPON_BASIC', 'INVITE_BASIC', 'COUPON_KOL'];
export const USER_SUBSCRIPTION = [
  'NEW_USER',
  'BASIC',
  'COUPON_BASIC',
  'STANDARD',
  'COUPON_STANDARD',
  'BUSINESS',
  'COUPON_BUSINESS',
];

export const USER_SUBSCRIPTION_STANDARD = ['STANDARD', 'COUPON_STANDARD', 'BUSINESS', 'COUPON_BUSINESS'];
