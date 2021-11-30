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
        <h3>Exchange Account:  {accountNumber}</h3>
      </Row>

      <Row sm={2} md={4} lg={4} xl={4}>
        <Col md={3}><h5>Tickers:</h5></Col>
        <Col><h5>{totalTickers}</h5></Col>
        <Col md={3}><h5>Total Value:</h5></Col>
        <Col><h5>$ {totalValue}</h5></Col>
      </Row>

      <Row>
        { portfolio && (
          <Table striped bordered hover variant=''>
            <thead>
              <tr key='table-head'>
                <th>#</th>
                <th>Ticker</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Value</th>
                <th style={{textAlign:"center"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              { portfolio.map((ticker, index)=>{
                  return(
                    <tr key={ticker.ticker}>
                      <td style={{width: '5rem'}}>{ index + 1 }</td>
                      <td style={{width: '10rem'}}>{ ticker.ticker}</td>
                      <td style={{width: '20rem'}}>${ ticker.price}</td>
                      <td style={{width: '20rem'}}>{ ticker.inventory }</td>
                      <td style={{width: '20rem'}}>${ ticker.value}</td>
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