import React, { 
  useState, 
  useEffect, 
  useContext 
} from 'react';

import { 
  CloseButton,
  Container,
  Row, 
  Col 
} from 'react-bootstrap'


import { UserProfileContext } from '../contexts'

import { WatchesTable } from '../components'

export default function Watches() {

  const {
    userProfile,
    removeFromWatches, 
  } = useContext(UserProfileContext)

  const [remove, setRemove] = useState(null)

  useEffect(() =>{ 

    if(remove){
      removeFromWatches(remove)
      setRemove(null)
    }
  },[remove])
  
  return (
    <Container className="min-vh-100">
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert("I am still not work.")}}/>
      </Row>
      <Row style={{textAlign: "center"}}>
        <h3>Watches</h3>
      </Row>
      <hr />
      <Row>
        <Row sm={2} >
          <Col><h6>Total Watched:</h6></Col>
          <Col className="pe-3 d-flex justify-content-end"><h6>{userProfile.watches.length}</h6></Col>
        </Row>
      </Row>
      
      <Row>
        <WatchesTable  
          watches={ userProfile.watches }
          handleRemoveWatched={ setRemove }
        />
      </Row>
    
    </Container>
  )
}
