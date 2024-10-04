import axios from 'axios';
import {decrypt_data} from "./utils";
import {checkAuthenticated} from "./auth";

axios.defaults.withCredentials = true
axios.defaults.validateStatus = status => {
    return status <= 500
}
// I will not handle error like 500, 400, 401, or any other status, because I don't want to implement more UI.
export const get_my_blogs = async () => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const response = await axios.get('http://127.0.0.1:8000/blog/', config)
    if (response.status === 200) {
        if (!response.data){
            return []
        }
        return response
    }else if (response.status === 404){
        return null
    }else{
        await checkAuthenticated()
        return await get_my_blogs()
    }
}

export const create_new_blog = async (title, blog_body, is_draft) => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const body = JSON.stringify({'title': title, 'body': blog_body, 'is_draft': is_draft})
    const response = await axios.post('http://127.0.0.1:8000/blog/create/', body, config)
    if (response.status === 201) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await create_new_blog(title, blog_body, is_draft)
    }
}

export const edit_blog = async (blog_id, title, blog_body, is_draft) => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const role = await decrypt_data(localStorage.getItem('role'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const body = JSON.stringify({'title': title, 'body': blog_body, 'is_draft': is_draft})

    let url = `http://127.0.0.1:8000/blog/${blog_id}/update/`
    if (role === 'admin'){
        url = `http://127.0.0.1:8000/api/admin/blog/${blog_id}/update/`
    }
    const response = await axios.put(url, body, config)
    if (response.status === 200) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await edit_blog(blog_id, title, blog_body, is_draft)
    }
}

export const delete_blog = async blog_id => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const role = await decrypt_data(localStorage.getItem('role'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    let url = `http://127.0.0.1:8000/blog/${blog_id}/delete/`

    if (role === 'admin'){
        url = `http://127.0.0.1:8000/api/admin/blog/${blog_id}/delete/`

    }
    const response = await axios.delete(url, config)
    if (response.status === 204) {
        return true
    }else if (response.status === 401){
        await checkAuthenticated()
        return await delete_blog(blog_id)
    }
}

export const get_news = async () => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const response = await axios.get('http://127.0.0.1:8000/news/', config)
    if (response.status === 200) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await get_news()
    }
}

export const get_blog = async (blog_id) => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const response = await axios.get(`http://127.0.0.1:8000/blog/${blog_id}`, config)
    if (response.status === 200) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await get_blog(blog_id)
    } else if (response.status === 404){
        return {data: {}}
    }
}

export const evaluate_the_blog = async (blog_id, state, isUpdation) => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const body = JSON.stringify({'blog_id': blog_id, 'state': state,})
    let response
    if (!isUpdation){
        response = await axios.post(`http://127.0.0.1:8000/blog/${blog_id}/evaluate/`, body, config)
    }else {
        response = await axios.put(`http://127.0.0.1:8000/blog/${blog_id}/evaluate/`, body, config)
    }
    if (response.status === 200) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await evaluate_the_blog(blog_id, state, isUpdation)
    } else if (response.status === 202){
        return response
    }
}

export const create_comment = async (blog_id, comment) => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const body = JSON.stringify({'body': comment, 'blog_id': blog_id})
    const response = await axios.post(`http://127.0.0.1:8000/blog/${blog_id}/create_comment/`, body, config)
    if (response.status === 201) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await create_comment(blog_id, comment)
    }else{
        return response
    }
}

export const subscribe_to_author = async (blog_id) => {
    const current_access_token = await decrypt_data(localStorage.getItem('access_token'))
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + current_access_token
        }
    }
    const body = JSON.stringify({'blog_id': blog_id})
    const response = await axios.post(`http://127.0.0.1:8000/blog/${blog_id}/subscribe/`, body, config)
    if (response.status === 201) {
        return response
    }else if (response.status === 401){
        await checkAuthenticated()
        return await subscribe_to_author(blog_id)
    }else{
        return response
    }
}