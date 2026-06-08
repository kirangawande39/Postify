import API from './api';

export const userLoginVerify=()=>{
   return API.get('/api/auth/check');
}
export const loginUser = (data) => {
  return API.post(`/api/auth/login`, data)
}

export const forgotPassword = (data) => {
  return API.post(`/api/auth/forgot-password`, data);
}

export const emailExists = (data) => {
  return API.post(`/api/auth/check-email`, data);
}

export const sendOtp = (data) => {
  return API.post("/api/auth/send-otp", data);
}

export const verifyOtp = (data) => {
  return API.post("/api/auth/verify-otp", data);
}

export const registerFormSubmit = (data) => {
  return API.post("/api/auth/register", data);
}

export const resetPassword = (data) => {
  return API.post("/api/auth/reset-password", data);
}

export const logoutUser = () => {
    return API.post(`/api/auth/logout`,
        {},
    )

}