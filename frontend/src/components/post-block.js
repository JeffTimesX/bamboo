import React, {useContext, useState, useEffect} from 'react';
import { UserProfileContext } from '../contexts';

export default function PostBlock(){

  const [posts, setPosts] = useState([])
  
  const {loadPosts} = useContext(UserProfileContext)

  useEffect(() => {
    loadPosts((err, posts) => {
      if(err) return
      setPosts(posts)
    })
  },[])


  return posts && (
    <ul>
      {
        posts.map(post => {
          return (
            <li key={post._id}>
              <h6><a href='/post' style={{color: 'white'}}> { post.title } </a></h6>
              <h6>published by { post.author.profile.auth.nickname }</h6>
            </li>
          )
        })
      }
    </ul>
  )
}