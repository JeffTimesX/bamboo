import { Container, Row, Col, CloseButton } from 'react-bootstrap'
import { IndexCarousel } from '../components'

export default function Home () {

  return (
    <Container >
      <Row className="justify-content-md-center">
        <Col  >
          <IndexCarousel inputTickers={['T','IBM','BABA']} />
        </Col>
      </Row>
      <Row sm={1} md={1} lg={2} xl={2}>
        <Col >
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
        </Col>
        <Col >
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
        </Col>
      </Row>
    </Container>
  )
}