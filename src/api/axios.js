import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const configurationRequest = {
	baseURL: 'http://localhost:3000',
	timeout: 5000,
};

const api = axios.create(configurationRequest);
const realApi = axios.create(configurationRequest);

// -------------- interceptors.request --------------

api.interceptors.request.use(
	async (config) => {
		console.log('interceptors.request: fulfilled');

		if (config.skipAuth) {
			delete config.skipAuth;
			return config;
		}

		const token = localStorage.getItem('authToken');

		if (!token) {
			const err = new Error('No token (client)');
			err.code = 'NO_TOKEN';
			return Promise.reject(err);
		}

		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;

		return config;
	},
	(error) => {
		console.warn('Request is cancelled: there is no token');
		return Promise.reject(error);
	}
);

// -------------- mock-server --------------

const mock = new MockAdapter(api, { delayResponse: 500 });

mock.onGet('/users').reply(async (config) => {
	console.log('mock-server: /users');

	const token = config.headers?.Authorization;
	if (!token) {
		return [401, { message: 'No token (mock-server)', code: 'NO_TOKEN' }];
	}

	const response = await realApi.get('/users');
	return [200, response.data];
});

// -------------- interceptors.response --------------

api.interceptors.response.use(
	(response) => {
		console.log('interceptors.response: fulfilled');
		return response;
	},
	(error) => {
		console.log('interceptors.response: rejected');

		if (error.response && error.response.data) {
			return Promise.reject(error.response?.data);
		}

		return Promise.reject({
			message: error.message,
			code: error.code || 'UNKNOWN_ERROR',
		});
	}
);

export default api;
