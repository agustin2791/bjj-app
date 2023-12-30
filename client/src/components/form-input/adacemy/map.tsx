import { Button, TextField } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import api from "../../../axios";
import { Academy } from "../../../utils/types_interfaces";
import { getAcademyList } from "../../../utils/academy-utils";

const containerStyle = {
    width: '400px',
    height: '400px'
}

type mapsProps = {
    width?: string,
    height?: string,
    multiple: boolean
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

type mapMarkerReturn = {
    business_status: string,
    geometry: any,
    icon: string,
    icon_background_color: string,
    icon_mask_base_uri: string,
    name: string,
    opening_hours: any,
    photos: any,
    place_id: string,
    plus_code: string
    rating: number,
    reference: string,
    scope: string,
    types: any,
    user_ratings_total: number,
    vicinity: string,
    formatted_address: string
}
let focusMap


const MapView: FC<mapsProps> = (props) => {
    const { width, height, multiple } = props
    const [centerLocation, setCenterLocation] = useState<latLng>({ lat: -25.344, lng: 131.031 })
    const [search, setSearch] = useState('')
    const [markers, setMarkers] = useState<mapMarkerReturn[]>([])
    const [academyList, setAcademyList] = useState<Array<Academy>>([])

    useEffect(function() {
        if (!multiple)
            getMap()
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

    const getMap = async () => {
        return
    }

    const searchLocation = async () => {
        try {
            const data = await api.post('/maps/search-by-zip', {address: search}) as returnMapCall
            setMarkers(data.data.results as mapMarkerReturn[])

            if (multiple) {
                const addresses = markers.map((m) => {return m.formatted_address})
                const academy_data = await getAcademyList(addresses)
                console.log(academy_data)
                setAcademyList(academy_data as Academy[])
            }
            setCenterLocation(data.data.center as latLng)
        } catch (e)  {
            console.log(e)
            return
        }
        
    }
    return (
        <>
        {multiple && <div>
            <TextField label="search location" fullWidth value={search} onChange={(e) => {setSearch(e.target.value)}}></TextField>
            <Button onClick={() => {searchLocation()}}>Search</Button>
        </div>}
        
        <div id="map" style={{height: '400px', width: '400px'}}></div></>
    )
}

export default MapView;