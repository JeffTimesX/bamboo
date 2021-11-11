import { Container, Row, Col} from 'react-bootstrap'
import { IndexCarousel } from '../components'

export default function Home () {

  return (
    <Container >
      <Row className="pu-5 pd-5 ">
        <h3>Today's Recommendations</h3>
      </Row>
      <Row className="justify-content-md-center">
        <Col  >
          <IndexCarousel inputTickers={['T','IBM','BABA']} />
        </Col>
      </Row>
      <Row sm={1} md={1} lg={2} xl={2}>
        <Col >
          <Row className="pu-5 pd-5 ">
            <h3>News</h3>
          </Row>
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
        </Col>
        <Col >
          <Row className="pu-5 pd-5 ">
            <h3>Posts</h3>
          </Row>
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