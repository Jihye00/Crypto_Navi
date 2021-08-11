import React, {useState} from "react";
import PropTypes from 'prop-types';
import {Button, Dialog, DialogTitle, List, ListItem, ListItemText} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const SelectToken = (props) => {

    //import token list
    const tokenList = require("../tokenList.json");

    const setFromOrToToken = props.setFromOrToToken

    const [isOpen, setIsOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState(tokenList[0]);

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
                             style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px",  fontSize: "10px", textAlign: "center"}}>
                    Select Token
                </DialogTitle>
                <List style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px",  fontSize: "10px", textAlign: "center"}}>
                    {tokenList.map((token) => (
                        <ListItem button onClick={() => selectToken(token)} key={token.id}>
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
                    style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginBottom: "15px", borderRadius: 10}}>
                <p> select token </p>
                <ExpandMoreIcon />
            </Button>
            <TokenListDialog selectedToken={selectedToken} open={isOpen} onClose={closeAndSelectToken} />
        </div>
    )
}