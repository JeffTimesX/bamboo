import { useState, useEffect } from 'react'
import axios from 'axios'

import {  
  Container, 
  Row, 
  Col, 
  CloseButton, 
  Button, 
} from 'react-bootstrap'

import {
  ProfileAuth,
  ProfileExt,
} from '../components'


/**
 * each time the Profile view is rendered, a user profile populated with the data
 * from auth0 should be passed into as the props.
 * Profile Component useEffect() to query the backend server to findOneAndUpdate()
 * with the current user's auth data', the backend returns the updated profile.
 * Profile then populate the form with the returned profile.
 * when a user presses the 'save' button, it update the profile by setState(profile)
 * then triggers the useEffect() again. 
 */
export default function Profile ({ user }) {
  
  const backendUrl=process.env.REACT_APP_BACKEND_URL
  const profilePath='/user/profile/'
  const portfolioPath='/user/portfolio/'
  const watchesPath='/user/watches'
  
  const [profile, setProfile] = useState(user.profile)
  const [toSave, setToSave] = useState(false)
  const updateProfileUrl= user.profile.auth.sub 
    ? backendUrl + profilePath + user.profile.auth.sub
    : null
  
  // to update the backend profile and get the returned full 
  // profile to populate the view profile.
  useEffect(()=>{
    updateProfileUrl && axios
      .post( updateProfileUrl, {profile})
      .then(response=>{
        console.log("save changes response: ", response.data)
        setProfile(response.data)
      })
  },[toSave])

  // save changes.
  function handleSaveButtonOnClick(event) {
    setToSave(!toSave)
  }

  // gender selected.
  function handleDropdownSelect(eventKey, event) {
    event.preventDefault()
    setProfile(
      {
        auth: profile.auth,
        ext: {
            ...profile.ext,
            [event.target.name]: eventKey
        }
      }
    )
  }

function handleInputChange(event) {
  setProfile({
    auth: profile.auth,      
    ext: { 
      ...profile.ext, 
      [event.target.name]: event.target.value
    }
  })
}

  return updateProfileUrl ? (
    <Container>
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.location('/')}}/>
      </Row>
      <Row className="p-2 justify-content-center"> {/* title */}
        <Col xs='auto' style={{'color': "#e5e5e5"}}>
          {
            profile && profile.auth ? (
              <h3>Welcome {profile.auth.nickname} </h3>
            ) : (
              <h3>Welcome Unknown</h3> 
            )
          }
        </Col>
      </Row>
      <hr />
      {/* auth profile */}
      <Row xs={1} md={2} lg={2} xl={2} className="p-2 justify-content-center ">
        <ProfileAuth authProfile={profile.auth} />
        <div></div>
      </Row>
      <hr />
      {/* extended profile */}
      <Row xs={1} md={2} lg={2} xl={2} className="p-2 justify-content-center "> {/* personal info */}
        <ProfileExt 
          extProfile={profile.ext} 
          handleInputChange={handleInputChange}
          handleDropdownSelect={handleDropdownSelect}
        />
      </Row>
      <hr />
      {/* portfolio */}
      <Row className="p-2 justify-content-center">
        <p>To be replaced by a list of portfolio information.</p>
      </Row>
      <hr />
      {/* watches */}
      <Row className="p-2 justify-content-center">
        <p>To be replaced by a list of watches information.</p>
      </Row>
      <hr />
      {/* exchange accounts */}
      <Row className="p-2 justify-content-center">
        <p>To be replaced by a list of Exchange Account information.</p>
      </Row>
      <hr />
      {/* payment accounts */}
      <Row className="p-2 justify-content-center">
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
  ) : (
    <div>
      <p>user's sub property is missing.</p>
    </div>
  )
}