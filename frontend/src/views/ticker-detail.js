import { Container, Row, Col, CloseButton, Button, } from 'react-bootstrap'
export default function TickerDetail () {

  return (
    <Container>
      <Row className="ps-2">
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert('close detail')}}/>
      </Row>
      <Row className="p-2 justify-content-center">
        <Col xs='auto' >
          <h3>To be replaced with Ticker Title </h3>
        </Col>
      </Row>
      <Row className="p-2 justify-content-center ">
        <Col lg={4}>
          <p>this placeholder will be replaced with TickerDetailChart</p>
        </Col>
      </Row>
      <Row className="p-2 justify-content-center">
        <Col md={4}>
          <p>Open:</p>
        </Col>
        <Col md={4}>
          <p>High:</p>
        </Col>
        <Col md={4}>
        <p>Inventory:</p>
        </Col>
        <Col md={4}>
        <p>Close:</p>
        </Col>
        <Col md={4}>
        <p>Low:</p>
        </Col>
        <Col md={4}>
        <p>Value:</p>
        </Col>
      </Row>
      <Row className="p-2 justify-content-center">
        <Col md={4}>
          <Button className="btn btn-success" >Watch</Button>
        </Col>
        <Col md={4}>
          <Button className="btn btn-success" >Sell</Button>
        </Col>
        <Col md={4}>
          <Button className="btn btn-success" >Buy</Button>
        </Col>
      </Row>
    </Container>
  )
}