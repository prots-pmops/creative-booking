# Creative Team — Daily Tasks & Bookings

Read-only site for the PROTOCOL creative team, so they don't miss briefs allocated to them — and so the suits, Kelvin and the leads can see who is booked and how loaded everyone is.

- Header: HELLO! CREATIVE TEAM!, daily quote, today's date & time
- Overview: tasks due today | overdue | done with no hours recorded
- Team Race: Art vs Unmastered vs Planner (2 pts per done task with hours, 1 pt without)
- Bookings: Prudential Microdrama pre-production and shoot, plus shoots from the calendar
- Cards grouped Art / Unmastered / Planner, with Due today / Due tomorrow / Due this week / Overdue, Done this week (with/without hours), a per-team load smiley, and a weekly load ring vs 40 hours

## How it updates

- `index.html` is the shell, `app.js` fetches `data/data.json` (cache-busted on every load).
- Refresh = reload the page. New data = a new `data/data.json` pushed to this repo.
- No Monday.com or Google credentials are in this repo or in the browser.

## Data sources

Monday.com tasks and deadlines, Google Calendar meetings and shoots, Clarie's adhoc booking updates, and the Creative Team Booking Sheet.
