import AuthService from "../../services/auth.service";
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
const AuthVerify = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const decodedJwt = parseJwt(user.accessToken);
      if (decodedJwt && decodedJwt.exp && (decodedJwt.exp * 1000 < Date.now())) {
        var param = {
          refreshToken : user.accessToken,
        };
        AuthService.refresh(param, user).then(
          () => {
            console.log('token refresh.');
            window.location.reload();
          },
          (error) => {
            const resMessage =  (error.response &&  error.response.data &&  error.response.data.message) 
                                          || error.message ||  error.toString();
            console.log(resMessage);
          }
        );
      }
    }
    return user;
};
export default AuthVerify;