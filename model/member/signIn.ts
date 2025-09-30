// 로그인
export interface MemberLoginFormModel {
  point: number | undefined;
  loginDefaultInfoId: string; // 아이디
  loginDefaultInfoPassword: string; // 비밀번호
}

// 로그인 사용자 정보
export interface MemberTokenFormModel {
  idx?: number;
  type?: number;
  name?: string;
  nickname?: string;
  email?: string;
  phone?: number;
  file_path?: any;
  // Business
  company_idx?: number;
  company_type?: number;
  is_master?: number;

  // User
  point?: number;
  is_auth_nice?: number;
  is_verify_email?: boolean;

  // ETC
  msg?: string;
  token: string;
  refresh_token: string;
}

// 비밀번호 찾기
export interface MemberPwFindModel {
  email: string;
  manager_name: string;
}

// 비밀번호 재설정
export interface MemberPwRestModel {
  password: string;
  re_password: string;
  name: string;
  passwordCertificate: string;
}
