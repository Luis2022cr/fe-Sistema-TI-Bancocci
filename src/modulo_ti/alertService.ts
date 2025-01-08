import Swal from 'sweetalert2';

export const Alert = (
    title: string,
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question',
    confirmButtonText: string = 'OK',
    callback?: () => void
) => {
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
    }).then(() => {
        if (callback) {
            callback();
        }
    });
};
