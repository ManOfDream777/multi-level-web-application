import axios from 'axios';
import {decrypt_data, encrypt_data} from "./utils";

axios.defaults.withCredentials = true
axios.defaults.validateStatus = status => {
    return status <= 500
}

const _set_necessary_data = async (response) => {
    const refresh_token = response.data.refresh
    const access_token = response.data.access
    const role = response.data.role

    localStorage.setItem('access_token', await encrypt_data(access_token))
    localStorage.setItem('refresh_token', await encrypt_data(refresh_token))
    localStorage.setItem('role', await encrypt_data(role))
}

export const signup = async (email, password, password2) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const body = JSON.stringify({email, password, password2})
    const response = await axios.post('http://127.0.0.1:8000/api/signup/', body, config)

    _set_necessary_data(response)

    return {status: response.status}
}

export const login = async (email, password) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const body = JSON.stringify({email, password})
    const response = await axios.post('http://127.0.0.1:8000/api/token/', body, config)

    _set_necessary_data(response)

    return {status: response.status}
}

export const refresh_token = async () => {
    const current_refresh_token = await decrypt_data(localStorage.getItem('refresh_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_refresh_token
        }
    }

    const body = JSON.stringify({})
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', body, config)
    const new_access_token = response.data.access
    localStorage.setItem('access_token', await encrypt_data(new_access_token))
    return {status: response.status}
}

const _checkAuthenticatedWithRefreshToken = async () => {
    let current_refresh_token = localStorage.getItem('refresh_token')
    if (current_refresh_token === null) {
        return false
    }
    current_refresh_token = await decrypt_data(current_refresh_token)
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const body = JSON.stringify({
        refresh: current_refresh_token
    })

    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', body, config)
    if (response.status === 200){
        const new_access_token = response.data.access
        localStorage.setItem('access_token', await encrypt_data(new_access_token))
        return true
    }else if (response.status === 401){
        return false
    }
}

export const checkAuthenticated = async () => {
    let current_access_token = localStorage.getItem('access_token')
    if (current_access_token === null) {
        return false
    }
    current_access_token = await decrypt_data(current_access_token)
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }

    const response = await axios.options('http://127.0.0.1:8000/api/token/verify/', config)

    if (response.data.code === 'user_not_found'){
        localStorage.clear()
        return false
    }

    if (response.status === 200){
        const role = response.data.role
        localStorage.setItem('role', await encrypt_data(role))
        return true
    }else if (response.status === 401){
        return await _checkAuthenticatedWithRefreshToken()
    }
    return false
}