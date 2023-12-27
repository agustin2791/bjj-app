import { useState } from "react"
import { useParams } from "react-router-dom"


const AcademyDetails = () => {
    const {academy} = useParams()
    const [editView, setEditView] = useState('')

    return (
        <div>
            Details
        </div>
    )
}

export default AcademyDetails