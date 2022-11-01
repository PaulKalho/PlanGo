import axios, { Axios } from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
	withCredentials: true,
    headers: {
        Authorization: localStorage.getItem('access')
            ? 'Bearer ' + localStorage.getItem('access')
            : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});


axiosInstance.interceptors.request.use(
	async req => {
		return req;
	},
	(error) => {
		return Promise.reject(error);
	}
)

axiosInstance.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		const originalRequest = err.config;
		console.log(originalRequest);

		if(err.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				console.log("Trying to refresh Tokens");

				const rs = await axiosInstance
								.post('auth/jwt/refresh', {refresh: localStorage.getItem("refresh")})
				
				const accessToken = rs.data.access;
				localStorage.setItem('access', accessToken);
				axiosInstance.defaults.headers['Authorization'] =
					"Bearer " + accessToken;

				originalRequest.headers['Authorization'] =
					"Bearer " + accessToken;

				console.log(originalRequest);
				return axiosInstance(originalRequest);
			}catch(_error) {
				axiosInstance.defaults.headers.common['Authorization'] = ''
				localStorage.removeItem('access')
				localStorage.removeItem('refresh')
			  
				return Promise.reject(_error);
			}
		}
		return Promise.reject(err);

	}
)


// axiosInstance.interceptors.response.use(
// 	(response) => {
// 		return response;
// 	},
// 	async function (error) {
// 		const originalRequest = error.config;
		
// 		if (typeof error.response === 'undefined') {
// 			alert(
// 				'A server/network error occurred. ' +
// 					'Looks like CORS might be the problem. ' +
// 					'Sorry about this - we will get it fixed shortly.'
// 			);
// 			return Promise.reject(error);
// 		}

// 		if (
// 			error.response.status === 401 &&
// 			originalRequest.url === baseURL + 'auth/jwt/refresh/'
// 		) {
// 			window.location.href = '/login/';
// 			return Promise.reject(error);
// 		}

// 		if (
// 			error.response.data.code === 'token_not_valid' &&
// 			error.response.status === 401 &&
// 			error.response.statusText === 'Unauthorized'
// 		) {
// 			const refreshToken = localStorage.getItem('refresh');

// 			if (refreshToken) {
// 				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
// 				// exp date in token is expressed in seconds, while now() returns milliseconds:
// 				const now = Math.ceil(Date.now() / 1000);
// 				console.log(tokenParts.exp);

// 				if (tokenParts.exp > now) {
// 					return axiosInstance
// 						.post('auth/jwt/refresh/', { refresh: refreshToken })
// 						.then((response) => {
// 							localStorage.setItem('access', response.data.access);
// 							localStorage.setItem('refresh', response.data.refresh);

// 							axiosInstance.defaults.headers['Authorization'] =
// 								'Bearer ' + response.data.access;
// 							originalRequest.headers['Authorization'] =
// 								'Bearer ' + response.data.access;

// 							return axiosInstance(originalRequest);
// 						})
// 						.catch((err) => {
// 							console.log(err);
// 						});
// 				} else {
// 					console.log('Refresh token is expired', tokenParts.exp, now);
// 					window.location.href = '/login/';
// 				}
// 			} else {
// 				console.log('Refresh token not available.');
// 				window.location.href = '/login/';
// 			}
// 		}

// 		// specific error handling done elsewhere
// 		return Promise.reject(error);
// 	}
// );

// axiosInstance.interceptors.response.use(
// 	(response) => {
// 		return response;
// 	},
// 	async function (error) {
// 		const originalRequest = error.config;
		
// 		// if (typeof error.response === 'undefined') {
// 		// 	alert(
// 		// 		'A server/network error occurred. ' +
// 		// 			'Looks like CORS might be the problem. ' +
// 		// 			'Sorry about this - we will get it fixed shortly.'
// 		// 	);
// 		// 	return Promise.reject(error);
// 		// }

// 		if (
// 			error.response.status === 401 &&
// 			originalRequest.url === baseURL + 'auth/jwt/refresh/'
// 		) {
// 			window.location.href = '/login/';
// 			return Promise.reject(error);
// 		}

// 		if (
// 			error.response.data.code === 'token_not_valid' &&
// 			error.response.status === 401 &&
// 			error.response.statusText === 'Unauthorized'
// 		) {
// 			const refreshToken = localStorage.getItem('refresh');
// 			//console.log("refresh");
// 			if (refreshToken) {
// 				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

// 				// exp date in token is expressed in seconds, while now() returns milliseconds:
// 				const now = Math.ceil(Date.now() / 1000);
// 				console.log(tokenParts.exp);

// 				if (tokenParts.exp > now) {
// 					return axiosInstance
// 						.post('auth/jwt/refresh/', { refresh: refreshToken })
// 						.then((response) => {
// 							localStorage.setItem('access', response.data.access);
// 							localStorage.setItem('refresh', response.data.refresh);

// 							axiosInstance.defaults.headers['Authorization'] =
// 								'Bearer ' + response.data.access;
// 							originalRequest.headers['Authorization'] =
// 								'Bearer ' + response.data.access;

// 							return axiosInstance(originalRequest);
// 						})
// 						.catch((err) => {
// 							console.log(err);
// 						});
// 				} else {
// 					console.log('Refresh token is expired', tokenParts.exp, now);
// 					window.location.href = '/login/';
// 				}
// 			} else {
// 				console.log('Refresh token not available.');
// 				window.location.href = '/login/';
// 			}
// 		}

// 		// specific error handling done elsewhere
// 		return Promise.reject(error);
// 	}
// );

export default axiosInstance;