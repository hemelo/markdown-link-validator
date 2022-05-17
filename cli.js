#!/usr/bin/env node

import interpretaArquivo from './index.js'
import getStatusLinks  from './http-validate.js'
import chalk from 'chalk'
import { program } from 'commander';
import simplur from 'simplur';

program
  .name('markdown-link-validator')
  .description('CLI to validate markdown links')
  .version('1.0.0');

program.requiredOption('-m, --markdown <markdown>', 'Markdown file should be specified')
program.option('--validate', 'Validate if url\'s from markdown returns status OK')
program.option('--details', 'Show all links found on markdown file')

program.parse(process.argv)
const options = program.opts();

let links
if(options.markdown !== undefined) {
    links = await readMarkdown(options.markdown);

    if(links !== undefined) {
        console.log(chalk.yellow(simplur`${links.length} link[|s] [was|were] found on ${options.markdown}`))

        if(links.length !== 0) {
            if(options.details !== undefined && options.validate === undefined) {
                console.log(chalk.green(JSON.stringify(links, null, 2)))
            }

            if(options.validate !== undefined) {
                const responses = await getStatusLinks(links)
                const validLinks = responses.valid
                const invalidLinks = responses.invalid

                if(invalidLinks.length == 0 && validLinks.length > 0) {
                    console.log(chalk.green(`All links are valid`))
                } 

                if(invalidLinks.length > 0 && validLinks.length != 0) {
                    console.log(chalk.green(simplur`Only ${validLinks.length} link[|s] [is|are] valid`))
                }

                if(invalidLinks.length > 0) {
                    console.log(chalk.red(simplur`${invalidLinks.length} link[|s] [is|are] invalid`))
                }

                if(options.details !== undefined) {
                    console.log(chalk.green(JSON.stringify(validLinks, null, 2)))

                    if(invalidLinks.length != 0) {
                        console.log(chalk.red(JSON.stringify(invalidLinks, null, 2)))
                    }
                }
            } 
        }
    }
    
}


