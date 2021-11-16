import { useEffect, useState, useContext } from 'react'

import { 
  Row, 
  Container, 
  InputGroup,
  FormControl, 
  Button 
} from 'react-bootstrap'

import { UserProfileContext } from '../contexts'

import { PostCard } from '../components'
import axios from 'axios'

export default function Post(){


  const { 
    loadPosts, 
    publishNewPost 
  } = useContext(UserProfileContext)

  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [fireNewPost, setFireNewPost] = useState(false)


  // load all posts from backend while mounted
  useEffect(() =>{
    loadPosts( (err, receivedPosts) =>{
      if(err) return
      setPosts(receivedPosts)
    })
  },[])

  useEffect(() =>{
    if(fireNewPost) {
      publishNewPost(newPost, (err,updatedPosts) => {
        if(err) {
          setFireNewPost(false)
          return
        }
        setPosts(updatedPosts)
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
    <Container>
      <Row>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="write a new post"
            aria-label="write a new post"
            aria-describedby="write-new-post"
            value={newPost}
            onChange={handleNewPostInput}
          />
          <Button 
            variant="outline-warning" 
            id="button-new-post"
            onClick={handlePostButtonOnClick}
          >
          New Post
          </Button>
        </InputGroup>
      </Row>
      { 
        posts && posts.map(post => {
          return (
            <Row key={post._id}>
              <PostCard inputPost={post}/>
            </Row>
          )
        })
      }
    </Container>  
  )
}