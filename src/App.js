import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import quotes from './quotes';
import './App.scss';
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const [fromDate, setFromDate] = useState({date: null, changed: false})
  const [toDate, setToDate] = useState({date: null, changed: true})

  const randomNumber =  ({min = 1, max = 100} = {})=> {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div className="App">
      <div className="background_image"></div>
      <header className="App-header">
      { !fromDate.date && !fromDate.changed &&
        <>
          <h1>Since when you are at home?</h1>
          <DatePicker
              selected={new Date()}
              onChange={date => {setFromDate({date, changed: true});}}
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
          <h1>You are <span>{moment().diff(moment(fromDate.date),'days')}</span> days at your home</h1>
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
      <br />

      <audio controls autoPlay>
        <source src="music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      </header>
    </div>
  );
}

export default App;
