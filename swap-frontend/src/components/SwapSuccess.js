import React, {useState} from "react";
import Alert from "@material-ui/lab/Alert";

export const SwapSuccess = (props) => {

    const setIsSwapSuccess = props.setIsSwapSuccess;

    const disableAlert = () => {
        setIsSwapSuccess(undefined);
    }

    return(
        <Alert onClose={disableAlert} severity="success">
            Swap was successful
        </Alert>
    )
}