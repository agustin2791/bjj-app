import axios from "axios";
import express, { Express, Request, Response } from "express";

const app: Express = express()
const GOOGLE_MAP_API = 'AIzaSyArng3Dcnpy2bc086qO1FY2cIN-N_rWfwQ'

type locationSearch = {
    zip?: number,
    address: string,
    city?: string
}
module.exports = app.post('/search-by-zip', async (req: Request, res: Response) => {
    const { address }: locationSearch = req.body
    try {
        const location_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${address.replace(/ /g, '%2C')}&inputtype=textquery&key=${GOOGLE_MAP_API}`
        const location_data = await axios.get(location_url)
        if (location_data.data.status === 'OK') {
            const latLng = location_data.data.candidates[0].geometry.location
            const places_url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=brazilian%20jiujitsu&location=${latLng.lat}%2C${latLng.lng}&radius=10000&minprice=2&key=${GOOGLE_MAP_API}`

            const place_data = await axios.get(places_url)
            let output = {
                center: location_data.data.candidates[0].geometry.location,
                results: []
            }
            if (place_data.data.status === 'OK') {
                output.results = place_data.data.results
                return res.status(200).json(output)
            } else {
                return res.status(404).send('not found')
            }
        }
    } catch (e) {
        return res.status(404).send('not found')
    }
})