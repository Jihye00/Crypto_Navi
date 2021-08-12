import React from "react";
import safemath from "safemath";
import {Box} from "@material-ui/core";
const mathjs = require("mathjs");


export const RouteTable = (props) => {

    //process routing
    const routing = props.routing;
    console.log("routing in RouteTable", routing)

    var routingRows = []
    let routingLastRow;
    if(routing !== undefined){
        for (var itr = 0; itr < routing.length; itr++) {
            var arr = routing[itr].split(',');

            const routingRow = {
                fromToken: arr[0],
                klayPercent: safemath.safeDiv(mathjs.round(safemath.safeDiv(safemath.safeMule(1000, arr[3]), safemath.safeAdd(arr[3], arr[5]))), 10),
                definixPercent: safemath.safeDiv(mathjs.round(safemath.safeDiv(safemath.safeMule(1000, arr[5]), safemath.safeAdd(arr[3], arr[5]))), 10)
            }

            routingRows.push(routingRow);

            if (itr == routing.length - 1) {
                routingLastRow = arr[1];
            }
        }
    }

    //process slippage
    const slippage = props.slippage;
    console.log("slippage in RouteTable", slippage)
    let slippagePercent;
    if (slippage!==undefined){
        slippagePercent = safemath.safeDiv(mathjs.round(safemath.safeMule(safemath.safeSub(1,slippage),1000)),100)
    }
    console.log("slippagePercent in RouteTable", slippagePercent)

    return(
        <div align="center">
            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", borderRadius: 10 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    Price impact: {slippagePercent} %
                </p>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    Swapping route:
                </p>
                {/*<table style = {{justifyContent: "center"}}>*/}
                {/*    <thead>*/}
                {/*    <tr>*/}
                {/*        <th></th>*/}
                {/*        <th>Klayswap</th>*/}
                {/*        <th>Definix</th>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {routingRows.map((routingRow) => (*/}
                {/*        <tr>*/}
                {/*            <td>{routingRow.fromToken}</td>*/}
                {/*            <td>{routingRow.klayPercent} %</td>*/}
                {/*            <td>{routingRow.definixPercent} %</td>*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    <tr>*/}
                {/*        <td colSpan="3"> {routingLastRow} </td>*/}
                {/*    </tr>*/}
                {/*    </tbody>*/}
                {/*</table>*/}

                <div style = {{display: "flex", flexDirection: "row", "justify-content": "center"}}>
                        <Box style={{backgroundColor: '#FFB284', height: 10, width: 10, alignSelf: 'center'}} />
                        <p style={{color: '#FFB284', alignSelf:'center', fontSize: 12 }}> &nbsp;&nbsp;&nbsp; Klaytn &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
                        <Box style={{backgroundColor: '#98AEB6', height: 10, width: 10, alignSelf: 'center'}} />
                        <p style={{color: '#98AEB6', alignSelf:'center', fontSize: 12 }}> &nbsp;&nbsp;&nbsp; Definix </p>
                </div>

                <div style = {{display: "flex","justify-content": "center", alignSelf: "center", "align-items": "center"}}>
                    {routingRows.map((routingRow) => (
                        <div style = {{display: "flex", "align-items": "center"}}>
                            <p> &nbsp;&nbsp; {routingRow.fromToken} &nbsp;&nbsp; </p>
                            <div style = {{display: "flex", "flex-direction": "column", alignSelf: "center"}}>
                                <Box style={{flexDirection: 'row'}}>
                                    <p style={{color: '#FFB284', alignSelf:'center', paddingHorizontal:5, fontSize: 12 }}> &nbsp;&nbsp;&nbsp;&nbsp;{routingRow.klayPercent}%&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                    <Box style={{backgroundColor: '#FFB284', height: 4, flex: 1, alignSelf: 'center'}} />
                                </Box>
                                <Box style={{flexDirection: 'row'}}>
                                    <Box style={{backgroundColor: '#98AEB6', height: 4, flex: 1, alignSelf: 'center'}} />
                                    <p style={{ color: '#98AEB6', alignSelf:'center', paddingHorizontal:5, fontSize: 12}}> &nbsp;&nbsp;&nbsp;&nbsp;{routingRow.definixPercent}%&nbsp;&nbsp;&nbsp;&nbsp; </p>
                                </Box>
                            </div>
                        </div>
                    ))}
                    <p> &nbsp;&nbsp; {routingLastRow} </p>
                </div>

            </Box>
        </div>
    )
}