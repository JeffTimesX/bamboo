
import { 
  Container, 
  Col, 
  InputGroup, 
  FormControl, 
  Row 
} from 'react-bootstrap';

export default function ProfileAuth({authProfile}){
  const authProfileArray = Object.keys(authProfile).map(key=>{
    return(
      <Col key={key}>
        <InputGroup className="mb-4" >
          <InputGroup.Text 
            style={{
              color:'black', 
              boardColor:'#c1c7c7',
              backgroundColor:'white'
            }}
          >
            {key}
          </InputGroup.Text>
          <FormControl
            readOnly
            type="text"
            aria-label={key}
            name={key}
            placeholder={authProfile[key].toString()}
            style={{
              color:'black', 
              boardColor:'#c1c7c7',
              backgroundColor:'white'
            }}
            />
        </InputGroup>
      </Col>       
    )
  })

  return authProfile ? authProfileArray : null

}

