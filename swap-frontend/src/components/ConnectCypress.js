import {Box} from "@material-ui/core";
import React from "react";

export const ConnectCypress = () => {
    return(
        <Box style = {{ color: "#3A2A17", padding: "30px 30px", fontSize: "15px", backgroundColor: "#FFFDD0" }}>
            <div>
                <p> You are connected to the wrong network. </p>
                <p> Connect your Kaikas to Cypress Main Network to use Navi. </p>
            </div>
        </Box>
    )
}