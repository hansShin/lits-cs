## izumi

A React-Express webapp that provides various dashboards for NYU LITS-CS staff's
day-to-day use.

The React front-end is located in `/client/`. The Express back-end lives in
`/server/`.

### Lab Displays -- Legacy PHP

For now, the React app proxies all requests to `/maclab`, `/pclab1`, and
`/pclab2` to the Express backend, which simply runs the `php` command on legacy
code (not included in this repo because of some private info), sending the
result back as a response. The proxying code lives in `/client/src/setupProxy.js`.

Should be replaced at some point with a React component.

### Suggestions for Future Work
- Replace legacy php code for lab displays with a React component
- Add animations to the print pages and mission control
    - I was looking forward to using `react-spring` before I ran out of time.

