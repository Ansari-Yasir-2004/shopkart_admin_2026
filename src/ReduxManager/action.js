export const userAuth = (userAuth) => {
  return {
    type: "USER_AUTH",
    payload: userAuth,
  };
};
export const userLogin = (user) => {
  return {
    type:"USER_LOGIN",
    payload: user,
  }

}

export const logoutUser = () => {
  return {
    type: "LOGOUT_USER",
  };
};
