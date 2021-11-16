

import { Redirect } from 'react-router-dom'

export default function AfterAuthorization(){

  return <Redirect push to="/profile" />
}

