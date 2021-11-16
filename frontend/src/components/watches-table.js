import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'



export default function WatchesTable({ watches, handleRemoveWatched }) {


  const history = useHistory()

    return (
      <Table striped bordered hover variant=''>
        <thead>
          <tr key='table-head'>
            <th>#</th>
            <th>Ticker</th>
            <th>Watched At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            watches && watches.map((ticker, index)=>{
              return(
                <tr key={ticker.ticker}>
                  <td >{ index + 1 }</td>
                  <td>{ ticker.ticker }</td>
                  <td>{ ticker.watched_at}</td>
                  <td>
                    <Button 
                      variant="outline-warning"
                      onClick={()=>{handleRemoveWatched(ticker.ticker)}}
                      name="remove"
                    >
                      Remove
                    </Button>                  
                    <Button
                      variant="outline-warning" 
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