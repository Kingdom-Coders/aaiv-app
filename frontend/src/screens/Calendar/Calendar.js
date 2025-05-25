import React, { useState } from 'react';
import './Calendar.css';
import GoogleLogin from '../../components/GoogleLogin';
import { ChakraProvider } from '@chakra-ui/react';
import NewEvent from './NewEvent.js';
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";


const Calendar = () => {
  const [startDate] = useState(DayPilot.Date.today());
  const [monthView] = useState(null);

  return (
    <div className="calendar-screen">
      <div className="calendar-title">
        <h1>Calendar Screen</h1>
      </div>

      <div className="calendar-google-login">
        <GoogleLogin />
      </div>
      <div className="calendar-month-view">
      {/* <div className="calendar-month-view">
        <h1>Month View Screen</h1>
          <DayPilotMonth
            startDate={startDate}
            headerHeight={60}
            cellHeaderHeight={25}
            width="100%"
            controlRef={monthView}
          />
      </div> */}
      <div className="embedded-calendar">
        <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&mode=MONTH&src=ajFtYWtqZWwzaDV1MmVuYnBmaDdsMGFldXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23B39DDB" 
        style={{ border: "none" }} width="100%" height="90%" frameborder="0" scrolling="no"></iframe>
      </div>
      <div className="calendar-new-event">
        {/* <h1>New Event Screen</h1> */}
        < NewEvent />
      </div>
      {/* <div className="calendar-week-view">
        <h1>Week View Screen</h1>
      </div> */}
    </div>
  );
};

export default Calendar;