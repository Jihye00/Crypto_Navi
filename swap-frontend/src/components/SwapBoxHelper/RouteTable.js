import React from "react";
import safemath from "safemath";
const mathjs = require("mathjs");
export const RouteTable = (props) => {

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

    return(
        <div>
        {!routing ?
        <div></div>
        :
        <table>
            <thead>
            <tr>
                <th></th>
                <th>Klayswap</th>
                <th>Definix</th>
            </tr>
            </thead>
            <tbody>
            {routingRows.map((routingRow) => (
                <tr>
                    <td>{routingRow.fromToken}</td>
                    <td>{routingRow.klayPercent} %</td>
                    <td>{routingRow.definixPercent} %</td>
                </tr>
            ))}
            <tr>
                <td colSpan="3"> {routingLastRow} </td>
            </tr>
            </tbody>
        </table>
        }
        </div>
    )
}