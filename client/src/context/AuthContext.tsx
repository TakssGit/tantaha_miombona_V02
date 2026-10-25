import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  authService
} from "../services/auth.service";

import type {
  User
} from "../types/user";

interface AuthContextValue {
  user: User | null;
  authenticated: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshStoredUser: () => void;
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({
  children
}: Props) => {
  const [user, setUser] =
    useState<User | null>(
      authService.getStoredUser()
    );

  const login =
    useCallback(
      async (
        username: string,
        password: string
      ) => {
        const result =
          await authService.login(
            username,
            password
          );

        setUser(result);
      },
      []
    );

  const logout =
    useCallback(() => {
      authService.logout();
      setUser(null);
    }, []);

  const refreshStoredUser =
    useCallback(() => {
      setUser(
        authService.getStoredUser()
      );
    }, []);

  const authenticated =
    Boolean(
      user &&
        authService.hasToken()
    );

  const value =
    useMemo(
      () => ({
        user,
        authenticated,
        isAuthenticated:
          authenticated,
        loading: false,
        login,
        logout,
        refreshStoredUser
      }),
      [
        user,
        authenticated,
        login,
        logout,
        refreshStoredUser
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};
