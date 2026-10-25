import {
  api,
  TOKEN_KEY
} from "./api";

import type {
  LoginResponse,
  User
} from "../types/user";

const USER_KEY =
  "tantsaha_user";

export const authService = {
  async login(
    username: string,
    password: string
  ) {
    const result =
      await api.post<LoginResponse>(
        "/auth/login",
        {
          username,
          password
        }
      );

    localStorage.setItem(
      TOKEN_KEY,
      result.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(
        result.user
      )
    );

    return result.user;
  },

  logout() {
    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );
  },

  getStoredUser():
    User | null {
    const value =
      localStorage.getItem(
        USER_KEY
      );

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(
        value
      ) as User;
    } catch {
      return null;
    }
  },

  setStoredUser(
    user: User
  ) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },

  markPasswordChanged() {
    const user =
      this.getStoredUser();

    if (!user) {
      return;
    }

    this.setStoredUser({
      ...user,
      mustChangePassword: false
    });
  },

  hasToken() {
    return Boolean(
      localStorage.getItem(
        TOKEN_KEY
      )
    );
  }
};
