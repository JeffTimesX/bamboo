import React from 'react';

import {
  Container,
  Row,
  Col,
  Table, 
  Button 
} from 'react-bootstrap'

import { useHistory } from 'react-router-dom'

export default function PortfolioAccountSection({
  accountNumber, 
  totalTickers, 
  totalValue,
  portfolio 
}) {

  const history = useHistory()

  return (
    <Container>
      <Row className="pt-3 pb-3">
        <h5>Exchange Account:  {accountNumber}</h5>
      </Row>

      <Row sm={2} md={4} lg={4} xl={4}>
        <Col md={3}><h6>Tickers:</h6></Col>
        <Col><h6>{totalTickers}</h6></Col>
        <Col md={3}><h6>Total Value:</h6></Col>
        <Col><h6>$ {totalValue.toFixed(2)}</h6></Col>
      </Row>

      <Row>
        { portfolio && (
          <Table striped bordered hover variant=''>
            <thead>
              <tr key='table-head'>
                <th>#</th>
                <th>Ticker</th>
                <th>Price (USD)</th>
                <th>Inventory</th>
                <th>Value (USD)</th>
                <th style={{textAlign:"center"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              { portfolio.map((ticker, index)=>{
                  return(
                    <tr key={ticker.ticker}>
                      <td style={{width: '5rem'}}>{ index + 1 }</td>
                      <td style={{width: '10rem'}}>{ ticker.ticker}</td>
                      <td style={{width: '20rem'}}>$ { ticker.price}</td>
                      <td style={{width: '20rem'}}>{ ticker.inventory }</td>
                      <td style={{width: '20rem'}}>$ { ticker.value.toFixed(2)}</td>
                      <td
                        style={{width: '10rem'}}
                        className="d-flex justify-content-center"
                      >
                        <Button 
                          className='ms-1 me-2'
                          variant="outline-primary"
                          id= {ticker.ticker}
                          onClick={() => history.push('/ticker-detail/'+ticker.ticker)}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  )
                })
              }
              
            </tbody>
          </Table>
        )}
      </Row>
    </Container>
  )
}