import React, {useState} from "react";
import PropTypes from 'prop-types';
import {Button, Dialog, DialogTitle, List, ListItem, ListItemIcon, ImageListItem, ListItemText} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FINIX from '../TokenIcon/FINIX.png';
import KBNB from '../TokenIcon/KBNB.png';
import KDAI from '../TokenIcon/KDAI.png';
import KETH from '../TokenIcon/KETH.png';
import KLAY from '../TokenIcon/KLAY.png';
import KORC from '../TokenIcon/KORC.png';
import KSP from '../TokenIcon/KSP.png';
import KUSDT from '../TokenIcon/KUSDT.png';
import KWBTC from '../TokenIcon/KWBTC.png';
import KXRP from '../TokenIcon/KXRP.png';
import SIX from '../TokenIcon/SIX.png';


export const SelectToken = (props) => {
    var token_img = {'FINIX':FINIX, 'KBNB':KBNB, 'KDAI':KDAI, 'KETH':KETH, 'KLAY':KLAY, 'KORC':KORC, 'KSP':KSP, 'KUSDT':KUSDT, 'KWBTC':KWBTC, 'KXRP':KXRP, 'SIX':SIX};
    //import token list
    const tokenList = require("../tokenList.json");
    const dummyToken = {
        "id": "Dummy",
        "label": "",
        "decimals": 0,
        "address": ""
    }

    const setFromOrToToken = props.setFromOrToToken

    const [isOpen, setIsOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState(dummyToken);

    //token list dialog component
    const TokenListDialog = (props) => {
        const { onClose, selectedToken, open } = props;

        const close = () => {
            onClose(selectedToken);
        };

        //
        const selectToken = (token) => {
            onClose(token);
        };

        return (
            <Dialog onClose={close} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title"
                             style = {{ color: "#3A2A17", backgroundColor: "#E0D5C8", padding: "15px 20px", fontSize: "10px", textAlign: "center"}}>
                    Select Token
                </DialogTitle>
                <List style = {{ color: "#3A2A17", backgroundColor: "#E0D5C8", padding: "15px 20px",  fontSize: "10px", textAlign: "center"}}>
                    {tokenList.map((token) => (
                        <ListItem button onClick={() => selectToken(token)} key={token.id}>
                            <ImageListItem>
                                <img src={token_img[token.label]} width="35"/>
                            </ImageListItem>
                            <p>&nbsp;&nbsp;&nbsp;</p>
                            <ListItemText primary={token.label}/>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        );
    }

    // open token list dialog when button is clicked
    const open = () => {
        setIsOpen(true);
    };

    // close dialog and set selected token
    const closeAndSelectToken = (token) => {
        setIsOpen(false);
        setSelectedToken(token);
        setFromOrToToken(token);
    };

    TokenListDialog.propTypes = {
        selectedToken: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    return (
        <div>
            <Button onClick = {()=>open()}
                    style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "0px 10px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginBottom: "15px", borderRadius: 10}}>
                <p> &nbsp; select token </p>
                <ExpandMoreIcon />
            </Button>
            <TokenListDialog selectedToken={selectedToken} open={isOpen} onClose={closeAndSelectToken} />
        </div>
    )
}