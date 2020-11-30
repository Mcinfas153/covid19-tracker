import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';
import numeral from 'numeral'
import './styles/dataBox.css'

function DataBox(props) {
    return (
        <div className={`data__box ${(props.active) && 'databox--active'} ${props.active && props.isRed && 'data--red--active'}`} onClick={props.onClickHandler}>
            <Card variant="outlined">
                <CardContent className="data__boxCardContent">
                    <Typography color="textPrimary" className={`databox__title ${(props.isRed) ? 'text--red' : 'text--green'}`}>{props.title}</Typography>
                    <Typography color="textPrimary" className={`databox__new__value ${(props.isRed) ? 'text--red' : 'text--green'}`}>{numeral(props.cases).format('+0,0')}</Typography>
                    <Typography color="textPrimary" className="databox__total__value">{numeral(props.total).format('0,0')} Total</Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default DataBox
