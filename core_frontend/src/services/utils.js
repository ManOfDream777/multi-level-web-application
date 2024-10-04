import {AES, enc} from 'crypto-js'

const secret_key = 'xss_not_possible'

export const encrypt_data = async data => {
    return AES.encrypt(data, secret_key).toString();
}

export const decrypt_data = async data => {
    return AES.decrypt(data, secret_key).toString(enc.Utf8);
}

export const clear_error_msg = () => {
    const tags = document.querySelectorAll(`small[error_tag]`)
    tags.forEach(tag => {
        tag.textContent = ''
    })
}

export const handle_errors = (validator, e) => {
    const errors = validator.show_errors()
    errors.forEach(error => {
        const key = Object.keys(error)[0]
        const value = error[key]
        const tag = e.target.querySelector(`[error_tag=form_${key}]`)
        tag.textContent = value
    })
}