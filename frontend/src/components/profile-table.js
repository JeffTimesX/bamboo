import React from 'react'
import { Table } from 'react-bootstrap'
export default function ProfileTable({ array, firstHeadTitle, secondHeadTitle }) {

    return (
      <Table striped bordered hover variant=''>
        <thead>
          <tr key='table-head'>
            <th>#</th>
            <th>{firstHeadTitle}</th>
            <th>{secondHeadTitle}</th>
          </tr>
        </thead>
        <tbody>
          {
            array && array.map((ticker, index)=>{
              return(
                <tr key={ticker.ticker}>
                  <td >{ index + 1 }</td>
                  <td>{ ticker[firstHeadTitle.toLowerCase()] }</td>
                  <td>{ ticker[secondHeadTitle.toLowerCase()]}</td>
                </tr>
              )
            })
          }
          
        </tbody>
      </Table>
    )
}