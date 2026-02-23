import { useContext, useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import { CreateUser } from "../utils/auth";
import LoadingOverlay from "../components/ui/LoadingOverLay";
import { UserContext } from "../context/user-context";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const userCtx = useContext(UserContext);
  async function singUpHandler({ email: inputEmail, password }) {
    setIsAuthenticating(true);
    try {
      const { token, id, email } = await CreateUser(inputEmail, password);
      userCtx.authenticate(token);
      userCtx.getUserInfo(id, email);
    } catch (error) {
      Alert.alert(error);
      setIsAuthenticating(false);
    }
  }
  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }
  return <AuthContent onAuthenticate={singUpHandler} />;
}

export default SignupScreen;
