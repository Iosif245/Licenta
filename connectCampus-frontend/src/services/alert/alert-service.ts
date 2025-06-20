import Swal from 'sweetalert2';
import { ErrorAlertProps } from './types';

const errorAlert = (props: ErrorAlertProps): void => {
  const { title, message } = props;
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    customClass: {
      container: 'swal-z-index-high'
    },
    backdrop: true,
  });
};

const successAlert = (message: string): void => {
  Swal.fire({
    icon: 'success',
    text: message,
    customClass: {
      container: 'swal-z-index-high'
    },
    backdrop: true,
    timer: 1500,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};

const alertService = { errorAlert, successAlert };

export default alertService;
