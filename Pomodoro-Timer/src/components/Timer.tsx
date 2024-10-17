import React from "react";
import { DefaultTimer } from "../interfaces/default-timer";
import secondToMinutes from "../utils/seconds-to-minutes";

import './timer.css';

export function Timer(props: DefaultTimer): JSX.Element{
    return (
        <div className="timer">
            {secondToMinutes(props.mainTimer)}
        </div>
    )
}
