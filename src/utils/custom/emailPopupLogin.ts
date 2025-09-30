import { showNoticeMUI } from '@/app/components/common/noticeMui';
import Swal from 'sweetalert2';

export const emailPopupLogin = async (
  title: string,
  input?: string,
  showCancelButton?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  cancelButtonCallback?: (value: string) => void,
  successCallback?: (value: string) => void,
  icon?: string,
) => {
  Swal.fire({
    title,
    input,
    iconHtml: `<img src="/images/home/${icon || "enter_coupon"}.gif">`,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: `coupon-popup rounded-[30px] w-[472px] h-[380px] pt-12${input ? '' : ' coupon-notice'}`,
      icon: 'border-none mt-1',
      title: 'text-[21px] leading-[30px] text-[#090909] font-pretendard',
      input: '!w-[331px] h-[40px] border-[2px] border-[#F1F1F1] rounded-[10px]',
      // actions: input ? '' : "!mt-[70px]",
      cancelButton:
        'order-1 right-gap rounded-[36px] bg-[#E7E7E7] text-[#6A6A6A] h-[50px] w-[158px] mx-[10px] my-0',
      confirmButton: 'order-2 rounded-[36px] bg-[#272727] h-[50px] w-[158px] mx-[10px] my-0',
    },
    didOpen: () => {
      setTimeout(() => {
        document.querySelectorAll('.swal2-container, .swal2-popup').forEach(el => {
          el.style.zIndex = '9999999'; // Đặt lại z-index cao nhất
        });
      }, 0);
    }
  }).then((result) => {
    if (result.isDismissed) {
      cancelButtonCallback && cancelButtonCallback(result?.value);
      return false; // giữ popup mở
    }

    if (result.isConfirmed) {
      successCallback && successCallback(result?.value);
    }
  });
};
