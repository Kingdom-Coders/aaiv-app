import React from 'react';
import './Calendar.css';

const Calendar = () => {
  return (
    <div className="calendar-screen">
      <div className="calendar-title">
        <h1>Calendar Screen</h1>
      </div>
      <div className="calendar-month-view">
        <h1>Month View Screen</h1>
      </div>
      <div className="calendar-new-event">
        <h1>New Event Screen</h1>
      </div>
      <div className="calendar-week-view">
        <h1>Week View Screen</h1>
      </div>
    </div>
  );
};

export default Calendar;