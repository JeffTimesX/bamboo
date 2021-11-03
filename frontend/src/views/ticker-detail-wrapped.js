import { TickerDetail } from "."
import { useParams } from 'react-router-dom'

export default function WrapperTickerDetail(){
  
  const {ticker} = useParams()
  
  // console.log("ticker params in wrapper: ", ticker)

  const tickerSymbol = ticker || 'IBM'

  return (
    <TickerDetail tickerSymbol={tickerSymbol} />
  )
}