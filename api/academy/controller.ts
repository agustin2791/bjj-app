import { connect } from '../../mongodb';
import express, { Express, Request, Response } from "express";
import { Academy, AcademyClass, Schedule } from './schema';
import { Schema, Types } from "mongoose";

const app: Express = express()

// ACADEMY API ==========================================
module.exports = app.post('/get_academy', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_id = req.body.data.academy_id
        // populate all other fields when ready
        const academy = await Academy.findOne({_id: academy_id})
            .populate('head_instructor_id')

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
        if (academy.affiliation_id === '')
            academy.affiliation_id = null
        console.log(academy)
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
    update_field: string,
    update_value: string
}

module.exports = app.post('/update_academy', async (req: Request, res: Response) => {
    await connect()

    try {
        const {academy_id, update_field, update_value}: academyUpdateInput = req.body.data

        const academy = await Academy.findOneAndUpdate({_id: academy_id}, {[update_field]: update_value})
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

// Schedule API =====================================
module.exports = app.post('/create_schedule', async (req: Request, res: Response) => {
    await connect()

    try {
        const academy_id = req.body.data.academy_id
        const schedule_bus = req.body.data.schedule

        const academy = await Academy.findOne({_id: academy_id})
        const schedule = new Schedule(schedule_bus)
        await schedule.save()

        academy?.schedule.push(schedule)
        await academy?.save()
        return res.status(200).json(academy)
    } catch (e) {
        console.log(e)
        return res.status(404).send('did not create schedule')
    }
})

interface ClassSchedule {
    schedule: string,
    name: string,
    start: string,
    end: string,
    instructor: string,
    instructor_id: string,
    description: string
}
module.exports = app.post('/create_class', async (req: Request, res: Response) => {
    await connect()
    
    try {
        const class_schedule: ClassSchedule = req.body.data.class
        const schedule_id = req.body.data.schedule_id

        const schedule = await Schedule.findOne({_id: schedule_id})
        const new_class = new AcademyClass(class_schedule)
        await new_class.save()

        schedule?.classes.push(new_class)
        await schedule?.save()

        return res.status(200).json(schedule)
    } catch (e) {
        console.log(e)
        return res.status(404).send('class not created')
    }
})

interface classUpdateInput {
    class_id?: string,
    update_field: string,
    update_value: string
}
module.exports = app.post('/update_class', async (req: Request, res: Response) => {
    await connect()

    try {
        const {class_id, update_field, update_value}: classUpdateInput = req.body.data
        const updateClass = await AcademyClass.findOneAndUpdate({_id: class_id}, {[update_field]: update_value})
        updateClass?.save()
        return res.status(200).json(updateClass)
    } catch (e) {
        return res.status(404).send('nothing was updated')
    }
})

module.exports = app.post('/delete_class', async (req: Request, res: Response) => {
    await connect()

    try {
        const {class_id}: classUpdateInput = req.body.data
        await AcademyClass.findOneAndDelete({_id: class_id})

        return res.status(200).json({'message': 'Class deleted'})
    } catch (e) {
        return res.status(404).send('nothing was deleted')
    }
})