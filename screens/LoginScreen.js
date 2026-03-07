import LoadingOverlay from "../components/ui/LoadingOverLay";
import AuthContent from "../components/Auth/AuthContent";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function LoginScreen() {
  const { loading } = useContext(UserContext);

  if (loading) {
    return <LoadingOverlay message="Logging In..." />;
  }

  return <AuthContent isLogin />;
}

export default LoginScreen;