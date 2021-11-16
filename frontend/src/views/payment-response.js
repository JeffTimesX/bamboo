
import { Redirect, useParams } from 'react-router-dom'

export default function PaymentResponse() {

  const { status } = useParams()

  const allCookies = document.cookie

  // console.log('checking cookies after checkout with stripe: ', allCookies)
  
  // console.log('checking status: ', status)

  // window.alert(`popup ${status}, redirect to your account detail`)

  // redirect user to /profile path
  return <Redirect push to="/profile" /> 
}