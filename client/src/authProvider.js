import axios from 'axios';

const authProvider = {
  login: async ({ username, password }) => {
    const name = username;
    const body = JSON.stringify({ name, password });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/api/v1/auth/login', body, config);
    if (res.data.token) {
      localStorage.setItem('authenticated', true);
      localStorage.setItem('permissions', res.data.role);
      return Promise.resolve();
    }
  },
  logout: async () => {
    const res = await axios.get('/api/v1/auth/logout');
    if (res.data.success) {
      localStorage.removeItem('authenticated');
      localStorage.removeItem('permissions');
      return Promise.resolve();
    }
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve;
  },
  checkAuth: () => {
    return localStorage.getItem('authenticated')
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: async () => {
    return localStorage.getItem('permissions') === 'tiebou'
      ? await Promise.resolve()
      : await Promise.reject();
  },
};

export default authProvider;
