import { Container, Row, Col} from 'react-bootstrap'

export default function AppFooter() {

  return (
    <Container fluid  className="bg-dark">
      <Row xs={2}>
        <Col><h4>Bamboo</h4></Col>
        <Col><h4 className="color-light">Copyright Jefftimes</h4></Col> 
      </Row>
    </Container>
  )
}