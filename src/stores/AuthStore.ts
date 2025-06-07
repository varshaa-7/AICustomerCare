import { makeAutoObservable } from 'mobx';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  
  private apiUrl = 'http://localhost:5000/api';

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  loadFromStorage() {
    const savedToken = localStorage.getItem('chat-token');
    const savedUser = localStorage.getItem('chat-user');
    
    if (savedToken && savedUser) {
      this.token = savedToken;
      this.user = JSON.parse(savedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await axios.post(`${this.apiUrl}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      this.token = token;
      this.user = user;
      
      localStorage.setItem('chat-token', token);
      localStorage.setItem('chat-user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (error: any) {
      this.error = error.response?.data?.error || 'Login failed';
    } finally {
      this.isLoading = false;
    }
  }

  async register(email: string, password: string, name: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await axios.post(`${this.apiUrl}/auth/register`, {
        email,
        password,
        name
      });

      const { token, user } = response.data;
      
      this.token = token;
      this.user = user;
      
      localStorage.setItem('chat-token', token);
      localStorage.setItem('chat-user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (error: any) {
      this.error = error.response?.data?.error || 'Registration failed';
    } finally {
      this.isLoading = false;
    }
  }

  async demoLogin() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await axios.post(`${this.apiUrl}/auth/demo`);
      const { token, user } = response.data;
      
      this.token = token;
      this.user = user;
      
      localStorage.setItem('chat-token', token);
      localStorage.setItem('chat-user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (error: any) {
      this.error = error.response?.data?.error || 'Demo login failed';
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    this.error = null;
    
    localStorage.removeItem('chat-token');
    localStorage.removeItem('chat-user');
    
    delete axios.defaults.headers.common['Authorization'];
  }

  clearError() {
    this.error = null;
  }

  get isAuthenticated() {
    return !!this.user && !!this.token;
  }
}

export const authStore = new AuthStore();