const knex = require('../../db/knex')
class DepartmentController {
    async createDepartment(req,res){
        try{
            const { admin_id, office, IT } = req.body
            await knex('departments').insert({
                admin_id,
                office,
                IT
            })

            const departments = await knex('departments')
                .select('*')
                .orderBy('id', 'desc')
                .limit(1)

            return res.status(201).json({department: departments[0]})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async deleteDepartment(req,res){
        try{
            const { department_id } = req.params

            const departments = await knex('departments')
                .select('id')
                .where('id', department_id)

            if(departments.length === 0){
                return res.status(404).json({error: 'Department not found'})
            }

            await knex('departments').where('id', department_id).del()

            return res.status(200).json({message: `Department with id ${department_id} was deleted!`})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async getDepartments(req,res){
        try{
            const departments = await knex('departments').select('*')

            return res.status(200).json({departments})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async getDepartmentsByAdmin(req,res){
        try{
            const { id } = req.user
            const departments = await knex('departments')
                .select('*')
                .where('admin_id', id)

            return res.status(200).json({departments})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async getDepartmentById(req,res){
        try{
            const { department_id } = req.params

            const departments = await knex('departments')
                .select('*')
                .where('id', department_id)

            if(departments.length === 0){
                return res.status(404).json({error: 'Department not found'})
            }

            const department = departments[0]

            return res.status(200).json({department})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
}

module.exports = new DepartmentController()