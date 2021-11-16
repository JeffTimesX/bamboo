import React from 'react';

import {
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
    <>
      <Row>
        <h3>Exchange Account: {accountNumber}</h3>
      </Row>

      <Row sm={2} md={4} lg={4} xl={4}>
        <Col md={3}><h4>Tickers:</h4></Col>
        <Col><h4>{totalTickers}</h4></Col>
        <Col md={3}><h4>Total Value:</h4></Col>
        <Col><h4>{totalValue}</h4></Col>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { portfolio.map((ticker, index)=>{
                  return(
                    <tr key={ticker.ticker}>
                      <td >{ index + 1 }</td>
                      <td>{ ticker.ticker}</td>
                      <td>{ ticker.price}</td>
                      <td>{ ticker.inventory }</td>
                      <td>{ ticker.value}</td>
                      <td>
                        <Button 
                          variant="outline-warning"
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
    </>
  )
}