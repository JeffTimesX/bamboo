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
    <Container className="min-vh-100">
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert("I am still not work.")}}/>
      </Row>
      <Row className="p-2 justify-content-center"> {/* title */}
        <Col xs='auto' style={{'color': "#212121"}}>
          {
            user && user.profile && user.profile.auth ? (
              <h3>Welcome {user.profile.auth.nickname} </h3>
            ) : (
              <h3>Welcome Unknown</h3> 
            )
          }
        </Col>
      </Row>
      <hr />
      {/* auth profile */}
      <Container>
        <Row>
          <Col className="ps-4">
            <h5> Authentication </h5>
          </Col>
        </Row>
        <Row xs={1} md={2} className="p-2 justify-content-center ">
          
          <ProfileAuth authProfile={user.profile.auth} />
          <Col></Col>
        </Row>
      </Container>
      
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
      
    </Container>
  )
}