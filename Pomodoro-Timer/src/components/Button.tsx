import React from "react";
import { DefaultButton } from "../interfaces/default-button";

export function Button(props: DefaultButton): JSX.Element{
    return (
        <button onClick={props.HandleOnclick} className={props.className}>
            {props.text}
        </button>
    )
}
