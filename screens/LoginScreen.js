import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { Login } from "../utils/auth";
import LoadingOverlay from "../components/ui/LoadingOverLay";
import { Alert } from "react-native";
import { UserContext } from "../context/user-context";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const userCtx = useContext(UserContext);
  async function loginHandler({ email: inputMail, password }) {
    setIsAuthenticating(true);
    try {
      const { token, id, email } = await Login(inputMail, password);
      userCtx.authenticate(token);
      userCtx.getUserInfo({ id, email });
    } catch (error) {
      Alert.alert(error);
      setIsAuthenticating(false);
    }
  }
  if (isAuthenticating) {
    return <LoadingOverlay message="Logging In..." />;
  }
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
