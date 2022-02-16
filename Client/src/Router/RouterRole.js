import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import NotFound from '../Components/Notfound';

const RouterRole = (link, component) => {
  const auth = useSelector(state => state.auth);
  const role = auth.user.role;
  const path = link;
  const cpn = component;
  return <Route path={path} exact component={role === 0 ? NotFound : cpn}
  // render={()=> (role === 0  ? <Redirect to={"/notfound"}/> : "") }
  >
  {/* {role === 0  ? <Redirect to={"/notfound"}/> : component} */}
  </Route>
};

export default RouterRole;
