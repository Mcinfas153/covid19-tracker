import React from 'react'
import LocationMarker from './LocationMarker'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import numeral from 'numeral'
import { showCountryFlag } from './../config/util'
import './styles/mapData.css'


function MapData({ countries, center, zoom, colorCircle, caseType }) {

    function setGpsCode(data) {
        const tempGps = {
            lat: data.countryInfo.lat,
            lng: data.countryInfo.long
        }
        return tempGps;
    }

    function setRadios(country, caseType) {
        console.log(country);
        let value;
        switch (caseType) {
            case 'cases':
                // code block
                return value = Math.sqrt(country.cases) / 40;
                break;
            case 'recovered':
                // code block
                return value = Math.sqrt(country.recovered) / 30;
                break;
            case 'deaths':
                // code block
                return value = Math.sqrt(country.deaths) / 8;
                break;
            default:
            // code block
        }
    }

    return (
        <div className="mapData">
            <MapContainer
                className="markercluster-map"
                center={center}
                zoom={zoom}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    countries.map(coutry => {
                        let countryName = coutry.country;
                        let gpsCode = setGpsCode(coutry);
                        let totalCases = coutry.cases;
                        let totalRecoveries = coutry.recovered;
                        let totalDeaths = coutry.deaths;
                        let radius = setRadios(coutry, caseType);
                        return <CircleMarker
                            center={gpsCode}
                            pathOptions={{ color: colorCircle, fillOpacity: 0.4 }}
                            radius={radius}>
                            <Tooltip>
                                {showCountryFlag(coutry)}
                                <p className="map__country__name">{countryName}</p>
                                <p className="map__total_case">Total Cases:{numeral(totalCases).format('0,0')}</p>
                                <p className="map__total_recoverd">Total Recoveries:{numeral(totalRecoveries).format('0,0')}</p>
                                <p className="map__total_deaths">Total Deaths:{numeral(totalDeaths).format('0,0')}</p>
                            </Tooltip>
                        </CircleMarker>
                    })
                }
                <LocationMarker centerPosition={center} zoomLevel={zoom} />
            </MapContainer>
        </div>
    )
}

export default MapData
