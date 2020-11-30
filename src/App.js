import React, { useEffect, useState } from 'react';
import DataBox from './component/DataBox'
import DataTable from './component/DataTable'
import LineChart from './component/LineChart'
import LineDeathChart from './component/LineDeathChart'
import MapData from './component/MapData'
import { FormControl, MenuItem, Select, Container, Grid } from '@material-ui/core';
import axios from './config/axios';
import apiEndPoints from './config/apiEndPoints'
import './App.css';
import "leaflet/dist/leaflet.css";

function App() {
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [zoom, setZoom] = useState(3);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [circleColor, setCircleColor] = useState('#ff6060');
  const [caseType, setCaseType] = useState('cases');
  const [countryData, setCountryData] = useState(
    {
      totalCases: 0,
      todayCases: 0,
      totalRecoveries: 0,
      todayRecoveries: 0,
      totalDeaths: 0,
      todayDeaths: 0
    }
  );

  const colorDictionary = {
    cases: {
      color: '#ff6060',
    },
    recovered: {
      color: '#00b300',
    },
    deaths: {
      color: '#f70000',
    }
  }

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    if (countryCode === 'worldwide') {
      fetchworldWideData();
    } else {
      fetchCountryData(countryCode);
    }

  };

  async function fetchCountryData(countryCode) {
    try {
      const response = await axios.get(apiEndPoints.countryDataUrl + countryCode);
      if (response.status === 200) {
        const responseData = response.data;
        console.log(responseData)
        const countryDataJson =
        {
          totalCases: responseData.cases,
          todayCases: responseData.todayCases,
          totalRecoveries: responseData.recovered,
          todayRecoveries: responseData.todayRecovered,
          totalDeaths: responseData.deaths,
          todayDeaths: responseData.todayDeaths
        }
        setCountryData(countryDataJson);
        const gpsCode = setGpsCode(responseData);
        setCenter(gpsCode);
      } else {
        console.log(response);
      }

    } catch (error) {
      console.log(error);
    }
  }

  async function fetchworldWideData() {
    try {
      const response = await axios.get(apiEndPoints.allDataUrl);
      if (response.status === 200) {
        const responseData = response.data;
        const countryDataJson =
        {
          totalCases: responseData.cases,
          todayCases: responseData.todayCases,
          totalRecoveries: responseData.recovered,
          todayRecoveries: responseData.todayRecovered,
          totalDeaths: responseData.deaths,
          todayDeaths: responseData.todayDeaths
        }
        setCountryData(countryDataJson);
        setCenter({ lat: 51.505, lng: -0.09 });
        setZoom(10);
      } else {
        console.log(response);
      }

    } catch (error) {
      console.log(error);
    }
  }

  function setGpsCode(data) {
    const tempGps = {
      lat: data.countryInfo.lat,
      lng: data.countryInfo.long
    }
    return tempGps;
  }

  function getColor(caseType = 'cases') {
    switch (caseType) {
      case 'cases':
        // code block
        setCircleColor(colorDictionary.cases.color)
        setCaseType('cases');
        break;
      case 'recovered':
        // code block
        setCircleColor(colorDictionary.recovered.color)
        setCaseType('recovered');
        break;
      case 'deaths':
        // code block
        setCircleColor(colorDictionary.deaths.color)
        setCaseType('deaths');
        break;
      default:
      // code block
    }
  }

  //common use Effect 
  useEffect(() => {
    async function fetchCountries() {
      try {
        const countriesRespondJson = await axios.get(apiEndPoints.allCountriesUrl);
        const countriesRespond = countriesRespondJson.data
        if (countriesRespondJson.status === 200) {
          //const countries = countriesRespond.map((country) => ({
          // name: country.country,
          //value: country.countryInfo.iso2
          //}));
          setCountries(countriesRespondJson.data);
          fetchworldWideData();
        } else {
          console.log(countriesRespond);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchCountries();
  }, []);

  return (
    <div className="app">
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          {/* Header Start*/}
          <div className="header">
            <Grid container spacing={3}>
              <Grid item xs={12} md={9}>
                <h1 className="header__title">COVID-19 TRACKER</h1>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl className="header__dropdown">
                  <Select variant="outlined" value={country} onChange={onCountryChange}>
                    <MenuItem value="worldwide">Worldwide</MenuItem>
                    {
                      countries.map(country => <MenuItem key={country.country} value={country.countryInfo.iso2}>{country.country}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
          {/* Header End*/}
          <Container>
            <div className="databox__wrapper">
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <DataBox title="Coronavirus cases" isRed active={caseType === 'cases'} cases={countryData.todayCases} total={countryData.totalCases} onClickHandler={() => getColor('cases')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DataBox title="Coranavirus Recoveries" isRed={false} active={caseType === 'recovered'} cases={countryData.todayRecoveries} total={countryData.totalRecoveries} onClickHandler={() => getColor('recovered')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DataBox title="Coronavirus Deaths" isRed active={caseType === 'deaths'} cases={countryData.todayDeaths} total={countryData.totalDeaths} onClickHandler={() => getColor('deaths')} />
                </Grid>
              </Grid>
            </div>
          </Container>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <MapData countries={countries} center={center} zoom={zoom} colorCircle={circleColor} caseType={caseType} />
              </Grid>
            </Grid>
          </Container>

        </Grid>
        <Grid item xs={12} md={3}>
          {/*Side Bar */}
          <DataTable />
          <LineChart />
          <LineDeathChart />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
