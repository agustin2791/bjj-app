import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../../axios";
const GOOGLE_MAP_API = 'AIzaSyArng3Dcnpy2bc086qO1FY2cIN-N_rWfwQ'

const containerStyle = {
    width: '400px',
    height: '400px'
}

type latLng = {
    lat: number,
    lng: number
}

type returnMapCall = {
    data: {
        center: latLng,
        results: Array<any>
    }
}
let focusMap


const MapView = () => {
    const [centerLocation, setCenterLocation] = useState<latLng>({ lat: -25.344, lng: 131.031 })
    const [search, setSearch] = useState('')
    const [markers, setMarkers] = useState([])
    const [map, setMap] = useState(null)

    useEffect(function() {
        initMap()
    }, [centerLocation])

    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        const infoWindow = new google.maps.InfoWindow()
        
        
        let focusMap = new Map(document.getElementById("map") as HTMLElement, {
            zoom: 10,
            center: centerLocation,
            mapId: "demo_map_id"
        })
        
        markers.forEach(m => {
            const marker = new AdvancedMarkerElement({
                map: focusMap,
                position: m['geometry']['location'],
                title: m['name']
            })
            marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.setContent(`<div><h3>${marker.title}</h3></div>`);
                infoWindow.open(marker.map, marker);
              });
        })
        
    }

    const searchLocation = async () => {
        try {
            const data = await api.post('/maps/search-by-zip', {address: search}) as returnMapCall
            console.log(data)
            setMarkers(data.data.results as any)
            setCenterLocation(data.data.center as latLng)
        } catch (e)  {
            console.log(e)
            return
        }
        
    }
    return (
        <>
        <TextField label="search location" fullWidth value={search} onChange={(e) => {setSearch(e.target.value)}}></TextField>
        <Button onClick={() => {searchLocation()}}>Search</Button>
        <div id="map" style={{height: '400px', width: '400px'}}></div></>
    )
}

export default MapView;