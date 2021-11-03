import {useAuth0} from '@auth0/auth0-react'
import {useHistory} from 'react-router-dom'
import { UserProfileContext } from '../contexts'
import { useContext, useEffect } from 'react'


function AfterAuthorization(){

  const {isAuthenticated, user: auth} = useAuth0()

  const {  
    userProfile,
    updateUserProfile,
    isProfileLoading,
    setIsProfileLoading,
  } = useContext(UserProfileContext)

  useEffect(() => {
    setIsProfileLoading(true)
    updateUserProfile({profile:{auth:auth}})
},[])
  
  console.log("after-auth, isAuthenticated: " + isAuthenticated)
  console.log("after-auth, user: " + JSON.stringify(userProfile))
  

  // direct user to /profile path
  const history = useHistory()
  history.push('/profile')

  return isProfileLoading ? (
    <p>loading</p>
  ): null
}

export default AfterAuthorization