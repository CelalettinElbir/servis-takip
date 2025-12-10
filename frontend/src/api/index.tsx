import axios from 'axios';

const API = axios.create({
  baseURL: 'http://10.110.120.12/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı header'a ekleyen fonksiyon
export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

// Request interceptor: Her istekte header'ı ayarla
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);




// Response interceptor: 401 gelirse refresh token ile yeni access token al
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer 401 hatası alındıysa ve daha önce retry yapılmadıysa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Refresh token yok');

        // Refresh token ile yeni access token al
        const res = await axios.post('http://127.0.0.1:8000/api/auth/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);
        setAuthToken(newAccessToken);

        // Orijinal isteği yeni token ile tekrar gönder
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token ile token yenileme başarısız:', refreshError);
        // Eğer refresh token geçersizse kullanıcıyı logout edebilirsin
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // login sayfasına yönlendir
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
