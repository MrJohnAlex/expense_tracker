import axios from "axios";
const API_KEY = "AIzaSyC91sohDOQJR3-GYPcavmLiqNkyw6vKTW4";

export const authenticate = async (mode, email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return {
    token: response.data.idToken,
    id: response.data.localId,
    email: response.data.email,
  };
};

export const CreateUser = (email, password) => {
  return authenticate("signUp", email, password);
};
export const Login = (email, password) => {
  return authenticate("signInWithPassword", email, password);
};
