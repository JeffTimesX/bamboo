import { 

  Col, 
  InputGroup, 
  FormControl, 

} from 'react-bootstrap';

import { DateTime } from 'luxon'


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
            placeholder={key === 'updated_at' ? DateTime.fromISO(authProfile[key]).toFormat('yyyy-MM-dd HH:mm:ss') : authProfile[key].toString()}
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

