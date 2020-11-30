import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

function LocationMarker({ centerPosition, zoomLevel }) {
    const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 })
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    useEffect(() => {
        setPosition(centerPosition);
        map.flyTo(centerPosition, map.getZoom())
    }, [centerPosition]);

    return position === null ? null : (
        <Marker position={position} >
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default LocationMarker