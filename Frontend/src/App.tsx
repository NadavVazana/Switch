import "./style/main.scss";
import { RecoilRoot } from "recoil";
import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import UserMessage from "./views/cmps/user-msg";
import LoginUser from "./views/cmps/login-user";
import React from "react";

function App() {

  return (
    <React.StrictMode>
      <RecoilRoot>
        <LoginUser />
        <section className="app">
          <Routes>
            {routes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            })}
          </Routes>
          <UserMessage />
        </section>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
