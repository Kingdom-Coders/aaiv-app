import React, { useState } from 'react';
import './Calendar.css';
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
      <div className="calendar-month-view">
        <h1>Month View Screen</h1>
          <DayPilotMonth
            startDate={startDate}
            headerHeight={60}
            cellHeaderHeight={25}
            width="100%"
            controlRef={monthView}
          />
      </div>
      <div className="calendar-new-event">
        <h1>New Event Screen</h1>
        < NewEvent />
      </div>
      <div className="calendar-week-view">
        <h1>Week View Screen</h1>
      </div>
    </div>
  );
};

export default Calendar;