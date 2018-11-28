import React from 'react'
import { getDaysInMonth, getISODay, format } from 'date-fns'
import { Heading, Box } from 'grommet'
import PropTypes from 'prop-types'
import Days from './Days'
import EmptyDays from './EmptyDays'
import Events from './Events'
import Weekdays from './Weekdays'

const Month = ({ monthlyCalendar, showModal }) => {
  const [currentMonthNumber, currentYear] = monthlyCalendar.date.split('-')
  const monthDate = parseInt(currentMonthNumber, 10) - 1
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), monthDate, 1)
  const currentMonthIsoDay = getISODay(currentMonth)
  const currentMonthDays = getDaysInMonth(currentMonth)
  const emptyDaysAtEnd = 7 - ((currentMonthIsoDay + currentMonthDays) % 7)

  return (
    <Box margin={{ top: 'medium' }}>
      <Heading>
        {format(new Date(currentYear, monthDate, 1), 'MMMM YYYY')}
      </Heading>
      <Weekdays />
      <Box border="all" direction="row" wrap>
        {currentMonthIsoDay !== 7 && <EmptyDays days={currentMonthIsoDay} />}
        <Days
          days={currentMonthDays}
          month={currentMonth}
          events={monthlyCalendar.events}
          showModal={showModal}
        />
        {emptyDaysAtEnd !== 7 && <EmptyDays days={emptyDaysAtEnd} />}
      </Box>
    </Box>
  )
}

Month.propTypes = {
  monthlyCalendar: PropTypes.shape({
    events: Events.propTypes.events,
    when: PropTypes.shape({
      month: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
  }),
  showModal: PropTypes.func.isRequired,
}

Month.defaultProps = {
  monthlyCalendar: {
    events: [],
    when: {
      month: '',
      year: '',
    },
  },
}

export default Month
