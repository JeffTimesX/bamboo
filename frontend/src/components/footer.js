import { Container, Navbar, Row, Col} from 'react-bootstrap'

export default function AppFooter() {

  return (
    
    <div className="bg-secondary">
    
      <Row sm={1} md={2}
        className="d-flex align-items-center"    
        style={{height:"6vh"}}>
        <Col
          className="ps-5 align-items-center"
          style={{color:"turquoise"}}
        >
          Bamboo
          </Col>
        <Col 
          className="pe-5 d-flex justify-content-end align-items-center" 
          style={{color:"turquoise"}}
        >
          Copyright(c) Jefftimes Technologies, 2021.
        </Col> 
      </Row>
    </div>
    
  )
}