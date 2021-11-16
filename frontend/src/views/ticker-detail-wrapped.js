import { TickerDetail } from "."
import { useParams } from 'react-router-dom'

export default function WrapperTickerDetail(){
  
  const {ticker} = useParams()
  

  const tickerSymbol = ticker || 'IBM'

  return (
    <TickerDetail tickerSymbol={tickerSymbol} />
  )
}