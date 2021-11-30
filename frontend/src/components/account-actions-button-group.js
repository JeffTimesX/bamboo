import React from 'react'
import {
  Row,
  Col,
  Button
} from 'react-bootstrap'

export default function AccountActionsButtonGroup({
  accountId,
  onButtonClick
}){

  return (
    <Row sm={1} md={3}>
      <Col>
        <Button
          name="delete"
          id={accountId}
          variant="outline-danger"
          onClick={onButtonClick}
        >
          Delete
        </Button>
      </Col>
      <Col>
        <Button
          name="history"
          id={accountId}
          variant="outline-warning"
          onClick={onButtonClick}
        >
          History
        </Button>
      </Col>
      <Col>
        <Button
          name="popup"
          id={accountId}
          variant="outline-success"
          onClick={onButtonClick}
        >
          Popup
        </Button>  
      </Col>
    </Row>
  )
}