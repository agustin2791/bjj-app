import { Box, Grid, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import MapView from "../../components/adacemy/map";
import FindDetails from "../../components/adacemy/map/findDetails";
import { useEffect, useState } from "react";

type detailsProps = {
    name: string,
    slug?: string,
    has_page: boolean,
    address: string,
    head_instructor?: string,
    phone_number?: string,
    website?: string,
    email?: string
}
const defaultFocus: detailsProps = {
    name: '',
    has_page: false,
    address: ''
}
const FindAcademy = () => {
    const [academyFocus, setAcademyFocus] = useState<detailsProps>(defaultFocus)
    const [academiesFound, setAcademiesFound] = useState<any[]>([])
    const [filteredFound, setFilteredFound] = useState<any[]>([])
    const [hasFocus, setHasFocus] = useState(false)
    const [findInMap, setFindInMap] = useState<{name: string, address: string}>()
    const [hasMap, setHasMap] = useState(false)

    useEffect(() => {
        if (academyFocus !== defaultFocus) setHasFocus(true)
        else setHasFocus(false)
        filterAcademies()
    }, [academyFocus])

    const FocusOnAcademy = (details: detailsProps) => {
        setAcademyFocus(details)
    }

    const setFoundAcademies = (academy_list: any[]) => {
        console.log('setting academies')
        setAcademiesFound(academy_list)
        filterAcademies()
        setHasMap(academy_list.length > 0)
    }

    const filterAcademies = () => {
        if (hasFocus) {
            const filtered_out = academiesFound?.filter(a => a.address !== academyFocus.address)
            setFilteredFound(filtered_out)
        } else {
            setFilteredFound(academiesFound)
        }
    }

    const selectAcademyFromList = (a_name: string, address: string) => {
        setFindInMap({name: a_name, address: address})
    }

    const listClasses = (address: string) => {
        if (address === academyFocus.address)
            return 'academy-list highlighted'
        else 
            return 'academy-list'
    }

    return (
        <Box sx={{height: 'calc(100% - 95px)', }}>
            <Grid container sx={{height: "100%"}} alignItems={{sm: 'stretch'}} spacing={2}>
                <Grid item sx={{padding: '20px'}} sm={12} md={hasMap ? 6 : 12}>
                    {!hasMap && 
                    <Typography variant='h4'>Search for an Academy</Typography>}
                    <MapView multiple={true} showDetails={FocusOnAcademy} pushAcademyList={setFoundAcademies} selectAcademyByAddress={findInMap} />
                </Grid>
                {hasMap && 
                <Grid item sm={12} alignSelf={'center'} md={6} sx={{overflow: 'hidden', height: '100%'}}>
                    <Stack spacing={3} sx={{height: '100%'}}>
                        <Paper sx={{overflow: 'auto', height: hasFocus ? '70%' : '0%'}}>
                            {hasFocus && <FindDetails {...academyFocus} />}
                        </Paper>
                        <Paper sx={{overflow: 'auto', height: hasFocus ? '30%' : '100%'}}>
                        <List className="academy-list-container" >
                            {academiesFound.map(f => {
                                return (
                                    <ListItem className={listClasses(f.address)} key={f.name} onClick={() => {selectAcademyFromList(f.name, f.address)}}><Typography variant="h4">{f.name}</Typography></ListItem>
                                )
                            })}
                        </List>
                        </Paper>
                    </Stack>
                    
                    
                </Grid>}
            </Grid>
        </Box>
    )
}

export default FindAcademy;