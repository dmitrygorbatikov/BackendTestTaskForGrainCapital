const knex = require('../../db/knex')

class UserServices {
    async minDateFrom(table) {

        let result = {
            minDateFrom: new Date(),
            maxDateTo: new Date()
        }
        let tableDateFrom = await knex(table).select('created_at').orderBy('id', 'asc').limit(1)
        let tableDateTo = await knex(table).select('created_at').orderBy('id', 'desc').limit(1)

        if(tableDateFrom.length > 0) {
            result = {
                minDateFrom: tableDateFrom[0].created_at,
                maxDateTo: tableDateTo[0].created_at,
            }
        }

        return result

    }
}

module.exports = new UserServices()