import Swal from 'sweetalert2';

export const showBottomPopup = (
  title: string,
  html: string,
  showCancelButton?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  successCallback?: () => void,
) => {
  Swal.fire({
    position: 'bottom',
    title,
    html,
    iconHtml: '<img src="/images/home/ring.svg">',
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      container: 'p-0',
      popup: 'bottom-popup w-screen !h-[354px]',
      icon: 'border-none bg-[#4776EF14] backdrop-blur-[74.67810821533203px] shadow-[0_0_60px_20px_rgba(59,130,246,0.2)]',
      title: 'text-[20px] leading-[30px] text-[#090909] mt-[0px] font-pretendard',
      htmlContainer: 'text-[12px] leading-[20px]',
      confirmButton: 'order-2 rounded-[8px] bg-[#4776EF] h-[50px] w-[calc(100%-30px)] mx-[10px] my-0',
    },
    didOpen: () => {
      setTimeout(() => {
        document.querySelectorAll('.swal2-container, .swal2-popup').forEach((el) => {
          el.style.zIndex = '9999999'; // Đặt lại z-index cao nhất
          el.style.placeSelf = 'normal';
          el.style.padding = '20px 0 0';
        });
        document.querySelectorAll('.swal2-popup').forEach((el) => {
          el.style.height = '354px';
          el.style.display = 'block';
          el.style.position = 'fixed';
          el.style.bottom = '0';
          el.style.borderBottomLeftRadius = 'unset';
          el.style.borderBottomRightRadius = 'unset';
        });
        document.querySelectorAll('.swal2-icon').forEach((el) => {
          el.style.width = '60px';
          el.style.height = '60px';
        });
        document.querySelectorAll('.swal2-actions').forEach((el) => {
          el.style.marginTop = '30px';
          el.style.marginBottom = '25px';
          el.style.width = '100%';
          el.style.alignItems = 'end';
        });
      }, 0);
    },
  }).then((result) => {
    if (result.isConfirmed) {
      successCallback && successCallback();
    }
  });
};
