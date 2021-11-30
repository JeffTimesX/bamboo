import { useEffect, useState, useContext } from 'react'

import { 
  Row, 
  Col,
  Container, 
  InputGroup,
  FormControl, 
  Button 
} from 'react-bootstrap'

import { UserProfileContext } from '../contexts'

import { PostCard } from '../components'

import {DateTime} from 'luxon'

export default function Post(){

  const { 
    loadPosts, 
    publishNewPost 
  } = useContext(UserProfileContext)

  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [fireNewPost, setFireNewPost] = useState(false)

  // console.log(posts)

  function compareDateOfPost(firstPost, secondPost){
    return DateTime.fromISO(secondPost.date).toMillis() - DateTime.fromISO(firstPost.date).toMillis()
  }

  // load all posts from backend while mounted
  useEffect(() =>{
    loadPosts( (err, receivedPosts) =>{
      if(err) return
      setPosts(receivedPosts.sort(compareDateOfPost))
    })
  },[])

  useEffect(() =>{
    if(fireNewPost) {
      publishNewPost(newPost, (err,updatedPosts) => {
        if(err) {
          setFireNewPost(false)
          return
        }
        setPosts(updatedPosts.sort(compareDateOfPost))
        setFireNewPost(false)
      })
    }
  },[fireNewPost])


  function handleNewPostInput(e){
    setNewPost(e.target.value)
  }

  function handlePostButtonOnClick(e){
    setFireNewPost(true)
  }
  return(
    <Container className="min-vh-100">
      <Row className="pt-5 justify-content-center"style={{textAlign: "center"}}>
          <h3>Sotcker Post</h3>
      </Row>
      <hr/>
      <Row className="justify-content-center pt-5">
        <Row style={{width:'63rem'}}>
          <InputGroup className="mb-3">
            <FormControl
              
              placeholder="write a new post"
              aria-label="write a new post"
              aria-describedby="write-new-post"
              value={newPost}
              onChange={handleNewPostInput}
            />
            <Button 
              variant="primary" 
              id="button-new-post"
              onClick={handlePostButtonOnClick}
            >
            New Post
            </Button>
          </InputGroup>
        </Row>       
      </Row >
      { 
        posts && posts.map(post => {
          return (
            <Row key={post._id} className="justify-content-center">
              <PostCard inputPost={post}/>
            </Row>
          )
        })
      }
    </Container>  
  )
}