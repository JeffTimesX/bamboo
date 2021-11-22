
import { Redirect, useParams } from 'react-router-dom'

export default function PaymentResponse() {

  const { status } = useParams()


  // console.log('checking cookies after checkout with stripe: ', allCookies)
  
  console.log('checking status: ', status)

  // window.alert(`popup ${status}, redirect to your account detail`)

  // redirect user to /profile path

  return status === 'account-updated' 
    ? (
      <Redirect push to="/profile" />
      ) : (
        <p> error: {status} </p>
      )
}