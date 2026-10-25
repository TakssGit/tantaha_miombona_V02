import {
  platformRequest
} from "./platform-api";

export type PasswordResetRow = {
  id: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  userId: number;
  username: string;
  fullName: string;
  role: string;
};

export const securityService = {
  forgotPassword(
    username: string
  ) {
    return platformRequest<{
      success: boolean;
      message: string;
    }>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: {
          username
        }
      }
    );
  },

  changePassword(
    currentPassword: string,
    newPassword: string
  ) {
    return platformRequest<{
      success: boolean;
      message: string;
    }>(
      "/auth/change-password",
      {
        method: "POST",
        authenticated: true,
        body: {
          currentPassword,
          newPassword
        }
      }
    );
  },

  resetRequests() {
    return platformRequest<{
      success: boolean;
      requests:
        PasswordResetRow[];
    }>(
      "/admin/password-resets",
      {
        authenticated: true
      }
    );
  },

  approveReset(id: number) {
    return platformRequest<{
      success: boolean;
      message: string;
      temporaryPassword:
        string;
    }>(
      `/admin/password-resets/${id}/approve`,
      {
        method: "POST",
        authenticated: true
      }
    );
  },

  rejectReset(id: number) {
    return platformRequest<{
      success: boolean;
      message: string;
    }>(
      `/admin/password-resets/${id}/reject`,
      {
        method: "POST",
        authenticated: true
      }
    );
  }
};
