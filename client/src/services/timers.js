import {useState, useEffect} from 'react';

export default function useTimer(initial, period, updateState) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    let isMounted = true;

    function tick() {
      updateState((state) => {
        if (isMounted)
          setState(state);
      });
    }

    tick();
    const timerId = setInterval(() => {
      tick();
    }, period);

    return function cleanup() {
      isMounted = false;
      clearInterval(timerId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
