import { Button, TextField } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import api from "../../axios";
import { Academy } from "../../utils/types_interfaces";
import { getAcademyList } from "../../utils/academy-utils";
import MapTooltip from "./map/tooltip";

const containerStyle = {
    width: '400px',
    height: '400px'
}

type mapsProps = {
    width?: string,
    height?: string,
    multiple: boolean,
    showDetails?: Function,
    location?: latLng,
    pushAcademyList?: Function,
    selectAcademyByAddress?: {name: string, address: string}
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
    const { width, height, multiple, showDetails, location, pushAcademyList, selectAcademyByAddress } = props
    const [centerLocation, setCenterLocation] = useState<latLng>(location ? location : { lat: 39.7, lng: -104.99 })
    const [search, setSearch] = useState('')
    const [showMap, setShowMap] = useState(!multiple)
    const [mapDetails, setMapDetails] = useState<google.maps.Map>()
    const [mapInfo, setMapInfo] = useState<google.maps.InfoWindow>()
    const [mapMarkers, setMapMarkers] = useState<any[]>([])
    const [markers, setMarkers] = useState<mapMarkerReturn[]>([])
    const [academyList, setAcademyList] = useState<Array<Academy>>([])

    useEffect(function() {
        if (!multiple)
            getMap()
    }, [centerLocation])
    useEffect(function () {
        initMap()
        concatAcademyList()
    }, [markers])

    useEffect(function () {
        if (selectAcademyByAddress) {
            mapMarkers.forEach(m => {
                // console.log('map marker view', m.title)
                if (selectAcademyByAddress?.address === m.title) {
                    mapInfo?.close()
                    mapInfo?.setContent(`<h4>${selectAcademyByAddress?.name}</h4> <p>${selectAcademyByAddress?.address}</p>`)
                    setFocusAcademy(selectAcademyByAddress?.address, selectAcademyByAddress?.name, academyList)
                    mapInfo?.open(m.map, m)
                }
            })
            
        }
    }, [selectAcademyByAddress])

    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        const infoWindow = new google.maps.InfoWindow()
        
        
        let focusMap = new Map(document.getElementById("map") as HTMLElement, {
            zoom: multiple ? 11 : 13,
            center: centerLocation,
            mapId: "demo_map_id"
        })
        let mapMarkersData = [] as any[]
        if (multiple) {
            markers.forEach(m => {
                const marker = new AdvancedMarkerElement({
                    map: focusMap,
                    position: m['geometry']['location'],
                    title: m['formatted_address'],

                })
                
                marker.addListener("click", function() {
                    console.log('marker clicked', marker)
                    infoWindow.close();
                    infoWindow.setContent(`<h4>${m.name}</h4> <p>${m.formatted_address}</p>`);
                    setFocusAcademy(m.formatted_address, m.name, academyList)
                    infoWindow.open(marker.map, marker);
                });
                mapMarkersData.push(marker)
                
            })
            setMapMarkers(mapMarkersData)
            setMapInfo(infoWindow)
            setMapDetails(focusMap)
        } else {
            const marker = new AdvancedMarkerElement({
                map: focusMap,
                position: centerLocation
            })
        }
        
    }

    const getMap = async () => {
        return
    }
    const concatAcademyList = () => {
        const marks = markers
        const academy_list_flat = academyList.map(m => {return m.formattedAddress})
        const filtered_addresses = marks.filter(m => !academy_list_flat.includes(m.formatted_address))
        const all_addresses: any = academyList.map((a) => {
            return {name: a.name, address: a.formattedAddress}
        }).concat(filtered_addresses.map(a => {
            return {name: a.name, address: a.formatted_address}
        }))
        if (pushAcademyList)
            pushAcademyList(all_addresses)
    }
    const searchLocation = async () => {
        try {
            setShowMap(true)
            await api.post('/maps/search-by-zip', {address: search})
                .then(async (res) => {
                    const marks = res.data.results as mapMarkerReturn[]
                    
                    if (multiple) {
                        const addresses = marks.map((m) => {return m.formatted_address})
                        const academy_data = await getAcademyList(addresses)
                        setAcademyList(academy_data as Academy[])
                        concatAcademyList()
                    }
                    
                    setMarkers(marks)
                    setCenterLocation(res.data.center as latLng)
                    return res
                })
        } catch (e)  {
            console.log(e)
            return
        }
        
    }

    const updateMarkers = async () => {
        if (multiple) {
            console.log(markers)
            const addresses = markers.map((m) => {return m.formatted_address})
            const academy_data = await getAcademyList(addresses)
            
            setAcademyList(academy_data as Academy[])
            console.log(academy_data)
        } else {
            return
        }
    }
    const setFocusAcademy = (address: string, a_name: string, list: Academy[]) => {
        const details = list.filter(a => {
            return a.formattedAddress === address
        })
        let detailsProps
        if (details.length > 0) {
            detailsProps = {
                name: details[0].name,
                slug: details[0].slug,
                has_page: true,
                address: address,
                head_instructor: details[0].head_instructor,
                phone_number: details[0].phone_number,
                website: details[0].website,
                email: details[0].preferred_email
            }
        } else {
            detailsProps = {
                name: a_name,
                has_page: false,
                address: address
            }
        }
        if (showDetails) {showDetails(detailsProps)}
        
    }
    return (
        <>
            {multiple && <div>
                <TextField label="search location" fullWidth value={search} onChange={(e) => {setSearch(e.target.value)}}></TextField>
                <Button onClick={() => {searchLocation()}}>Search</Button>
            </div>}
            {showMap && <div id="map" style={{height: height ? height : '100%', width: width ? width : '100%'}}></div>}
        </>
    )
}

export default MapView;