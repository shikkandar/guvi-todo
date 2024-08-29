import React, { useState } from 'react'
import { Container, Button, Form, ListGroup } from 'react-bootstrap';

const Form = () => {
    const[todos,setTodos]=useState([])

  return (
    <div>
       <Form className="d-flex flex-col" >
            
            <Form.Group controlId="todoName">
            <Form.Control
              type="text"
              placeholder="ToDo Name"
             
            />

                
            </Form.Group>
       </Form>
    </div>
  )
}

export default Form