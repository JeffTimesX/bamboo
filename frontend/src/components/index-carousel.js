import { Row, Col, Carousel } from 'react-bootstrap';
import { useState, useEffect } from 'react';


export default function IndexCarousel({ inputTickers }) {
  
  const [tickers, setTickers] = useState(inputTickers);
  const [currentValue, setCurrentValue] = useState(Date.now());

  function onSelectHandler(i, event) {
    const value = tickers[i] + ": " + Date.now()
    setCurrentValue(value)
  }

  return (
    <>
      <Carousel variant="dark" onSelect={onSelectHandler} >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="logo192.png"
            alt="slide"
          />
          <Carousel.Caption onClick={() => window.alert(tickers)}>
            <h4>{tickers[0]}</h4>
            <p>{currentValue}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="logo192.png"
            alt="slide"
          />

          <Carousel.Caption onClick={() => window.alert(tickers)}>
            <h4>{tickers[1]}</h4>
            <p>{currentValue}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="logo192.png"
            alt="slide"
          />
          <Carousel.Caption onClick={() => window.alert(tickers)}>
            <h4>{tickers[2]}</h4>
            <p>{currentValue}</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  )

}