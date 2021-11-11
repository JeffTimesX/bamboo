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
    <Container>
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert("I am still not work.")}}/>
      </Row>
      <Row>
        <h1>Watches</h1>
      </Row>
      <hr />
      <Row>
        <Row sm={2} md={4} lg={4} xl={4}>
          <Col md={3}><h3>Watched Tickers:</h3></Col>
          <Col><h3>{userProfile.watches.length}</h3></Col>
        </Row>
      </Row>
      <hr />
      <Row>
        <WatchesTable  
          watches={ userProfile.watches }
          handleRemoveWatched={ setRemove }
        />
      </Row>
      <hr />
    </Container>
  )
}
