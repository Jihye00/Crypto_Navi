import {Button} from "@material-ui/core";
import React from "react";
import RefreshIcon from '@material-ui/icons/Refresh';

export const RefreshButton = (props) => {

    var refreshFunction = props.refreshFunction
    if(refreshFunction===undefined) {
        refreshFunction = () => {
            window.location.reload(true);
        }
    }

    return (
            <Button onClick={() => refreshFunction()}
                    style={{
                        color: "#3A2A17",
                        backgroundColor: "#CFB997",
                        padding: "15px 20px",
                        fontSize: "15px",
                        marginTop: "15px",
                        marginBottom: "20px",
                        marginLeft: "15px",
                        marginRight: "15px",
                        borderRadius: 10
                    }}>
                <RefreshIcon/>
            </Button>
    )
}