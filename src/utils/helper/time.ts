export function getFormattedDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() trả về từ 0-11 nên cần +1
  const day = now.getDate();

  return `${year}년 ${month}월 ${day}일`;
}
export function convertDateTimeToKoreanFormat(dateTimeStr: string): string {
  const koreanWeekdays: { [key: string]: string } = {
    Monday: '월',
    Tuesday: '화',
    Wednesday: '수',
    Thursday: '목',
    Friday: '금',
    Saturday: '토',
    Sunday: '일',
  };

  // Parse thành Date từ chuỗi ISO, đảm bảo có 'T' giữa ngày và giờ
  const dateObj = new Date(dateTimeStr.replace(' ', 'T'));

  // Lấy weekday bằng ngôn ngữ English để map sang tiếng Hàn
  const weekdayEn = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const weekday = koreanWeekdays[weekdayEn];

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Format số có padding
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}(${weekday}) ${hours}:${minutes}`;
}
export function convertDateTimeToKoreanFormat2(dateTimeStr: string): string {
  const koreanWeekdays: { [key: string]: string } = {
    Monday: '월요일',
    Tuesday: '화요일',
    Wednesday: '수요일',
    Thursday: '목요일',
    Friday: '금요일',
    Saturday: '토요일',
    Sunday: '일요일',
  };

  // Parse thành Date từ chuỗi ISO, đảm bảo có 'T' giữa ngày và giờ
  const dateObj = new Date(dateTimeStr.replace(' ', 'T'));

  // Lấy weekday bằng ngôn ngữ English để map sang tiếng Hàn
  const weekdayEn = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const weekday = koreanWeekdays[weekdayEn];

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Format số có padding
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}
export function formatTimeNow(): string {
  const now = new Date();

  // Format hours and minutes
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const amPm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  // Format date
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);

  // Format time string
  return `${hours}:${minutes.toString().padStart(2, '0')}${amPm} • ${formattedDate}`;
}


export function convertDateTimeHistory(dateTimeStr: string): string {
  const koreanWeekdays: { [key: string]: string } = {
    Monday: '월요일',
    Tuesday: '화요일',
    Wednesday: '수요일',
    Thursday: '목요일',
    Friday: '금요일',
    Saturday: '토요일',
    Sunday: '일요일',
  };

  // Parse thành Date từ chuỗi ISO, đảm bảo có 'T' giữa ngày và giờ
  const dateObj = new Date(dateTimeStr.replace(' ', 'T'));

  // Format số có padding
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

export function formatDateToYYYYMMDD(isoString: string) {
  const [yyyy, mm, dd] = isoString.substring(0, 10).split('-');
  return `${yyyy}.${mm}.${dd}`;
}
