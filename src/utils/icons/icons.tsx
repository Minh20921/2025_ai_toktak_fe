import { SVGProps } from 'react';

export const ImageIcons = (props: SVGProps<SVGSVGElement>) => (
  <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 99.75" {...props}>
    <path
      d="M29.09 0h64.7A5.21 5.21 0 0 1 99 5.18v89.4a5.19 5.19 0 0 1-5.18 5.17H29.09a5.19 5.19 0 0 1-5.17-5.18V5.18A5.21 5.21 0 0 1 29.09 0m78.52 12.46 10.59-1.52a4.71 4.71 0 0 1 4.68 4.69v68.5a4.71 4.71 0 0 1-4.68 4.68L107.77 88a1.35 1.35 0 0 1-1.31-1.34v-3.52a1.34 1.34 0 0 1 1.44-1.23l8.91.73V17.22l-9 1.34a1.34 1.34 0 0 1-1.34-1.34v-3.44a1.34 1.34 0 0 1 1.15-1.32ZM5 11l10.31 1.49a1.33 1.33 0 0 1 1.14 1.32v3.44a1.34 1.34 0 0 1-1.34 1.34l-9-1.34v65.39l8.89-.73a1.33 1.33 0 0 1 1.43 1.23v3.49A1.35 1.35 0 0 1 15.11 88l-10.43.84A4.71 4.71 0 0 1 0 84.13v-68.5a4.73 4.73 0 0 1 4.68-4.69zm87.93-4.9H30v87.6h62.9V6.07Z"
      fill={'currentColor'}
    />
  </svg>
);

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M20 22.334 11.832 30.5q-.459.459-1.167.459T9.499 30.5t-.458-1.166.458-1.167L17.666 20l-8.167-8.166q-.458-.459-.458-1.167T9.499 9.5t1.167-.458 1.167.458l8.166 8.167L28.166 9.5q.458-.458 1.167-.458.707 0 1.166.458.459.459.459 1.167t-.459 1.167L22.333 20l8.166 8.167q.459.457.459 1.167 0 .707-.459 1.166-.458.459-1.166.459-.709 0-1.167-.459z"
      fill={props.fill || '#fff'}
    />
  </svg>
);
export const MoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={4} viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={2} cy={2} r={2} fill="currentColor" />
    <circle cx={9} cy={2} r={2} fill="currentColor" />
    <circle cx={16} cy={2} r={2} fill="currentColor" />
  </svg>
);
export const NextSlideIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={40} height={41} viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 40.716c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20m1.953-20L15 14.022l2.14-2.056 9.11 8.75-9.11 8.75L15 27.41z"
      fill="#fff"
      fillOpacity={0.8}
    />
  </svg>
);
export const PreviousSlideIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={40} height={41} viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 .716c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20m-1.953 20L25 27.41l-2.14 2.056-9.11-8.75 9.11-8.75L25 14.022z"
      fill="#fff"
      fillOpacity={0.8}
    />
  </svg>
);
export const SubwayMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={19} cy={19} r={19} fill="#F4F4F4" />
    <g clipPath="url(#SubwayMenuIcon)">
      <path
        d="M16.819 15.363h4.362V11H16.82zM22.638 11v4.363H27V11zM11 15.363h4.363V11H11zm5.819 5.818h4.362V16.82H16.82zm5.819 0H27V16.82h-4.363zm-11.638 0h4.363V16.82H11zM16.819 27h4.362v-4.363H16.82zm5.819 0H27v-4.363h-4.363zM11 27h4.363v-4.363H11z"
        fill="#272727"
      />
    </g>
    <defs>
      <clipPath id="SubwayMenuIcon">
        <path fill="#fff" d="M11 11h16v16H11z" />
      </clipPath>
    </defs>
  </svg>
);
export const MessengerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={19} cy={19} r={19} fill="#F4F4F4" />
    <g clipPath="url(#MessengerIcon)">
      <path
        d="M19 28a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L10 28l4.873-1c1.236.64 2.64 1 4.127 1"
        fill="#272727"
        stroke="#272727"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={19.5} cy={18.5} r={7.5} fill="#fff" />
      <path
        d="M18.462 27.243a8.288 8.288 0 1 1 1.717-16.486 8.288 8.288 0 0 1-1.717 16.486m1.57-4.162.334-3.215 4.55.474-6.307-5.421-.335 3.215-4.55-.474z"
        fill="#272727"
      />
    </g>
    <defs>
      <clipPath id="MessengerIcon">
        <path fill="#fff" d="M7 7h24v24H7z" />
      </clipPath>
    </defs>
  </svg>
);
export const NotionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={19} cy={19} r={19} fill="#F4F4F4" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.999 9.4a7.2 7.2 0 0 0-7.2 7.2c0 2.265-.545 4.398-1.509 6.281a.9.9 0 0 0 .618 1.291q1.94.403 3.907.61a4.2 4.2 0 0 0 8.367 0 40 40 0 0 0 3.907-.61.9.9 0 0 0 .618-1.29 13.74 13.74 0 0 1-1.508-6.282 7.2 7.2 0 0 0-7.2-7.2m-2.34 15.532q2.339.135 4.68 0a2.4 2.4 0 0 1-4.68 0"
      fill="#272727"
    />
  </svg>
);

export const BackNextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="80" height="81" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_d_6220_715)">
      <circle cx="40" cy="40.7158" r="20" fill="white" />
    </g>
    <path
      d="M36 35.3608L41.5628 40.7158L36 46.0708L37.7126 47.7158L45 40.7158L37.7126 33.7158L36 35.3608Z"
      fill="#686868"
    />
    <defs>
      <filter
        id="filter0_d_6220_715"
        x="0"
        y="0.71582"
        width="80"
        height="80"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="10" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6220_715" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6220_715" result="shape" />
      </filter>
    </defs>
  </svg>
);
export const AlertNotion = (props: SVGProps<SVGSVGElement>) => (
  <svg width={34} height={36} viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m33.067 27.745-2.444-4.028 2.077-7.754c.816-2.868.513-5.947-.852-8.669s-3.699-4.903-6.572-6.14A13.4 13.4 0 0 0 19.993.17a12.9 12.9 0 0 0-5.183 1.18 12.2 12.2 0 0 0-4.16 3.137 11.64 11.64 0 0 0-2.398 4.534L6.076 17.14l-4.13 2.266c-.52.289-.936.72-1.196 1.24a2.8 2.8 0 0 0-.264 1.685c.087.578.35 1.123.755 1.566.406.444.935.766 1.523.927l6.137 1.644-.158.591c-.388 1.788-.016 3.668 1.034 5.228s2.692 2.672 4.566 3.093c1.834.572 3.813.43 5.502-.396s2.95-2.267 3.509-4.01l.158-.59 6.137 1.644c.59.154 1.21.14 1.782-.041a3 3 0 0 0 1.437-.98 2.8 2.8 0 0 0 .614-1.59 2.9 2.9 0 0 0-.415-1.672m-13.366 2.25a3.34 3.34 0 0 1-1.792 1.815 3.67 3.67 0 0 1-2.634.093 3.68 3.68 0 0 1-2.235-1.398 3.34 3.34 0 0 1-.645-2.467l.159-.591 7.305 1.958zM5.285 21.774 7.99 20.3a3.6 3.6 0 0 0 1.101-.918 3.45 3.45 0 0 0 .638-1.262L11.904 10a8.2 8.2 0 0 1 1.687-3.191 8.6 8.6 0 0 1 2.93-2.205 8.95 8.95 0 0 1 3.645-.88 9.3 9.3 0 0 1 3.731.676c2.025.893 3.663 2.448 4.613 4.38s1.147 4.111.556 6.136l-2.096 7.823a3.45 3.45 0 0 0-.086 1.408c.068.472.232.93.484 1.345l1.624 2.634z"
      fill="#4776EF"
    />
  </svg>
);
export const AlertNotionMobile = (props: SVGProps<SVGSVGElement>) => (
  <svg width={64} height={64} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width={64} height={64} rx={32} fill="#FBD62F" fillOpacity={0.1} />
    <path d="M34.98 17.879a2.879 2.879 0 1 1-5.757 0 2.879 2.879 0 0 1 5.758 0" fill="#FFAE45" />
    <path
      d="M32.03 17.887c6.618 0 11.983 5.365 11.983 11.982v2.24c0 2.137.666 4.22 1.904 5.963 1.713 2.41-.01 5.751-2.968 5.751H21.05c-2.958 0-4.682-3.34-2.968-5.75a10.3 10.3 0 0 0 1.904-5.965V29.87c0-6.619 5.364-11.983 11.982-11.983z"
      fill="#FBD62F"
    />
    <path d="M36.4 43.748a4.513 4.513 0 1 1-9.025 0z" fill="#FFAE45" />
  </svg>
);
export const IconSort = (props: SVGProps<SVGSVGElement>) => (
  <svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m13.567 9.504-2.497 2.5a.625.625 0 0 1-.825.053l-.059-.052-2.504-2.5a.625.625 0 0 1 .825-.936l.059.052 1.432 1.43V3.439a.625.625 0 0 1 .552-.621l.074-.005a.625.625 0 0 1 .62.552l.005.074v6.618l1.433-1.435a.625.625 0 0 1 .825-.052l.06.052a.625.625 0 0 1 .052.825zm-9.12 2.678-.073.004a.625.625 0 0 1-.62-.552l-.005-.073V4.946L2.316 6.38a.625.625 0 0 1-.825.052l-.059-.052a.625.625 0 0 1-.052-.825l.052-.059 2.498-2.5a.625.625 0 0 1 .825-.052l.058.052 2.503 2.5a.625.625 0 0 1-.825.936l-.059-.052L5 4.949v6.612a.625.625 0 0 1-.552.62"
      fill="#6A6A6A"
    />
  </svg>
);
export const IconUploadMedia = (props: SVGProps<SVGSVGElement>) => (
  <svg width={51} height={51} viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M32.31 14.29a.945.945 0 0 0-.946-.946H9.736a.945.945 0 0 0-.945.945h1.67v.99h-1.67v11.97h1.67v.989h-1.67c0 .522.424.945.945.945h21.628a.945.945 0 0 0 .945-.945h-1.85v-.99h1.85V15.279h-1.85v-.99zm-10.81 0v.99h-2.08v-.99zm-2.76 0v.99h-2.08v-.99zm-2.76 0v.99H13.9v-.99zm-4.839 0h2.08v.99h-2.08zm0 13.948v-.99h2.08v.99zm2.76 0v-.99h2.08v.99zm2.76 0v-.99h2.08v.99zm2.76 0v-.99h2.08v.99zm2.759 0v-.99h2.08v.99zm2.76 0v-.99h2.08v.99zm4.84 0H27.7v-.99h2.08zm-7.6-12.959v-.99h2.08v.99zm2.76 0v-.99h2.08v.99zm4.84 0H27.7v-.99h2.08z"
      fill="#C3D8FC"
    />
    <path
      d="M16.047 36.847V19.033c0-.863.7-1.562 1.564-1.562h5.845c.41 0 .81.133 1.136.38l1.786 1.346c.328.247.727.38 1.137.38h13.002c.864 0 1.565.7 1.565 1.562v15.708c0 .92-.747 1.666-1.668 1.666H17.715a1.667 1.667 0 0 1-1.668-1.666"
      fill="url(#a)"
    />
    <path
      d="M40.395 38.512H17.73a1.683 1.683 0 0 1-1.683-1.68V22.744c0-.861.701-1.561 1.564-1.561h22.904c.863 0 1.564.7 1.564 1.561V36.83c0 .927-.754 1.68-1.683 1.68"
      fill="url(#b)"
    />
    <path
      d="M40.515 21.184H17.61c-.864 0-1.564.699-1.564 1.561v.144c0-.862.7-1.561 1.564-1.561h22.903c.864 0 1.565.699 1.565 1.561v-.144c0-.862-.7-1.561-1.565-1.561"
      fill="#B9CCFF"
    />
    <path
      d="M26.984 29.435v2.424c0 .315.255.57.57.57h3.014a.57.57 0 0 0 .57-.57v-2.424h1.077a.187.187 0 0 0 .133-.32l-3.154-3.15a.19.19 0 0 0-.266 0l-3.154 3.15a.187.187 0 0 0 .133.32zm.379 4.355h3.397a.378.378 0 1 0 0-.757h-3.397a.378.378 0 1 0 0 .756"
      fill="#4776EF"
    />
    <defs>
      <linearGradient id="a" x1={29.064} y1={20.08} x2={29.064} y2={21.882} gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff" />
        <stop offset={0.775} stopColor="#DFDFDF" />
      </linearGradient>
      <linearGradient id="b" x1={29.062} y1={33.231} x2={29.062} y2={42.093} gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff" />
        <stop offset={1} stopColor="#A4BEEE" />
      </linearGradient>
    </defs>
  </svg>
);
export const IconDone = (props: SVGProps<SVGSVGElement>) => (
  <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3.75 23.313h22.5"
      stroke="currentColor"
      strokeWidth={2.064}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m21.989 3.357-9.852 9.835-4.11-4.132a1.14 1.14 0 0 0-.83-.35q-.48 0-.832.35-.35.35-.364.83t.335.829l4.985 4.975q.35.35.816.35t.816-.35L23.65 5.016q.35-.35.35-.83t-.35-.829a1.13 1.13 0 0 0-.83-.35q-.48 0-.831.35"
      fill="currentColor"
    />
  </svg>
);
export const NextSlideIconV2 = (props: SVGProps<SVGSVGElement>) => (
  <svg width={80} height={80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#a)">
      <circle cx={40} cy={40} r={20} fill="#fff" />
    </g>
    <path d="M36 34.645 41.563 40 36 45.355 37.713 47 45 40l-7.287-7z" fill="#686868" />
    <defs>
      <filter id="a" x={0} y={0} width={80} height={80} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation={10} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_6804_3837" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_6804_3837" result="shape" />
      </filter>
    </defs>
  </svg>
);
export const PreviousSlideIconV2 = (props: SVGProps<SVGSVGElement>) => (
  <svg width={80} height={80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#a)">
      <circle cx={40} cy={40} r={20} fill="#fff" />
    </g>
    <path d="M43 45.355 37.437 40 43 34.645 41.287 33 34 40l7.287 7z" fill="#686868" />
    <defs>
      <filter id="a" x={0} y={0} width={80} height={80} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset />
        <feGaussianBlur stdDeviation={10} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_6804_3948" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_6804_3948" result="shape" />
      </filter>
    </defs>
  </svg>
);

export const DoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.5 15.5H17.5" stroke="#6A6A6A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M14.6592 2.23214L8.09118 8.77083L5.35127 6.02381C5.19581 5.86956 5.01134 5.79218 4.79785 5.79167C4.58435 5.79115 4.39962 5.86853 4.24365 6.02381C4.08767 6.17909 4.00658 6.363 4.00036 6.57554C3.99414 6.78807 4.06876 6.97173 4.22421 7.12649L7.54708 10.4345C7.70254 10.5893 7.88391 10.6667 8.09118 10.6667C8.29845 10.6667 8.47982 10.5893 8.63528 10.4345L15.7668 3.33482C15.9228 3.17954 16.0005 2.99563 16 2.7831C15.9995 2.57056 15.9218 2.3869 15.7668 2.23214C15.6119 2.07738 15.4274 2 15.2134 2C14.9994 2 14.8146 2.07738 14.6592 2.23214Z"
      fill="#6A6A6A"
    />
  </svg>
);

export const DotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="2" cy="2" r="2" transform="rotate(90 2 2)" fill="#A4A4A4" />
    <circle cx="2" cy="9" r="2" transform="rotate(90 2 9)" fill="#A4A4A4" />
    <circle cx="2" cy="16" r="2" transform="rotate(90 2 16)" fill="#A4A4A4" />
  </svg>
);

export const UpDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 1.68945L5.5 5.68945L10 1.68945"
      stroke={props?.color ?? '#6A6A6A'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg width={15} height={17} viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#IconCheck)">
      <path
        d="M14.688 3.499a1.06 1.06 0 0 1 0 1.504l-8.572 8.5a1.08 1.08 0 0 1-1.516 0L.314 9.253a1.06 1.06 0 0 1 0-1.504 1.08 1.08 0 0 1 1.517 0l3.529 3.496L13.174 3.5a1.08 1.08 0 0 1 1.517 0z"
        fill="#4776EF"
      />
    </g>
    <defs>
      <clipPath id="IconCheck">
        <path fill="#fff" d="M0 0h15v17H0z" />
      </clipPath>
    </defs>
  </svg>
);
export const IconSuccess = (props: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <mask
      id="IconSuccess"
      style={{
        maskType: 'luminance',
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={20}
      height={20}
    >
      <path d="M20 0H0v20h20z" fill="#fff" />
    </mask>
    <g mask="url(#IconSuccess)">
      <path
        d="M9.997 1.01c4.961 0 8.99 4.028 8.99 8.99 0 4.96-4.029 8.988-8.99 8.988S1.007 14.96 1.007 10s4.029-8.99 8.99-8.99"
        fill="#05D05A"
      />
      <path
        d="m5.46 10.333 2.934 3.133 5.817-6.616"
        stroke="#fff"
        strokeWidth={1.975}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
export const IconError = (props: SVGProps<SVGSVGElement>) => (
  <svg width={81} height={73} viewBox="0 0 81 73" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <mask
      id="IconError"
      style={{
        maskType: 'luminance',
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={82}
      height={73}
    >
      <path d="M81.401.226H0v72.582h81.401z" fill="#fff" />
    </mask>
    <g mask="url(#IconError)">
      <path
        d="M33.902 19.776c3.744-6.484 9.823-6.484 13.567 0l17.862 30.938c3.744 6.485.704 11.75-6.783 11.75H22.824c-7.488 0-10.528-5.265-6.784-11.75l8.93-15.469c2.424-4.196 8.932-15.469 8.932-15.469"
        fill="#EF4444"
      />
      <path
        d="M33.902 19.776c3.744-6.484 9.823-6.484 13.567 0l17.862 30.938c3.744 6.485.704 11.75-6.783 11.75H22.824c-7.488 0-10.528-5.265-6.784-11.75l8.93-15.469c2.424-4.196 8.932-15.469 8.932-15.469Z"
        stroke="#EF4444"
        strokeWidth={1.696}
      />
      <path
        d="M40.683 54.268q1.247 0 2.066-.839.82-.838.82-2.086t-.82-2.086q-.819-.84-2.067-.839-1.248 0-2.066.839-.82.839-.82 2.086 0 1.248.82 2.086.819.84 2.066.839m0-8.19q.585 0 .994-.39t.487-1.13l1.443-15.131.04-.43q0-1.207-.84-1.93-.838-.72-2.125-.721-1.286 0-2.125.721-.839.723-.838 1.93l.039.39 1.443 15.17q.077.742.487 1.131.41.39.994.39"
        fill="#fff"
      />
    </g>
  </svg>
);
export const IconWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={64}
    height={64}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="iconify iconify--emojione"
    {...props}
  >
    <path
      d="M5.9 62c-3.3 0-4.8-2.4-3.3-5.3L29.3 4.2c1.5-2.9 3.9-2.9 5.4 0l26.7 52.5c1.5 2.9 0 5.3-3.3 5.3z"
      fill="#ffce31"
    />
    <g fill="#231f20">
      <path d="m27.8 23.6 2.8 18.5c.3 1.8 2.6 1.8 2.9 0l2.7-18.5c.5-7.2-8.9-7.2-8.4 0" />
      <circle cx={32} cy={49.6} r={4.2} />
    </g>
  </svg>
);
export const IconNextStep = (props: SVGProps<SVGSVGElement>) => (
  <svg width={31} height={40} viewBox="0 0 31 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1.783 2 16.07 20.047 1.783 38.094"
      stroke="#4776EF"
      strokeOpacity={0.6}
      strokeWidth={4.277}
      strokeLinejoin="round"
    />
    <path d="m13.815 2 14.287 18.047-14.287 18.047" stroke="#4776EF" strokeWidth={4.277} strokeLinejoin="round" />
  </svg>
);


export const IconFamily = (props: SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="17" height="12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <g clip-path="url(#clip0_2691_8543)">
      <path d="M11.4823 15.6369C11.4905 15.779 11.3768 15.9008 11.2347 15.9008C11.2347 15.9008 11.2347 15.9008 11.2307 15.9008C10.1346 15.9008 9.03853 15.9008 7.94247 15.9008C7.49186 15.9008 7.3579 15.7668 7.3579 15.3243C7.3579 14.8453 7.34572 14.3622 7.36196 13.8832C7.39038 12.9658 7.78415 12.2188 8.47426 11.6221C8.57981 11.5287 8.64882 11.5247 8.76248 11.6221C9.75706 12.4543 11.0886 12.4502 12.0872 11.614C12.1927 11.5247 12.2618 11.5206 12.3592 11.6099C12.4688 11.7073 12.5784 11.8048 12.6961 11.9022C12.8138 11.9996 12.8098 12.1823 12.6961 12.2797C11.6488 13.189 11.3971 14.3419 11.4823 15.6369Z" fill="white"/>
      <path d="M12.7165 15.8882C12.5216 15.8882 12.3592 15.7299 12.3592 15.5351C12.3511 14.9302 12.3146 14.3416 12.615 13.7976C12.7083 13.6271 12.822 13.4647 12.9438 13.2983C13.0615 13.1359 13.2929 13.0994 13.4512 13.2212C13.8734 13.5419 14.3321 13.7083 14.8518 13.7042C15.3795 13.7042 15.8382 13.5297 16.2401 13.2212C16.3903 13.1075 16.6014 13.1197 16.7232 13.2618C17.3077 13.9153 17.3565 14.7151 17.324 15.5432C17.3159 15.738 17.1575 15.8882 16.9667 15.8882H12.7165Z" fill="white"/>
      <path d="M10.4287 8C11.3502 8 12.1053 8.75912 12.1053 9.68063C12.1053 10.6021 11.3381 11.3694 10.4287 11.3694C9.49912 11.3694 8.73999 10.6021 8.74811 9.66845C8.75217 8.74289 9.49912 8 10.4287 8Z" fill="white"/>
      <path d="M13.4551 11.4476C13.451 10.6884 14.064 10.0592 14.8231 10.047C15.5904 10.0349 16.2237 10.66 16.2277 11.4273C16.2318 12.1986 15.6107 12.8237 14.8434 12.8278C14.0884 12.8359 13.4592 12.2067 13.4551 11.4476Z" fill="white"/>
    </g>
    <path d="M2 6H23" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <defs>
      <clipPath id="clip0_2691_8543">
        <rect width="10.2857" height="8" fill="white" transform="translate(7.35742 8)"/>
      </clipPath>
    </defs>
  </svg>

);
