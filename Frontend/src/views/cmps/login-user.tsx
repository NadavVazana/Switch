import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import loggedInUser from "../../atoms/logged-in-user";
import { userService } from "../../services/user.service";

function LoginUser() {
  const setLoggedInUser = useSetRecoilState(loggedInUser);
  useEffect(() => {
    const loggedUser = userService.getLoggedInUser();
    if (loggedUser) {
      setLoggedInUser(loggedUser);
    }
  }, [setLoggedInUser]);
  return <React.Fragment></React.Fragment>;
}

export default LoginUser;
