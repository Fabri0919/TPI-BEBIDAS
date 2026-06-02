export const initialLoginFormErrors = {
  email: false,
  password: false,
};

export const initialRegisterFormErrors = {
  name: false,
  email: false,
  password: false,
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;