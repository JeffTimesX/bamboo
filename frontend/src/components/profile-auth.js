
import { Col, InputGroup, FormControl } from 'react-bootstrap';

export default function ProfileAuth({authProfile}){
  const authProfileArray = Object.keys(authProfile).map(key=>{
    return(
      <Col>
        <InputGroup className="mb-4">
          <InputGroup.Text id={"profile-auth-"+key} className='bg-secondary' style={{color:'white'}}>{key}:</InputGroup.Text>
          <FormControl
            readOnly
            type="text"
            aria-label={key}
            name={key}
            value={authProfile[key]}
            />
        </InputGroup>
      </Col>
    )
  })

  return authProfile ? (authProfileArray) : null

}

