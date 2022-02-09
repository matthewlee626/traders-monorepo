import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }); // ApexCharts has a number of references to window which is an issue since Next.js renders pages on the server.
// https://stackoverflow.com/questions/68596778/next-js-window-is-not-define
// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr

type CandleStickChartProps = {
  series: Array<any>;
  options: any;
}

const CandleStickChart = ({series, options} : CandleStickChartProps) => {
  if(typeof window === 'undefined') return null;
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="candlestick" height={350} />
    </div>
  );
}

export default CandleStickChart;
