import React, {useContext, useState, useEffect} from 'react';
import { UserProfileContext } from '../contexts';

export default function NewsBlock(){

  const [news, setNews] = useState(null)
  const { getNewsFromPolygon } = useContext(UserProfileContext)

  useEffect(() => {
    async function getNews(){
      const news = await getNewsFromPolygon()      
      setNews(news)
    }
    getNews()
  },[])



  return news && (
    <ul>
      {
        news.results.map(result => {
          return (
            <li key={result.id}>
              <h6><a href={result.article_url} style={{color: 'white'}}> { result.title } </a></h6>
              <h6>published by <a href={ result.publisher.homepage_url } style={{color: 'blue'}}> { result.publisher.name }</a></h6>
            </li>
          )
        })
      }
    </ul>
  )



}