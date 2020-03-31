import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";

import { Context } from './Context';

export default function ProtectedRoute({ permission, component: Component, ...rest }) {

  const auth = useContext(Context);

  // useEffect(() => {
  //   if (authorized)
  //     return;

  //   (async () => {
  //     if (await auth.isLogged()) {
  //       console.log("setting true");

  //       setAuthorized(true);
  //     } else if (!window.location.href.endsWith("/login")) {
  //       window.location = "/login";
  //     }
  //   })();
  // }, [])

  return (
    <Route {...rest} render={props => {
      if (auth.user.permission === permission) {
        return <Component {...props} />
      }
      else {
        props.history.push("/auth")
      }
    }
    }>
    </Route>
  );
}


