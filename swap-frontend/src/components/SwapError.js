import React, {useState} from "react";
import Alert from "@material-ui/lab/Alert";

export const SwapError = (props) => {

    const setIsSwapSuccess = props.setIsSwapSuccess;

    const disableAlert = () => {
        setIsSwapSuccess(undefined);
    }

    return(
        <Alert onClose={disableAlert} severity="error">
            Swap has failed
        </Alert>
    )
}