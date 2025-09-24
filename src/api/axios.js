import axios from 'axios';
import MockAdapter from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3000',
	timeout: 5000,
});

// -------------- interceptors.request --------------

api.interceptors.request.use(async (config) => {
	const token = localStorage.getItem('authToken');

	if (!token) {
		const err = new Error('No token');
		err.code = 'NO_TOKEN';
		return Promise.reject(err);
	}

	return config;
});

export default api;
