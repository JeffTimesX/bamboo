// react hooks
import { 
  useState, 
  useContext 
} from 'react'

// bootstrap components
import {  
  Container, 
  Row, 
  Col, 
  CloseButton, 
  Button, 
} from 'react-bootstrap'

// profile sub components
import {
  ProfileAuth,
  ProfileExt,
  ProfileTable,
  Loading,
} from '../components'

// to be replaced by UserProfileContext which defined in UserProfileProvider
import {
  UserProfileContext,  
} from '../contexts'

// to be replaced by the { isProfileChanged } in the UserProfileContext 
import {useAuth0} from '@auth0/auth0-react'


export default function Profile () {

  const { isAuthenticated } = useAuth0()

  const {
    userProfile,
    isProfileLoading,
    updateProfileExt,
  } = useContext(UserProfileContext)
  
  const [user, setUser] = useState(userProfile)

  console.log('user profile in the profile path: ', userProfile)
  console.log('is authenticated in the profile path: ', isAuthenticated)
  console.log('is loading in the profile: ', isProfileLoading)

  function handleSaveButtonOnClick(event) {
    event.preventDefault()
    console.log('user profile passing to updateProfileExt: ', user.profile.ext)
    updateProfileExt(user.profile.ext)
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

  return (!isProfileLoading) ? (
    <Container>
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.location('/')}}/>
      </Row>
      <Row className="p-2 justify-content-center"> {/* title */}
        <Col xs='auto' style={{'color': "#e5e5e5"}}>
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
      <Row xs={1} md={2} lg={2} xl={2} className="p-2 justify-content-center ">
        <Col sm={12} md={12} lg={12} xl={12}>
          <h3> From Auth0 </h3>
        </Col>
        <ProfileAuth authProfile={user.profile.auth} />
        <Col></Col>
      </Row>
      <hr />
      {/* extended profile */}
      <Row xs={1} md={2} lg={2} xl={2} className="p-2 justify-content-center "> {/* personal info */}
        <Col sm={12} md={12} lg={12} xl={12}>
          <h3> General Information </h3>
        </Col>
        <ProfileExt 
          extProfile={user.profile.ext} 
          handleInputChange={handleInputChange}
          handleDropdownSelect={handleDropdownSelect}
        />
      </Row>
      <hr />
      {/* portfolio */}
      <Row className="p-2 justify-content-center">
        <Col sm={12} md={12} lg={12} xl={12}>
          <h3>Portfolio</h3>
        </Col>
        <ProfileTable 
          array={user.portfolio}
          firstHeadTitle="Ticker"
          secondHeadTitle="Inventory"
        />
      </Row>
      <hr />
      {/* watches */}
      <Row className="p-2 justify-content-center">
        <Col sm={12} md={12} lg={12} xl={12}>
          <h3>Watches</h3>
        </Col>
        <ProfileTable 
          array={user.watches} 
          firstHeadTitle="Ticker"
          secondHeadTitle="Watched_At" 
        />
      </Row>
      <hr />
      {/* exchange accounts */}
      <Row className="p-2 justify-content-center">
        <h3>Exchange Account Information</h3>
        <p>To be replaced by a list of Exchange Account information.</p>
      </Row>
      <hr />
      {/* payment accounts */}
      <Row className="p-2 justify-content-center">
        <h3>Payment Account Information</h3>
        <p>To be replaced by a list of Bank Account information.</p>
      </Row>
      <hr />
      {/* save change button */}
      <Row className="p-2 justify-content-end">
        <Col sm={6}>
        </Col>
        <Col sm={6} className='justify-content-end'>
          <Button 
          variant="success"
          onClick={handleSaveButtonOnClick}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    </Container>
  ): (<Loading/>)
}