import React, { useEffect, useState } from 'react'
import { TableContainer, Card, Table, TableHead, TableRow, TableBody, TableCell, Typography } from '@material-ui/core';
import numeral from 'numeral'
import axios from './../config/axios';
import apiEndPoints from './../config/apiEndPoints'
import './styles/dataTable.css'

function DataTable() {

    const [countriesData, setCountriesData] = useState([]);

    //common use effect
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(apiEndPoints.allCountryDataUrl);
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data);
                    const countries = data.map((country) => (
                        {
                            name: country.country,
                            cases: country.cases
                        }
                    ));
                    countries.sort((a, b) => parseFloat(b.cases) - parseFloat(a.cases));
                    setCountriesData(countries);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="data__table">
            <TableContainer component={Card}>
                <Table className="table__main" aria-label="" stickyHeader>
                    <TableHead>
                        <TableRow className="datatable__row">
                            <TableCell className="datatable__head__cell">
                                <Typography className="data__table__header">Countries</Typography>
                            </TableCell>
                            <TableCell align="right" className="datatable__head__cell">
                                <Typography className="data__table__header">Cases</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            countriesData.map(countryData => (
                                <TableRow key={countryData.name} className="datatable__row">
                                    <TableCell component="th" scope="row" className="datatable__cell">
                                        <Typography className="data__table__country__name">{countryData.name}</Typography>
                                    </TableCell>
                                    <TableCell align="right" className="datatable__cell">
                                        <Typography className="data__table__country__cases">{numeral(countryData.cases).format('0,0')}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}

export default DataTable
