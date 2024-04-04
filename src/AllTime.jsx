import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useQuery} from 'react-query';
import OneTime from './OneTime';
import classses from './AllTime.module.css'

const FlexDiv = styled.div`
width: 85%;
margin-top: 15px;
display: flex;
justify-content: space-between;
`


function findClosestLargerNumber(target, numbers) {
  let closestLargerNumber = Infinity;

  numbers.forEach(number => {
    if(number > target && number < closestLargerNumber) {
      closestLargerNumber = number;
    }
    if(target > numbers[5]) {
      closestLargerNumber = numbers[5]
    }
  });

  return closestLargerNumber;

  
}

const AllTime = React.memo((props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(null);
  const [fajr, setFajr] = useState('00:00');
  const [sunrise, setSunrise] = useState('00:00');
  const [dhuhr, setDhuhr] = useState('00:00');
  const [asr, setAsr] = useState('00:00');
  const [maghrib, setMaghrib] = useState('00:00');
  const [isha, setIsha] = useState('00:00');

  const ErrorComp = () => {
    return(
      <h1>try again</h1>
    )
  }

  const fetchdata = async() => {
    try {
      const location = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
      const jsonLocation = await location.json();
      const method = '2';
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${jsonLocation.countryName}&country=${jsonLocation.city}&method=${method}&school=1`);
      const jsonData = await response.json();
      setData(jsonData.data.timings);
      setCity(jsonData.data.meta.timezone.split('/')[1]);
      setLoading(false);
      
    } catch (error) {
      console.log('error', error);
      setLoading(false);
      <ErrorComp />
    }
  };

  const {error, isLoadind} = useQuery('randomFacts', fetchdata, { 
    staleTime: 60000,
    cacheTime: 300000,
  });
  if(error) (<ErrorComp />)

  useEffect(() => {
    if(data) {
      setFajr(data.Fajr)
      setSunrise(data.Sunrise)
      setDhuhr(data.Dhuhr)
      setAsr(data.Asr)
      setMaghrib(data.Maghrib)
      setIsha(data.Isha)
      
    }
  }, [data])


  function getMinuts(num) {
    const [hoursSplit, minutes] = num.split(":");
    return (parseInt(hoursSplit) * 60) + parseInt(minutes)
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  let timeMoments = {
    fajr: getMinuts(fajr),
    sunrise: getMinuts(sunrise),
    dhuhr: getMinuts(dhuhr),
    asr: getMinuts(asr),
    maghrib: getMinuts(maghrib),
    isha: getMinuts(isha)
    
  };

  const closestTime = findClosestLargerNumber(currentTime, Object.values(timeMoments));

  
let closestMoment;
  for(const [moment, time] of Object.entries(timeMoments)){
    if(time === closestTime) {
      closestMoment = moment;
      break;
    }
  }

  const [nextTime, setNextTime] = useState('00:00')
  useEffect(() => {
    if(closestMoment == 'fajr') setNextTime(fajr);    
    if(closestMoment == 'sunrise') setNextTime(sunrise);
    if(closestMoment == 'dhuhr') setNextTime(dhuhr);
    if(closestMoment == 'asr') setNextTime(asr);
    if(closestMoment == 'maghrib') setNextTime(maghrib);
    if(closestMoment == 'isha') setNextTime(isha);

  },[closestTime])
  

  return(
    <div className={`${classses.maindiv} ${loading && classses.loader}`}>
      {loading && isLoadind ? (
      <>
      <div className='loader-div'>
      <div className='loading'></div>
      </div>
      </>
      ) : (
      <>
       <h6 className='opacity-h6'>{city}</h6>
        <h1 className={classses.h1}>prayer time</h1>
        <div className={`${classses.maintime } next_time`}>
          <h3 className={classses.marginTopH3}>next prayer time</h3>
          <OneTime
             next={true}
            time={nextTime}
            
            >{closestMoment}</OneTime>
        
        </div>
        <h3>all times</h3>
        <FlexDiv>
        <OneTime time={fajr}>fajr</OneTime>       
        <OneTime time={sunrise}>Sunrise</OneTime>
        <OneTime time={dhuhr}>Dhuhr</OneTime>


        </FlexDiv>
      <FlexDiv>
        <OneTime time={asr}>Asr</OneTime>       
        <OneTime time={maghrib}>Maghrib</OneTime>
        <OneTime time={isha}>Isha</OneTime>


        </FlexDiv>
      </>
      )}
      <h6 className='opacity-h6'><a style={{color: '#ffffff'}} href='https://github.com/gonzalote99' target='_blank'>developed by me</a></h6>
    </div>
  )
})

export default AllTime;