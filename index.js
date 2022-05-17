import chalk from 'chalk'
import fs from 'fs'

function linksFromMarkdown(text) {
    const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm
    const array = []
    let temp

    while((temp = regex.exec(text)) !== null) {
        array.push({ [temp[1]]: temp[2]})
    }

    return array
}

export default async function readMarkdown(path) {
    const encoder = 'utf-8'

    try {
        const data = await fs.promises.readFile(path, encoder);
        const links = linksFromMarkdown(data)
        return links
    } catch(err) {
       console.error(chalk.red((`${err.code} / File not found in ${err.path}.`)))
    }
}