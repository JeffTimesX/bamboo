import { Container, Row, Col} from 'react-bootstrap'
import { IndexCarousel, NewsBlock, PostBlock } from '../components'

export default function Home () {

  return (
    <Container className="min-vh-100">
      <Row className="pt-2 pb-3 ">
        <h3>Today's Recommendations</h3>
      </Row>
      <Row 
        className="d-flex justify-content-center pt-3 pb-3 mb-3"
        style={{border:"1px solid", borderColor: "green"}}
      >
        <IndexCarousel inputTickers={['T','IBM','BABA']} />
      </Row>
      <Row xs={1} sm={1} md={1} lg={2} className="p-2 justify-content-center" >
        <Col className="ps-1 pe-5">
          <Row >
            <h3>News</h3>
          </Row>
          <Row style={{height: '40vh', overflow: 'scroll'}}>
            <NewsBlock />
          </Row>
          
        </Col>
        <Col className="ps-1 pe-5">
          <Row >
            <h3>Posts</h3>
          </Row>
          <Row style={{height: '40vh', overflow: 'scroll'}}>
            <PostBlock />
          </Row>
        </Col>
      </Row>
    </Container>
  )
}