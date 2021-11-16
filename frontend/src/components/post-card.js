import React, 
{
  useEffect, 
  useState, 
  useContext
} from 'react';

import {
  Container, 
  Card,
  Row, 
  Col, 
  Form, 
  FormControl, 
  Button, 
} from 'react-bootstrap'

import { UserProfileContext } from '../contexts'


export default function PostCard({inputPost}){

  const [post, setPost] = useState({})
  const [like, setLike] = useState(false)
  const [comment, setComment] = useState('')
  const [saveComment, setSaveComment] = useState(false)

  const {
    userProfile,
    updateLikeToPost,
    saveCommentToPost,
  } = useContext(UserProfileContext)


  // loading post to the state
  useEffect(() => {
    console.log('PostCard().useEffect() loading inputPost.')
    setPost(inputPost)
  },[])

  
  // update like to the backend and the state
  useEffect(() =>{
    updateLikeToPost(post._id, userProfile._id, like, (err, updatedPost) => {
      if(err) return 
      setPost(updatedPost)
    })
  },[like])


  // save comment 
  useEffect(() =>{
    if(saveComment) {
      saveCommentToPost(post._id, userProfile._id, comment, (err, updatedPost) =>{
        if(err) return
        setPost(updatedPost)
        setSaveComment(false)
      })
    }
  },[saveComment])



  function handleLike(e) {
    setLike(!like)
  }

  function handleCommentChange(e){
    setComment(e.target.value)
  }

  function handleCommentButtonClick(e){
    setSaveComment(true)
  }


  return post && post._id ? 
  (
    <Card>
      <Form>
        <Form.Group className="mb-3" controlId={post._id}>
          <Form.Label>
            Post by{': '} {post.author && post.author.profile && post.author.profile.auth && post.author.profile.auth.nickname }.<br/>
            Post at: {post.date} <br/>
            { post.who_likes ? post.who_likes.length : 0}{' '} people like. <br/>
          </Form.Label>
          <Form.Control readOnly type="text" value={post.body} />
        </Form.Group>
        {
          post.comments && post.comments.map(comment=>{
            return (
              <Form.Group key={comment._id} className="mb-3" controlId={comment._id}>
                <Form.Label>
                  Comment by: {comment.author && comment.author.profile && comment.author.profile.auth && comment.author.profile.auth.nickname } <br/>
                  Comment at: {comment.date} <br/>
                </Form.Label>
                <Form.Control readOnly type="text" value={comment.body} />
              </Form.Group>
            )
          })
        }
        
        <Form.Group className="mb-3" controlId="new-comment">
          <Form.Label>Write a Comment:</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={2} 
            value={comment} 
            onChange={handleCommentChange}
          />
        </Form.Group>
        <Row>
        <Col>
            <Form.Check
              inline
              label="like"
              name="like"
              type='checkbox'
              id='like-comment'
              value='like'
              onChange={handleLike}
            />
          </Col>
          <Col>
            <Button 
              variant="primary"
              onClick={handleCommentButtonClick}
            >
              Comment
            </Button>
          </Col>
          
        </Row>
      </Form>
    </Card>
  ):(
    <div><h3>under construction.</h3></div>
  )
}
