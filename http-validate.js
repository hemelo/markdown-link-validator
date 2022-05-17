import fetch from 'node-fetch'
import chalk from 'chalk'

const MINIMUM_ACCEPTABLE_HTTP_STATUS_CODE = 200
const MAXIMUM_ACCEPTABLE_HTTP_STATUS_CODE = 399

Number.prototype.between = function(a, b) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return this >= min && this <= max;
};
  
async function checkStatus(array) {
     
    const arrayStatus = await Promise
        .all(array
            .map(async url => { 
                try {
                    const res = await fetch(url)
                    return res.status;
                } catch (err) {
                    return 404;
                }
            }))
    return arrayStatus;
}

export default async function getStatusLinks(routes) {
    const links = routes.map(route => Object.values(route).join());
    const statusLinks = await checkStatus(links)

    const results = routes.map((object, index) => ({
        ...object, 
        status: statusLinks[index]
    }))

    const invalidStatus = results.filter(filterInvalidStatus) 
    const validStatus = results.filter(filterValidStatus) 
    
    return { valid: validStatus, invalid: invalidStatus }
}

function filterValidStatus(value) {
    return value.status.between(MINIMUM_ACCEPTABLE_HTTP_STATUS_CODE, MAXIMUM_ACCEPTABLE_HTTP_STATUS_CODE)
}

function filterInvalidStatus(value) { 
    return ! filterValidStatus(value)
}