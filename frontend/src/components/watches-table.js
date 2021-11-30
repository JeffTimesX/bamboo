import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'



export default function WatchesTable({ watches, handleRemoveWatched }) {


  const history = useHistory()

    return (
      <Table striped bordered hover variant=''>
        <thead>
          <tr key='table-head'>
            <th>#</th>
            <th>Ticker</th>
            <th>Watched At</th>
            <th style={{textAlign:"center"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            watches && watches.map((ticker, index)=>{
              return(
                <tr key={ticker.ticker}>
                  <td style={{width: '5rem'}} >{ index + 1 }</td>
                  <td style={{width: '15rem'}} >{ ticker.ticker }</td>
                  <td style={{width: '65rem'}} >{ DateTime.fromISO(ticker.watched_at).toFormat('yyyy-mm-dd HH:mm:ss') }</td>
                  <td 
                    style={{width: '15rem'}}
                    className="d-flex justify-content-center"
                  >
                    <Button 
                      className='ms-2 me-1'
                      variant="outline-warning"
                      onClick={()=>{handleRemoveWatched(ticker.ticker)}}
                      name="remove"
                    >
                      Remove
                    </Button>                  
                    <Button
                      className='ms-1 me-2'
                      variant="outline-primary" 
                      onClick={()=>{history.push('/ticker-detail/' + ticker.ticker)}}
                      name="detail"
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
    )
}