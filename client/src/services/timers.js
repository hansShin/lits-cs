import {useState, useEffect} from 'react';

export default function useTimer(initial, period, getState) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    tick();
    const timerId = setInterval(() => tick(), period);
    return function cleanup() {
      clearInterval(timerId);
    }
    // eslint-disable-next-line
  }, []);

  function tick() {
    getState((state) => { setState(state); })
  }

  return state;
}
