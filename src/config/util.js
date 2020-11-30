import React from 'react';

export const showCountryFlag = (country) => {
    return <img
        src={country.countryInfo.flag}
        height="40" />
}