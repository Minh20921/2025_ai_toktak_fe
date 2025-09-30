import React from 'react';

export interface Post {
  id: number;
  title: string;
  video_url: string;
  type: number;
  type_string: 'video' | 'image' | 'blog';
  user_id: number;
  batch_id: number;
  thumbnail: string;
  images: string[];
  subtitle: string;
  hashtag: string;
  status: number;
  process_number: number;
  render_id: string;
  created_at: string;
  updated_at: string;
  social_posts?: [];
  content?: React.ReactNode;
  description?: React.ReactNode;
}

interface BatchData {
  id: number;
  posts: Post[];
}

export const SAMPLE_BATCH_DATA: BatchData[] = [
  {
    id: 1,
    posts: [
      {
        id: 1667,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_1.png',
        images: [],
        title: '맥북 프로 16 M4와 함께하는 일상✨',
        subtitle: '',
        description:
          '새로운 맥북 프로 16 M4와 함께하는 일상✨<br/>영상편집도디자인작업도척척! 작업속도도남다름!<br/>맥북 프로16 M4와 함께 나도 크리에이터의 길로?! 😎',
        hashtag: '#맥북 #맥북프로 #M4 #일상 #디자인 #영상편집 #테크스타그램 #애플러버 #신상템',
        video_url: '/videos/template/template_1.webm',
        type: 0,
        type_string: 'video',
        status: 1,
        process_number: 0,
        render_id: 'e838b3d8-0882-4521-86c9-df73f08720db',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1668,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_1.png',
        images: [
          '/videos/template/6.png',
          '/videos/template/7.png',
          '/videos/template/8.png',
          '/videos/template/9.png',
          '/videos/template/10.png',
        ],
        title: '',
        subtitle: '',
        description:
          '새로운 맥북 프로 16 M4와 함께하는 일상✨<br/>영상편집도디자인작업도척척! 작업속도도남다름!<br/>맥북 프로16 M4와 함께 나도 크리에이터의 길로?! 😎',
        hashtag: '#맥북 #맥북프로 #M4 #일상 #디자인 #영상편집 #테크스타그램 #애플러버 #신상템',
        video_url: '/videos/template/1.pm4',
        type: 1,
        type_string: 'image',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1669,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_1.png',
        images: [],
        title: '맥북 프로 16 M4, 사길 잘했어요! 성능부터 디자인까지 완벽⭐',
        subtitle:
          '안녕하세요! 오늘은 애플의 최신 노트북, 맥북 프로 16 M4를 소개해드리려고 해요. 일상 속에서 더 나은 작업 환경을 찾고 계신 분들께 이 제품이 딱 일 것 같네요! 디자인과 디스플레이 맥북 프로 16 M4는 16인치의 넓은 디스플레이를 자랑해요. 특히, 나노 텍스처 글래스 옵션을 통해 눈부심을 줄여주어 어떤 환경에서도 선명한 화면을 제공하죠. 스페이스 블랙과 실버 두 가지 색상으로 출시되어, 개인의 취향에 따라 선택할 수 있어요. 저는 요즘 재택근무를 하면서 다양한 장소에서 작업을 하는데, 이 디스',
        content:
          '<h2>맥북 프로 16 M4, 사길 잘했어요! 성능부터 디자인까지 완벽⭐</h2><p>안녕하세요! 오늘은 애플의 최신 노트북, 맥북 프로 16 M4를 소개해드리려고 해요.<br/>일상 속에서 더 나은 작업 환경을 찾고 계신 분들<br/>께 이 제품이 딱 일 것 같네요!<img src="/videos/template/12.png" alt="무칸 헤어스타일링 그루밍토닉 워터 물왁스" /><h2>✅디자인과 디스플레이</h2><br/><p>맥북 프로 16 M4는 16인치의 넓은 디스플레이를 자랑해요.특히, 나노 텍스처 글래스 옵션을 통해 눈부심을 줄여주어 어떤 환경에서도 선명한 화면을 제공하죠.<br/>스페이스 블랙과 실버 두 가지 색상으로 출시되어, 개인의 취향에 따라 선택할 수 있어요.<br/>저는 요즘 재택근무를 하면서 다양한 장소에서 작업을 하는데, 이 디스플레이 덕분에 눈의 피로가 덜하더라고요.</p><img src="/videos/template/13.png" alt="헤어스타일링 중" /><h2>✅성능과 사양</h2><br/><p>이 노트북은 기본 M4 칩부터 M4 프로, M4 맥스 칩까지 선택 가능해요.<br/>최대 16코어 CPU와 40코어 GPU를 탑재하여 이전 모델보다 최대 3.5배 향상된 성능을 제공하죠. 또 최대 128GB의 통합 메모리를 지원해 대용량 작업도 원활하게 수행할 수 있어요.<br/>새로운 썬더볼트 5 포트는 최대 120Gb/s의 전송 속도를 자랑해요.<br/>저는 요즘 주로 영상 편집 작업을 하는데 렌더링 시간이 확실히 단축된 것 같아요.</p><img src="/videos/template/14.png" alt="제품 효과" /><h2>✅카메라와 오디오</h2><br/><p>12MP 센터 스테이지 카메라는 화상 통화 시 자동으로 사용자를 프레임에 맞춰주며,<br/>스튜디오 품질의 마이크와 6 스피커 시스템은 풍부한 사운드 경험을 제공해요.<br/>화상 회의가 잦은 분이라면 이 카메라와 오디오 시스템 덕분에 더 생생하고 원활한 소통이 가능하겠네요 ㅎㅎ</p><img src="/videos/template/15.png" alt="스타일링 전후" /><h2>✅소프트웨어와 기능</h2><p>macOS Sequoia 15.1을 탑재하여 AI 기반의 다양한 도구와 향상된 시리를 제공해요.<br/>아이폰 미러링, 개인화된 공간 음향 등 새로운 기능도 함께 경험할 수 있답니다.<br/>특히 이폰과의 연동이 강화되어 사진이나 파일 전송이 더욱 편리해졌는데요.<br/>개인적으로 이 점이 가장 편리하더라고요.</p>' +
          '<br/><h2>더 자세한 정보와 구매는 아래 링크를 확인해주세요⬇️⬇️⬇️</h2>',
        hashtag: '',
        video_url: '',
        type: 2,
        type_string: 'blog',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
    ],
  },
  {
    id: 2,
    posts: [
      {
        id: 1667,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_2.png',
        images: [],
        title: '✨삶의 질 수직 상승하는 살림 꿀템 추천!!🔥',
        subtitle: '',
        description:
          '역대급 흡입력에 먼지는 물론 반려동물 털까지 싹 빨아들여요!<br/>자동 먼지 비움과 걸레 세척 시스템은 덤👍 덕분에 손 안대고 끝ㅎㅎ <br/>이제 청소는 로보락에게 맡기고 편하게 쉬세요~',
        hashtag:
          '#로보락 #로봇청소기추천 #로보락S9MaxVUltra #집꾸미기 #청소템추천 #홈스타일링 #AI청소기 #살림꿀템 #워킹맘템 #반려동물필수템',
        video_url:
          '/videos/template/template_2.webm',
        type: 0,
        type_string: 'video',
        status: 1,
        process_number: 0,
        render_id: 'e838b3d8-0882-4521-86c9-df73f08720db',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1668,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_2.png',
        images: [
          '/videos/template/244e1b57f3056360e9c22bba933c6137dae911a9PU0i1741937286.png',
          '/videos/template/6878f2fbcf0963946a810e6a1d9a4cd1c0647acbfONq1741937340.png',
          '/videos/template/6ce070d7c6f6df0d00caf261416b913d702d05bb7PV71741937356.png',
          '/videos/template/4f34d43dcf543112efc062d9435d3009afddd4eb7gml1741937371.png',
          '/videos/template/b0ff3eec020420615ff6a2539c99fee195c9c7f2mLJr1741937386.png',
        ],
        title: '',
        subtitle: '',
        description:
          '역대급 흡입력에 먼지는 물론 반려동물 털까지 싹 빨아들여요!<br/>자동 먼지 비움과 걸레 세척 시스템은 덤👍 덕분에 손 안대고 끝ㅎㅎ <br/>이제 청소는 로보락에게 맡기고 편하게 쉬세요~',
        hashtag:
          '#로보락 #로봇청소기추천 #로보락S9MaxVUltra #집꾸미기 #청소템추천 #홈스타일링 #AI청소기 #살림꿀템 #워킹맘템 #반려동물필수템',
        video_url: '/videos/template/1.pm4',
        type: 1,
        type_string: 'image',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1669,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_2.png',
        images: [],
        title: '없어서는 안될 살림 꿀템 로보락 S9 MaxV Ultra 사용 후기',
        subtitle:
          '청소는 왜 해도 해도 끝이 없는지... 바닥은 금방 더러워지고…😂 집안일이 부담될 때 많지 않나요? 저도 늘 청소기 돌리는 게 일이었는데 로봇청소기 하나 들이고 삶의 질이 달라졌어요! 로보락 S9 MaxV Ultra 덕분에 이제는 발 뻗고 쉴 시간이 생겼어요ㅎㅎ 로봇청소기 브랜드도 다양하고 종류가 너무 많아 뭘 골라야 할지 어려웠는데 로봇청소기라고 다 같은 게 아니더라고요. 이 제품은 흡입력부터 물걸레 청소, 자동 세척까지 다 알아서 해주는 똑똑한 모델이라서 진짜 추천드리고 싶어요🖤 로보락 S9 MaxV',
        content:
          '<h2>없어서는 안될 살림 꿀템 로보락 S9 MaxV Ultra 사용 후기</h2><br/><p>청소는 왜 해도 해도 끝이 없는지... 바닥은 금방 더러워지고…😂 <br/>' +
          '집안일이 부담될 때 많지 않나요?<br/>저도 늘 청소기 돌리는 게 일이었는데 로봇청소기 하나 들이고 삶의 질이 달라졌어요!' +
          '<img src="/videos/template/e64c5a1ff618ddbb704b92efe99ec611df62aa11dIqK1741947615.png" alt="무칸 헤어스타일링 그루밍토닉 워터 물왁스" />' +
          '<p>로보락 S9 MaxV Ultra 덕분에 이제는 발 뻗고 쉴 시간이 생겼어요ㅎㅎ<br/>로봇청소기 브랜드도 다양하고 종류가 너무 많아 뭘 골라야 할지 어려웠는데 로봇청소기라고 다 같은 게 아니더라고요.<br/>이 제품은 흡입력부터 물걸레 청소, 자동 세척까지 다 알아서 해주는 똑똑한 모델이라서 진짜 추천드리고 싶어요🖤</p><img src="/videos/template/06eae07f91edb82d0c2ae295f9ecf00b45b4a4b02sfp1741947825.png" alt="헤어스타일링 중" /><br/>' +
          '<p>로보락 S9 MaxV Ultra, 뭐가 다를까?<br/>✅ 초강력 22,000Pa 흡입력 – 카펫, 바닥 먼지 싹-쓸이!<br/>✅ 듀얼 카메라 + AI 장애물 회피 – 걸리적거리는 물건 피해가며 똑똑하게 청소<br/>✅ 자동 먼지 비움 + 걸레 세척 + 건조 – 손 하나 안 대고도 항상 깨끗하게 유지<br/>✅ LDS + RetractSense 3중 구조광 + RGB 카메라 / Vertibeam 측면센서 – 집 구조를 학습해 최적의 동선으로 청소<br/>✅ 스마트폰 앱 연동 – 원격 조작 + 맞춤 청소 설정 가능</p>' +
          '<img src="/videos/template/630b88e5c48903f02fdf5b22a10e93800ceecdd0JIUx1741951976.png" alt="제품 효과" />' +
          '<p>청소기 하나로 이렇게 편해질 줄 몰랐어요.<br/>특히 자동 세척 기능이 있어서 물걸레 청소도 걱정 없다는 게 신세계였어요.<br/><br/>직접 사용해보니 이런 점이 좋았어요!<br/>📌 흡입력 진짜 역대급! 먼지뿐만 아니라 반려동물 털도 싹 빨아들여요. 카펫 청소도 완벽!<br/>📌 장애물 회피력 최강! 의자 다리, 장난감 같은 것도 피해서 다니니까 막힘 없이 청소돼요.' +
          '📌 자동 먼지 비움 + 걸레 세척 시스템 덕분에 청소 후에도 손 안 대고 끝!<br/>📌 스마트폰으로 원격 조작 가능! 외출 중에도 앱으로 청소 예약하고 관리할 수 있어요.</p><img src="/videos/template/b10414b04cf3e649af4d40c5174292861915dff2Koy31741952180.png" alt="스타일링 전후" />' +
          '<p>특히 바닥에 물걸레 청소까지 해주니까 집안이 늘 깔끔해요. 저도 처음엔 고민했지만 이제는 "왜 진작 안 샀을까?" 싶어요!<br/><br/>로보락 S9 MaxV Ultra 이런 분들에게 강력 추천!<br/>✔ 집 청소할 시간이 부족한 분<br/>' +
          '✔ 반려동물 키우면서 털 관리가 고민인 분<br/>✔ 바닥 먼지, 물걸레 청소까지 한 번에 해결하고 싶은 분<br/>✔ 로봇청소기를 써봤지만 더 강력한 성능이 필요한 분<br/><br/>👉 더자세한정보와구매는아래링크에서확인하세요!</p>',
        hashtag: '',
        video_url: '',
        type: 2,
        type_string: 'blog',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
    ],
  },
  {
    id: 3,
    posts: [
      {
        id: 1667,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_3.png',
        images: [],
        title: '산뜻한 사용감! 하지만 보습은 꽉 채워준다고요?',
        subtitle: '',
        description:
          '바를수록 느껴지는 탄력 & 광채 피부💛<br/>이탈리아산 화이트 트러플로 피부에 리프레시🌿<br/>피부 컨디션 살리고 싶다면 #달바세럼 찜!',
        hashtag:
          '#달바 #화이트트러플세럼 #비건화장품 #탄력세럼 #광채세럼 #환절기보습 #피부영양 #속보습케어 #데일리세럼 #인생세럼',
        video_url: '/videos/template/template_3.webm',
        type: 0,
        type_string: 'video',
        status: 1,
        process_number: 0,
        render_id: 'e838b3d8-0882-4521-86c9-df73f08720db',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1668,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_3.png',
        images: [
          '/videos/template/e9e8dbcac5dbfbc9f57fb657b8a11ef1f6e2596bzzy51741937482.png',
          '/videos/template/e786fd4b3732db7c396b44d7ce1fbd9a0eeddbe4TLI61741937493.png',
          '/videos/template/0ebeb928f7d17878b22e1725cae9e4362430725ekZTP1742119159.png',
          '/videos/template/b3402ecdd2902d3bf850965264ea2e502e66e08fuJ041741937518.png',
          '/videos/template/1a9242952853897673247e1411328903f0cd5f48wZRD1741937528.png',
        ],
        title: '',
        subtitle: '',
        description:
          '바를수록 느껴지는 탄력 & 광채 피부💛<br/>이탈리아산 화이트 트러플로 피부에 리프레시🌿<br/>피부 컨디션 살리고 싶다면 #달바세럼 찜!',
        hashtag:
          '#달바 #화이트트러플세럼 #비건화장품 #탄력세럼 #광채세럼 #환절기보습 #피부영양 #속보습케어 #데일리세럼 #인생세럼',
        video_url: '/videos/template/1.pm4',
        type: 1,
        type_string: 'image',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1669,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/thumbnail_3.png',
        images: [],
        title: '세럼 유목민 드디어 이곳에 정착! 달바 화이트 트러플 프라임 인텐시브 세럼',
        subtitle:
          "매일 피부 관리한다고 하는데 왜 이렇게 푸석하고 탄력이 없는 걸까요?ㅜㅜ 요즘 환절기라 그런지 피부가 더 예민해지고 푸석해지는 느낌이었어요. 그래서 집중적인 케어가 필요하겠다 싶어 사용해 본 제품이 바로 '달바 화이트 트러플 프라임 인텐시브 세럼'이에요.  이미 '승무원 추천템', '국민 미스트 세럼'으로 유명한 이 제품의 인기 비결은<br/>" +
          '바로 이탈리아산 화이트 트러플 성분 덕분인데요!  ‘피부를 위한 다이아몬드’라고 불리는 화이트 트러플은 항산화 효과가 뛰어나고 피부에 탄력과 생기를 부여해 줘요...',
        content:
          '<h2>세럼 유목민 드디어 이곳에 정착! 달바 화이트 트러플 프라임 인텐시브 세럼</h2><br/><p>매일 피부 관리한다고 하는데 왜 이렇게 푸석하고 탄력이 없는 걸까요?ㅜㅜ<br/>' +
          "요즘 환절기라 그런지 피부가 더 예민해지고 푸석해지는 느낌이었어요.<br/>그래서 집중적인 케어가 필요하겠다 싶어 사용해 본 제품이 바로 '달바 화이트 트러플 프라임 인텐시브 세럼'이에요" +
          '<img src="/videos/template/9bc3449b1929bdb3d655c0693179fc8871bd9ec1Iw1s1741953677.png" alt="무칸 헤어스타일링 그루밍토닉 워터 물왁스" />' +
          "<p> 이미 '승무원 추천템', '국민 미스트 세럼'으로 유명한 이 제품의 인기 비결은<br/>바로 이탈리아산 화이트 트러플 성분 덕분인데요!<br/>‘피부를 위한 다이아몬드’라고 불리는 화이트 트러플은 항산화 효과가 뛰어나고 피부에 탄력과 생기를 부여해 줘요.<br/>" +
          '게다가 7중 히알루론산과 펩타이드 성분까지 함유돼 있어서 보습과 주름 케어까지 한 번에 가능하다고 해요.</p><img src="/videos/template/224390d6379281149eebbf3aecaff32c8ba8b8ceV6tk1741953920.png" alt="헤어스타일링 중" /><br/>' +
          '<p>일단 제형이 너무 가볍고 촉촉해서 바르는 순간 피부에 빠르게 흡수되는 게 포인트!<br/>끈적이지 않아서 아침저녁으로 사용하기 딱 좋더라고요.<br/>한두 펌핑만 해도 미세 분사되어 얼굴 전체 도포되는데 피부가 즉각적으로 촉촉해지는 느낌이 들었어요</p>' +
          '<img src="/videos/template/53d1f57b1a5d52d5ed3a2b1268d8f23ab7a9adaaujCE1741954058.png" alt="제품 효과" />' +
          '<p>그리고 민감성 피부 타입에게 가장 중요한 것!<br/>이 달바 화이트 트러플 프라임 인텐시브 세럼은 비건 인증을 받은 저자극 포뮬러라서<br/>피부가 민감한 사람들도 부담 없이 사용할 수 있는 것이에요. 거기에 향까지 좋은 건 덤!</p>' +
          '<img src="/videos/template/d7486f1847d694a324fa850c311de48f39c4b6f1Va2z1741954151.png" alt="스타일링 전후" />' +
          '<p>달바 화이트 트러플 프라임 인텐시브 세럼 이런 분들에게 추천해요!<br/>✔ 피부가 푸석하고 탄력이 떨어진 분<br/>✔ 끈적임 없이 촉촉한 세럼을 찾는 분<br/>' +
          '✔ 피부에 활력을 주고 싶은 분<br/>✔ 저자극, 비건 화장품을 선호하는 분<br/><br/>요즘 아침저녁으로 꾸준히 바르면서 피부 컨디션이 점점 좋아지는 게 보여서 기분이 너무 좋아요!<br/>촉촉하고 건강한 피부를 원하신다면 달바 화이트 트러플 프라임 인텐시브 세럼 강력 추천해요!</p>' +
          '<h2>👉 제품 확인하기 https://www.coupang.com/vp/products/8215941815</h2>',
        hashtag: '',
        video_url: '',
        type: 2,
        type_string: 'blog',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
    ],
  },
  {
    id: 4,
    posts: [
      {
        id: 1667,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/ea6144dce0baa40b91763c8ea5ecda7844ff1cd03eeh1741937801.png',
        images: [],
        title: '매트리스 하나 바꿨을 뿐인데 수면의 질이 달라졌어요✨',
        subtitle: '',
        description:
          '푹 자고 싶다면? 에이스침대 하이브리드 테크 라임!<br/>하드 & 슈퍼 하드 양면 사용 가능해서 취향대로 선택 가능!<br/>허리 편한 매트리스 찾고 있다면 이거 꼭 체크해보세요💙',
        hashtag:
          '#에이스침대 #하이브리드테크라임 #숙면템 #매트리스추천 #꿀잠매트리스 #침대바꾸기 #홈스타일링 #침실인테리어 #꿀잠템 #편안한잠',
        video_url: '/videos/template/template_4.webm',
        type: 0,
        type_string: 'video',
        status: 1,
        process_number: 0,
        render_id: 'e838b3d8-0882-4521-86c9-df73f08720db',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1668,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/ea6144dce0baa40b91763c8ea5ecda7844ff1cd03eeh1741937801.png',
        images: [
          '/videos/template/77d4cc5ab797d5bde0bd9588313e2fe24a77c3d71Hg91741937736.png',
          '/videos/template/cab7468a4cc9edb3cb3743e018111fd8f27054f1GFXf1741937753.png',
          '/videos/template/d572d5d3ca6a3572e9990f7c2252f1f1a98831ebuMpj1741937765.png',
          '/videos/template/6264a8ebeb3c286a7cb462b4683a3fe3e495ad46tBJU1741937775.png',
          '/videos/template/9ff136d0ddd7718a8c38ce2aeb693a495e462746zoxw1741937785.png',
        ],
        title: '',
        subtitle: '',
        description:
          '푹 자고 싶다면? 에이스침대 하이브리드 테크 라임!<br/하드 & 슈퍼 하드 양면 사용 가능해서 취향대로 선택 가능!<br/>허리 편한 매트리스 찾고 있다면 이거 꼭 체크해보세요💙',
        hashtag:
          '#에이스침대 #하이브리드테크라임 #숙면템 #매트리스추천 #꿀잠매트리스 #침대바꾸기 #홈스타일링 #침실인테리어 #꿀잠템 #편안한잠',
        video_url: '/videos/template/1.mp4',
        type: 1,
        type_string: 'image',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
      {
        id: 1669,
        user_id: 1,
        batch_id: 571,
        thumbnail:
          '/videos/template/ea6144dce0baa40b91763c8ea5ecda7844ff1cd03eeh1741937801.png',
        images: [],
        title: '매트리스 교체가 고민? 에이스침대 하이브리드 테크 라임 원 매트리스!!',
        subtitle:
          '요즘 따라 아침에 일어나도 개운하지 않고, 허리가 뻐근하더라고요. 잠은 잤는데 더 피곤한 느낌이랄까요? 이럴 땐 매트리스 교체를 고민해볼 때가 된 걸 수도 있다기에' +
          '저도 오랜 고민 끝에 에이스침대 하이브리드 테크 라임 원 매트리스를 들였네요! 침대는 한 번 사면 몇 년은 써야 하니까 신중하게 고르는 게 중요하잖아요. 이것저것 비교해보다가 결국 ‘허리를 탄탄하게 받쳐주면서 오래 쓸 수 있는 매트리스’를 찾았고, 그게 바로 에이스침대 하이브리드 테크 라임 원이었어요. 이 매트리스의 가장 큰 특징은',
        content:
          '<h2>매트리스 교체가 고민? 에이스침대 하이브리드 테크 라임 원 매트리스!!</h2><br/><p>요즘 따라 아침에 일어나도 개운하지 않고, 허리가 뻐근하더라고요.<br/>' +
          '잠은 잤는데 더 피곤한 느낌이랄까요?<br/>이럴 땐 매트리스 교체를 고민해볼 때가 된 걸 수도 있다기에<br/>저도 오랜 고민 끝에 에이스침대 하이브리드 테크 라임 원 매트리스를 들였네요!' +
          '<img src="/videos/template/e175c2052f049ddade0b0be1dd4b4995f74d60a2Sl8T1741955502.png" alt="무칸 헤어스타일링 그루밍토닉 워터 물왁스" />' +
          '<p>침대는 한 번 사면 몇 년은 써야 하니까 신중하게 고르는 게 중요하잖아요.<br/>이것저것 비교해보다가 결국 ‘허리를 탄탄하게 받쳐주면서 오래 쓸 수 있는 매트리스’를 찾았고,<br/>그게 바로 에이스침대 하이브리드 테크 라임 원이었어요</p>' +
          '<img src="/videos/template/d3e6d15ec3c4778fff4e8a015cf635918e8c4d7bEEJ81741955260.png" alt="헤어스타일링 중" /><br/>' +
          '<p>이 매트리스의 가장 큰 특징은 양면 사용이 가능하다는 점이에요.<br/>한쪽은 하드, 다른 한쪽은 슈퍼 하드로 되어 있어서 취향에 맞게 사용할 수 있어요.<br/>하이브리드 테크 기술이 적용돼서 스프링과 폼의 장점을 결합, 몸을 안정적으로 지지해줘요.<br/>또 강한 복원력 덕분에 오랫동안 탄탄한 상태를 유지할 수 있어요.</p>' +
          '<img src="/videos/template/31e1125330aa52897ff02d5a27dc8f2e74c71e4eb8nm1741955352.png" alt="제품 효과" />' +
          '<p>저는 원래 단단한 매트리스를 선호해서 하드 면으로 사용 중인데,<br/>몸이 푹 꺼지지 않고 딱 잡아주는 느낌이 정말 좋아요.<br/>허리가 받쳐지니까 자세도 편해지고, 아침에 일어났을 때 개운한 게 확실히 다르더라고요</p>' +
          '<img src="/videos/template/4c1a0e1a334bbe3865c61dfcf4462ac97bd88d47KapM1741955664.png" alt="스타일링 전후" />' +
          '<p>우리 집 침실, 호텔처럼 변신!<br/>사실 매트리스를 새로 사면서 침실 분위기도 한층 업그레이드된 느낌이에요.<br/>에이스침대 특유의 깔끔한 디자인 덕분인지, 호텔 침실 같은 분위기가 나더라고요.<br/>' +
          '은근 이런 것도 중요하잖아요? 😆</p>' +
          '<img src="/videos/template/00d8a93078901dcac83cc6c0fc687f095febe413CFqM1741955744.png" alt="스타일링 전후" />' +
          '<p>그리고 또 하나! 함께 자는 사람이 뒤척여도 흔들림이 적어서 방해를 덜 받는다는 점이에요.<br/>예전 매트리스는 옆에서 조금만 움직여도 흔들려서 깼는데, 이건 확실히 안정감이 있어요.<br/>커플이나 가족과 함께 쓰는 분들에게도 강추!</p>' +
          '<img src="/videos/template/cef4a7f5089ae33f83fdb714a2e50f77821dda880GoT1741955807.png" alt="스타일링 전후" />' +
          '<p>직접 사용해보니, 이런 분들에게 추천!<br/>✅ 허리를 탄탄하게 받쳐주는 단단한 매트리스를 찾는 분<br/>✅ 한 번 사면 오래 사용할 수 있는 매트리스를 원하는 분<br/>' +
          '✅ 같이 자는 사람이 뒤척여도 흔들림 없는 매트리스가 필요한 분<br/>✅ 하드 & 슈퍼 하드 양면 사용이 가능한 제품을 찾는 분</p><br/>' +
          '<p>매트리스 하나 바꿨을 뿐인데, 확실히 수면의 질이 달라졌어요.<br/>처음엔 “정말 효과가 있을까?” 반신반의했는데, 지금은 “진작 바꿀 걸!”이라고 생각할 정도랍니다.<br/>결론! 고민할 이유 없는 꿀잠템!<br/>' +
          '아침에 개운하게 일어나고 싶다면, 매트리스 바꾸는 게 정답이에요.<br/>에이스침대 하이브리드 테크 라임 원 매트리스는 허리를 탄탄하게 받쳐주면서도 오래 사용할 수 있는 제품이라 정말 만족스러워요.<br/>편안한 숙면이 필요하신 분들께 강력 추천해요!</p>',
        hashtag: '',
        video_url: '',
        type: 2,
        type_string: 'blog',
        status: 1,
        process_number: 0,
        render_id: '',
        created_at: '2025-03-04 07:16:16',
        updated_at: '2025-03-04 07:17:26',
      },
    ],
  },
];
