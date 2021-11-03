
import { Col, InputGroup, FormControl } from 'react-bootstrap';

export default function ProfileAuth({authProfile}){
  const authProfileArray = Object.keys(authProfile).map(key=>{
    return(
      <Col key={key}>
        <InputGroup className="mb-4" >
          <InputGroup.Text  className='bg-secondary' style={{color:'white'}}>{key}:</InputGroup.Text>
          <FormControl
            readOnly
            type="text"
            aria-label={key}
            name={key}
            placeholder={authProfile[key].toString()}
            />
        </InputGroup>
      </Col>
    )
  })

  return authProfile ? (authProfileArray) : null

}

