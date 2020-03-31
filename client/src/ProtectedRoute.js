import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";

import { Context } from './Context';

export default function ProtectedRoute({ permissions, component: Component, ...rest }) {

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

  //console.log({auth})
  
  return (
    <Route {...rest} render={props => {
      if (auth.user.logged === false) {
        props.history.push("/auth")
      } else if (permissions.includes(auth.user.permission)) {
        return <Component {...props} />
      }
      else {
        window.location = "/";
      }
    }
    }>
    </Route>
  );
}


