import React from 'react';

// A utility function to format date
const formatDate = (date) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
};

const DayWithDate = ({ dayName, date }) => {
  return (
    <div>
      <span>{dayName}</span> - <span>{formatDate(date)}</span>
    </div>
  );
};

export default DayWithDate;
