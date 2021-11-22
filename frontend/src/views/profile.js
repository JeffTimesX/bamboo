// react hooks
import { 
  useState, 
  useContext,
  useEffect,
} from 'react'

// bootstrap components
import {  
  Container, 
  Row, 
  Col, 
  CloseButton, 
} from 'react-bootstrap'

// profile sub components
import {
  ProfileAuth,
  ProfileExt,
  ProfileExchangeAccountsWithStripe,
} from '../components'

// to be replaced by UserProfileContext which defined in UserProfileProvider
import {
  UserProfileContext,  
} from '../contexts'

import {useAuth0} from '@auth0/auth0-react'

export default function Profile () {

  const {
    userProfile,
    updateUserProfile,
  } = useContext(UserProfileContext)

  const {isAuthenticated} = useAuth0()
  
  const [user, setUser] = useState(userProfile)
  const [save, setSave] = useState(false)

  // processing save profile corresponds to the save button click.
  useEffect(() => {
    if(save){
      updateUserProfile(user)
      setSave(false)
    }
    //setUser(userProfile)
  },[save])

  // save button click
  function handleSave (event){
    event.preventDefault()
    setSave(true)
  }

  // gender selected.
  function handleDropdownSelect(eventKey, event) {
    event.preventDefault()
    setUser({
      ...user,
      profile:{
        auth: user.profile.auth,
        ext: {
            ...user.profile.ext,
            [event.target.name]: eventKey
        }
      }
    })
  }

// first name, last name, date of birth inputs.
  function handleInputChange(event) {
    event.preventDefault()
    setUser({
      ...user,
      profile:{
        auth: user.profile.auth,
        ext: {
          ...user.profile.ext,
          [event.target.name]: event.target.value
        }
      }
    })
  }

  // console.log("Profile() checking isAuthenticated and isLoading: ", isAuthenticated, isLoading)

  return isAuthenticated && (
    <Container>
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert("I am still not work.")}}/>
      </Row>
      <Row className="p-2 justify-content-center"> {/* title */}
        <Col xs='auto' style={{'color': "#e5e5e5"}}>
          {
            user && user.profile && user.profile.auth ? (
              <h1>Welcome {user.profile.auth.nickname} </h1>
            ) : (
              <h3>Welcome Unknown</h3> 
            )
          }
        </Col>
      </Row>
      <hr />
      {/* auth profile */}
      <Row xs={1} md={2} lg={2} xl={2} className="p-2 justify-content-center ">
        <Col sm={12} md={12} lg={12} xl={12}>
          <h3> From Auth0 </h3>
        </Col>
        <ProfileAuth authProfile={user.profile.auth} />
        <Col></Col>
      </Row>
      <hr />
      {/* extended profile */}
      <ProfileExt 
        extProfile={user.profile.ext} 
        handleInputChange={handleInputChange}
        handleDropdownSelect={handleDropdownSelect}
        handleSave={handleSave}
      />
      <hr />

      {/* exchange accounts */}
      <ProfileExchangeAccountsWithStripe 
        userId={ userProfile._id }
        accounts={ userProfile.exchangeAccounts }
      />
      <hr />
      {/* account transactions */}
      <Row className="p-2 justify-content-center">
        <h3>Transactions</h3>
        <p>To be replaced by a list of chosen Account transactions.</p>
      </Row>
      <hr />
      
    </Container>
  )
}