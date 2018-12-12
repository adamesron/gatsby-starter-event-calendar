import { StaticQuery, graphql } from 'gatsby'
import React from 'react'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import Month from './Month'
// import fakeData from '../../fakeData.json'

const SPREADSHEET_QUERY = graphql`
  query eventsQuery {
    allGoogleSheetEventsRow {
      edges {
        node {
          id
          eventName: whatisthename
          date: when
          place: where
          eventLink: linktotheevent
        }
      }
    }
  }
`

const isGreaterInMonth = monthsDifference => (date, dateToCompare) => {
  const totalMonth = dateProp =>
    parseInt(format(dateProp, 'MM'), 10) +
    parseInt(format(dateProp, 'YY'), 10) * 12

  const monthsDate = totalMonth(date)
  const monthsDateToCompare = totalMonth(dateToCompare)
  const difference = monthsDateToCompare - monthsDate

  return difference >= 0 && difference <= monthsDifference
}

const groupEventsByMonth = (data, monthsDifference) => {
  const today = new Date()
  const isEventValid = isGreaterInMonth(monthsDifference)
  const eventsByMonthKey = data.allGoogleSheetEventsRow.edges.reduce(
    (acc, { node }) => {
      const eventDate = new Date(node.date)

      if (!isEventValid(today, eventDate)) return acc

      const monthYear = format(eventDate, 'MM-YYYY')
      if (!acc[monthYear]) {
        return {
          ...acc,
          [monthYear]: [node],
        }
      }

      return {
        ...acc,
        [monthYear]: acc[monthYear].concat(node),
      }
    },
    {},
  )
  const result = Object.keys(eventsByMonthKey).map(monthKey => ({
    events: eventsByMonthKey[monthKey],
    date: monthKey,
  }))
  return result
}

const Calendar = ({ showModal }) => (
  <StaticQuery
    query={SPREADSHEET_QUERY}
    render={data => {
      const groupedEvents = groupEventsByMonth(data, 2)
      return groupedEvents.map(monthlyCalendar => (
        <Month
          monthlyCalendar={monthlyCalendar}
          showModal={showModal}
          key={monthlyCalendar.date}
        />
      ))
    }}
  />
)

Calendar.propTypes = {
  showModal: PropTypes.func.isRequired,
}

export default Calendar