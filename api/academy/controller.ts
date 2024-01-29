import { connect } from '../../mongodb';
import express, { Express, Request, Response } from "express";
import { Academy, AcademyClass, AcademyClassSchedule, AcademyInstructor, IAcademy, Schedule, updateFormattedAddress } from './schema';
import { Schema, Types } from "mongoose";
import { exec } from 'child_process';

const app: Express = express()

// ACADEMY API ==========================================
module.exports = app.post('/get_academy', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_id = req.body.data.academy_slug
        // populate all other fields when ready
        const academy = await Academy.findOne({slug: academy_id})
            .populate('head_instructor_id')
            .populate('admin')

        return res.status(200).json(academy)
    } catch (e) {
        return res.status(404).send('did not find academy')
    }
})
module.exports = app.post('/create_academy', async (req: Request, res: Response) => {
    await connect()

    try {
        let academy = req.body.data
        let user_owner = req.body.user
        academy.owner = user_owner
        if (academy.slug === '' || academy.slug === undefined) {
            academy.slug = academy.name.replace(/ /g, '-').toLowerCase()
        }
        if (academy.affiliation_id === '')
            academy.affiliation_id = null
        const new_academy = new Academy(academy)
        new_academy.admin.push(user_owner)
        await new_academy.save()

        return res.status(200).json(new_academy)

    } catch (e) {
        console.log(e)
        return res.status(404).send('Not created')
    }
})

interface academyUpdateInput {
    academy_id: string,
    updates: IAcademy
}

module.exports = app.post('/update_academy', async (req: Request, res: Response) => {
    await connect()

    try {
        const {academy_id, updates}: academyUpdateInput = req.body.data

        const academy = await Academy.findOneAndUpdate({_id: academy_id}, updates)
        await academy?.save()
        console.log(academy?.formattedAddress, updates?.address)
        if (!academy?.formattedAddress || 
            !academy?.formattedAddress.includes(updates?.address.street) ||
            !academy?.formattedAddress.includes(updates?.address.city) ||
            !academy?.formattedAddress.includes(updates?.address.state) ||
            !academy?.formattedAddress.includes(updates?.address.zip_code) ||
            !academy?.formattedAddress.includes(updates?.address.country)
            ) 
        {
            interface updateFormatAddress {formattedAddress: string, location: {lat: number, lng: number}}
            let {formattedAddress, location} = await updateFormattedAddress(updates?.address) as updateFormatAddress
            console.log(formattedAddress, location)
            academy?.updateOne({formattedAddress: formattedAddress}).exec()
            academy?.updateOne({location: location}).exec()
        }
        await academy?.save()
        return res.status(200).json(academy)
    } catch (e) {
        return res.status(404).send('Did not update')
    }
})

module.exports = app.post('/delete_academy', async (req: Request, res: Response) => {
    await connect()

    try {
        const {academy_id}: academyUpdateInput = req.body.data

        await Academy.findOneAndDelete({_id: academy_id})
        return res.status(200).json({'message': 'Academy deleted.'})
    } catch (e) {
        return res.status(404).send('academy still active')
    }
})
// Classes API ======================================
module.exports = app.post('/get_academy_classes', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_id = req.body.academy_id
        if (academy_id.length <= 0) return res.status(404).json([])
        // const academy_classes_query = AcademyClass.where({academy_id})
        const academy_classes = await AcademyClass.find({academy: {_id: academy_id}})
        
        return res.status(200).json(academy_classes)
    } catch (e) {
        console.log(e)
        return res.status(404).json([])
    }
})
module.exports = app.post('/create_class', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_id = req.body.academy_id
        const class_details = req.body.class_details

        const academy = await Academy.findOne({_id: academy_id})
        const academy_class = new AcademyClass(class_details)
        await academy_class.save()
        
        return res.status(200).json(academy_class)
    } catch (e) {
        console.log(e)
        return res.status(404).send('Class Not Created')
    }
})

module.exports = app.post('/update_class', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_details = req.body.academy_details
        const req_user = req.body.user

        const class_update = await AcademyClass.findOneAndUpdate({_id: academy_details._id}, academy_details)
        await class_update?.save()
        return res.status(200).json(class_update)
    } catch (e) {
        console.log(e)
        return res.status(404).send('Class not updated')
    }
})

module.exports = app.post('/delete_class', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_class_id = req.body.class_id

        await AcademyClass.findOneAndDelete({_id: academy_class_id})
        return res.status(200).json({'message': 'class was deleted'})
    } catch (e) {
        console.log(e)
        return res.status(404).send('Nothing was deleted')
    }
})

// Schedule API =====================================
module.exports = app.post('/get_full_schedule', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_classes = req.body.class_list
        const academy_class_schedule = await AcademyClassSchedule.find({academy_class: {$in: academy_classes}})
            .populate('academy_class')

        return res.status(200).json(academy_class_schedule)
    } catch (e) {
        console.log(e)
        return res.status(404).json({'message': 'schedule not found'})
    }
})

module.exports = app.post('/get_class_schedule', async (req: Request, res: Response) => {
    await connect()

    try {
        const class_id = req.body.class_id

        const schedule = await AcademyClassSchedule.find({academy_class: {_id: class_id}})
        if (schedule.length > 1) {
            const to_keep = schedule[0]
            schedule.forEach(async s => {
                if (s._id !== to_keep._id) {
                    await AcademyClassSchedule.findOneAndDelete({_id: s._id})
                }
            })
        }
        if (schedule.length > 0) {
            return res.status(200).json(schedule[0])
        } else {
            const academy_class = await AcademyClass.findOne({_id: class_id})
            const new_schedule = new AcademyClassSchedule({
                academy_class: academy_class
            })
            await new_schedule.save()

            return res.status(200).json(new_schedule)
        }
    } catch (e) {
        // console.log(e)
        return res.status(404).send('schedule not found')
    }
})

module.exports = app.post('/update_class_schedule', async (req: Request, res: Response) => {
    await connect()

    try {
        const details = req.body.details
        const schedule_id = details._id
        const updates = await AcademyClassSchedule.findByIdAndUpdate(schedule_id, details)
        await updates?.save()
        
        return res.status(200).json(updates)

    } catch (e) {
        console.log(e)
        return res.status(404).send('schedule not updated')
    }
})

// module.exports = app.post('/create_schedule', async (req: Request, res: Response) => {
//     await connect()

//     try {
//         const academy_id = req.body.data.academy_id
//         const schedule_bus = req.body.data.schedule

//         const academy = await Academy.findOne({_id: academy_id})
//         const schedule = new Schedule(schedule_bus)
//         await schedule.save()

//         academy?.schedule.push(schedule)
//         await academy?.save()
//         return res.status(200).json(academy)
//     } catch (e) {
//         console.log(e)
//         return res.status(404).send('did not create schedule')
//     }
// })

// interface ClassSchedule {
//     schedule: string,
//     name: string,
//     start: string,
//     end: string,
//     instructor: string,
//     instructor_id: string,
//     description: string
// }
// module.exports = app.post('/create_schedule_class', async (req: Request, res: Response) => {
//     await connect()
    
//     try {
//         const class_schedule: ClassSchedule = req.body.data.class
//         const schedule_id = req.body.data.schedule_id

//         const schedule = await Schedule.findOne({_id: schedule_id})
//         const new_class = new AcademyClassSchedule(class_schedule)
//         await new_class.save()

//         schedule?.classes.push(new_class)
//         await schedule?.save()

//         return res.status(200).json(schedule)
//     } catch (e) {
//         console.log(e)
//         return res.status(404).send('class not created')
//     }
// })

// interface classUpdateInput {
//     class_id?: string,
//     update_field: string,
//     update_value: string
// }
// module.exports = app.post('/update_schedule_class', async (req: Request, res: Response) => {
//     await connect()

//     try {
//         const {class_id, update_field, update_value}: classUpdateInput = req.body.data
//         const updateClass = await AcademyClassSchedule.findOneAndUpdate({_id: class_id}, {[update_field]: update_value})
//         updateClass?.save()
//         return res.status(200).json(updateClass)
//     } catch (e) {
//         return res.status(404).send('nothing was updated')
//     }
// })

// module.exports = app.post('/delete_schedule_class', async (req: Request, res: Response) => {
//     await connect()

//     try {
//         const {class_id}: classUpdateInput = req.body.data
//         await AcademyClassSchedule.findOneAndDelete({_id: class_id})

//         return res.status(200).json({'message': 'Class deleted'})
//     } catch (e) {
//         return res.status(404).send('nothing was deleted')
//     }
// })

// Academy Instructor
module.exports = app.post('/get_instructors', async (req: Request, res: Response) => {
    await connect()
    try {
        const academy_id = req.body.data
        const instructors = await AcademyInstructor.find({academy: {_id: academy_id}})
            .populate('user')
            .populate('academy_classes')
        
        return res.status(200).json(instructors)
        
    } catch (e) {
        return res.status(404).send('no academy instructor found')
    }
})

module.exports = app.post('/create_instructor', async (req: Request, res: Response) => {
    await connect()
    try {
        const instructor_details = req.body.data

        const new_instructor = new AcademyInstructor(instructor_details)
        await new_instructor.save()

        return res.status(200).json(new_instructor)
    } catch (e) {
        console.log(e)
        return res.status(404).send('No instructor created')
    }
})

module.exports = app.post('/update_instructor', async (req: Request, res: Response) => {
    await connect()
    try {
        const instructor_edits = req.body.data

        const instructor = await AcademyInstructor.findByIdAndUpdate(instructor_edits._id, instructor_edits)
        
        return res.status(200).json(instructor)
    } catch (e) {
        console.log(e)
        return res.status(404).send('Nothing was updated')
    }
})

module.exports = app.post('/delete_instructor', async (req: Request, res: Response) => {
    await connect()

    try {
        const instructor_id = req.body.data
        await AcademyInstructor.findOneAndDelete({_id: instructor_id})
        return res.status(200).json({"message": "Delete was successfull"})
    } catch (e) {
        return res.status(404).send('Nothing was deleted')
    }
})