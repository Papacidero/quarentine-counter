import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import quotes from './quotes';
import './App.scss';
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const lsFromDate = localStorage.getItem('fromDate');
  const [fromDate, setFromDate] = useState({date: lsFromDate ? lsFromDate : null, changed: lsFromDate ? true : false})
  const [toDate, setToDate] = useState({date: null, changed: true})
  const [data, setdata] = useState({userCountry: '', userCountryTotalRecovered: '', worldTotalRecovered: ''});

  const handleFromDate = (data) => {
    const {date, changed} = data;
    localStorage.setItem('fromDate', date);
    setFromDate({date, changed})
  }

  const reset = () => {
    localStorage.removeItem('fromDate');
    setFromDate({date: null, changed: false});
  }

  useEffect(()=>{
    async function loadContent() {
      let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      const userCountry = await fetch('https://extreme-ip-lookup.com/json/')
        .then( res => res.json())
        .then(response => response.country)
        .catch((data, status) => {
            console.log('Request failed');
            return null;
        })
      const data = await fetch("https://api.covid19api.com/summary", requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
          console.log('error', error);
          return null;
        });

        
      setdata({
        userCountry,
        userCountryTotalRecovered: data.Countries.filter(item => item.Country.match(new RegExp(`${userCountry}$`,'gi')))[0].TotalRecovered,
        worldTotalRecovered: data.Countries.reduce((prev, curr) => prev + curr.TotalRecovered, 0)
      });

    }
    loadContent();
  }, [])

  const randomNumber =  ({min = 1, max = 100} = {})=> {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div className="Quarentine">
      <div className="background_image"></div>

      <div className="container">
      <content className="content">
      { !fromDate.date && !fromDate.changed &&
        <>
          <h1>Since when you are at home?</h1>
          <DatePicker
              selected={new Date()}
              onChange={date => {handleFromDate({date, changed: true});}}
              maxDate={new Date()}
              inline
            /> 
        </>
      }
      { fromDate.changed && !toDate.date && !toDate.changed &&
        <>
          <p>Do you have an estimate end date?</p>
          <a href="#" onClick={()=>setToDate({date: null, changed: true})}>No</a>
          <DatePicker 
              onChange={date => {setToDate({date, changed: true});}}
              minDate={new Date()}
              inline
            /> 
        </>
      }
      { fromDate.changed && toDate.changed && !toDate.date &&
        <>
          <h1>Awesome, you are <span>{moment().diff(moment(new Date(fromDate.date)),'days')}</span> days helping the world.
          <br />
          </h1>
          <button onClick={()=> reset()} type="button" class="btn btn-secondary btn-sm">Change Date</button>
          <p>{quotes[randomNumber({min: 0, max: quotes.length -1})]}</p>
        </>
      }
      { fromDate.changed && toDate.changed && toDate.date &&
        <>
        <h1>You are {moment().diff(moment(fromDate.date),'days')} days at your home</h1>
        <h2>You most likely will be able to go out in {moment(toDate.date).diff(moment(),'days')} in a total of {moment(toDate.date).diff(moment(fromDate.date),'days')} days.</h2>
        <p>{quotes[randomNumber({min: 0, max: quotes.length -1})]}</p>
        </>
      }


      <br />

      <audio controls>
        <source src="music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <br />


      <div className="fb-share-button" data-href="https://quarentine-counter.firebaseapp.com/" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fquarentine-counter.firebaseapp.com%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">Share</a></div>

      </content>
    
      { data.userCountry && data.worldTotalRecovered &&
        <aside>
        { data.worldTotalRecovered &&
          <h1>A total of <span>{data.worldTotalRecovered}</span> people are already fully revovered worldwide!</h1>
        }
        { data.userCountry &&
          <h2>And a total of <span>{data.userCountryTotalRecovered}</span> in <span>{data.userCountry}</span>.</h2>
        }
        <br />
        <small className="info">
          Data from<a href="https://documenter.getpostman.com/view/10808728/SzS8rjbc?version=latest#b07f97ba-24f4-4ebe-ad71-97fa35f3b683" target="_blank">
            Coronavirus COVID19 API
          </a>
        </small>
      </aside>  
      }
      </div>
      
    </div>
  );
}

export default App;
