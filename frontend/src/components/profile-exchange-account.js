import React from 'react'
import { Table, Button } from 'react-bootstrap'


export default function ProfileExchangeAccounts({ accounts }) {

    return (
      <Table striped bordered hover variant=''>
        <thead>
          <tr key='table-head'>
            <th>#</th>
            <th>'Account Number'</th>
            <th>'Balance'</th>
            <th>''</th>
          </tr>
        </thead>
        <tbody>
          {
            accounts && accounts.map((account, index)=>{
              return(
                <tr key={ticker.ticker}>
                  <td >{ index + 1 }</td>
                  <td>{ accounts[index]. }</td>
                  <td>{ ticker[secondHeadTitle.toLowerCase()]}</td>
                </tr>
              )
            })
          }
          
        </tbody>
      </Table>
    )
}