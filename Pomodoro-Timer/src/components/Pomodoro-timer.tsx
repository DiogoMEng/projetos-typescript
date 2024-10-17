import React, { useCallback, useEffect } from "react";
import { Button } from './Button';
import { Timer } from "./Timer";
import { useInterval } from "../hooks/use-interval";
import { DefaultPomodoro } from "../interfaces/default-pomodoro";
import secondToTime from "../utils/seconds-to-time";

import './pomodoro-timer.css'

import bellStart from '../sounds/bell-start.mp3';
import bellFinish from '../sounds/bell-finish.mp3';

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);


export default function PomodoraTimer(props: DefaultPomodoro): JSX.Element {
    const [mainTimer, setMainTimer] = React.useState(props.pomodoroTimer);
    const [timeCounting, setTimeCounting] = React.useState(false);
    const [working, setWorking] = React.useState(false);
    const [resting, setResting] = React.useState(false);
    const [cyclesQtdManager, setCyclesQtdManager] = React.useState(new Array(props.cycles - 1).fill(true));

    const [completedCycles, setCompletedCycles] = React.useState(0);
    const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
    const [numberOfPomodoro, setNumberOfPomodoro] = React.useState(0);

    useInterval(() => {
        setMainTimer(mainTimer - 1);

        if(working) setFullWorkingTime(fullWorkingTime + 1);

    }, timeCounting ? 1000 : null);

    const handleConfigureWork = useCallback(() => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTimer(props.pomodoroTimer);
        audioStartWorking.play();
    }, [setTimeCounting, setWorking, setResting, setMainTimer, props.pomodoroTimer]);

    const handleConfigureRest = useCallback((long: boolean) => {
        setTimeCounting(true);
        setWorking(false);
        setResting(true);

        if(long) {
            setMainTimer(props.longRestTimer);
        } else {
            setMainTimer(props.shortRestTimer);
        }

        audioStopWorking.play();
    }, [setTimeCounting, setWorking, setResting, setMainTimer]);

    useEffect(() => {
        if(working) document.body.classList.add('working');
        if(resting) document.body.classList.remove('working');

        if(mainTimer > 0) return;

        if(working && cyclesQtdManager.length > 0) {
            handleConfigureRest(false);
            cyclesQtdManager.pop();
        } else if(working && cyclesQtdManager.length <= 0){
            handleConfigureRest(true);
            setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
            setCompletedCycles(completedCycles + 1);
        }

        if(working) setNumberOfPomodoro(numberOfPomodoro + 1);
        if(resting) handleConfigureWork();
    }, [
        working,
        resting,
        mainTimer,
        handleConfigureRest,
        handleConfigureWork,
        setCyclesQtdManager,
        cyclesQtdManager,
        completedCycles,
        props.cycles,
        numberOfPomodoro
    ]);

    return (
        <div className="pomodoro">
            <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
            <Timer mainTimer={mainTimer}/>

            <div className="controls">
                <Button text="Work" HandleOnclick={() => handleConfigureWork()}></Button>
                <Button text="Rest" HandleOnclick={() => handleConfigureRest(false)}></Button>
                <Button
                    className={!working && !resting ? 'hidden' : ''}
                    text={timeCounting ? 'Pause' : 'Play'}
                    HandleOnclick={() =>setTimeCounting(!timeCounting)}
                ></Button>
            </div>

            <div className="details">
                <p>Ciclos concluídos: {completedCycles}</p>
                <p>Horas concluídos: {secondToTime(fullWorkingTime)}</p>
                <p>Pomodoros concluídos: {numberOfPomodoro}</p>
            </div>

        </div>
    )
}
