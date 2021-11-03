import React from 'react'
import HighchartsReact from 'highcharts-react-official'

const StockChart = ({ options, highcharts }) => {

  //console.log("Options in StockChart: ", options.series)
  
  return (
    <HighchartsReact
      highcharts={highcharts}
      constructorType={'stockChart'}
      options={options}
    />
  )
}
export default StockChart