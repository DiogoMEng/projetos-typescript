import './App.css';

import PomodoraTimer from './components/Pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className='container'>
      <PomodoraTimer
        pomodoroTimer={1500}
        shortRestTimer={300}
        longRestTimer={900}
        cycles={4}
    />
    </div>
  )
}

export default App;
