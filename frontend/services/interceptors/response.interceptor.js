import Axios from 'axios';

// TODO ADD INTERCEPTOR
Axios.interceptors.response.use((response) => {
    console.log(response.statusCode);
    return response;
}, (error) => {
    console.log(error.status);
})