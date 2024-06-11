import React from 'react';
import BarGraph from './BarGraph';
import ListComp from './list/ListComp'
function Home() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly"}}>
      <ListComp/>
      <BarGraph/>
    </div>
  );
}

export default Home;
