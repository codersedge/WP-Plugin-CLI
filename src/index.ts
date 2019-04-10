#!/usr/bin/env node

import * as figlet from 'figlet';
import * as inquirer from 'inquirer';
import * as fs from 'fs';


const CURR_DIR = process.cwd();

figlet('WP Plugin CLI', (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    start();
});

function start() {

    const QUESTIONS = [
        {
            name: 'project-name',
            type: 'input',
            message: 'Project name:',
            validate: function (input) {
                // if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                // else return 'Project name may only include letters, numbers, underscores and hashes.';
                return true;
            }
        }
    ];

    inquirer.prompt(QUESTIONS)
        .then(answers => {
            const projectName = answers['project-name'];
            const templatePath = `${__dirname}/templates/`;

            const newProjectPath = getProjectSlug(projectName);

            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}`);

            createDirectoryContents(templatePath, newProjectPath, projectName);
        });

}

function createDirectoryContents(templatePath, newProjectPath, projectName) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        const fileName = file.replace('plugin-name', getProjectSlug(projectName));

        if (stats.isFile()) {
            const _contents = fs.readFileSync(origFilePath, 'utf8');

            const contents = replaceContents(_contents, projectName);

            const writePath = `${CURR_DIR}/${newProjectPath}/${fileName}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`, projectName);
        }
    });
}

function getProjectSlug(projectName: string) {
    let fileName: string;
    var res = projectName.split(" ");

    if (res.length > 1) {
        fileName = projectName.replace(/ /g, "-");
    } else {
        fileName = projectName;
    }
    return fileName;
}

function replaceContents(content: string, projectName: string) {
    const _expressions = expressions(projectName)
    return content
    .replace(/plugin_name/g, _expressions["plugin_name"])
    .replace(/plugin-name/g, _expressions["plugin-name"])
    .replace(/Plugin_Name/g, _expressions["Plugin_Name"])
    .replace(/PLUGIN_NAME_/g, _expressions["PLUGIN_NAME_"]);
}

function expressions(projectName: string) {

    let plugin_name: string, plugin__name: string, PLUGIN_NAME_: string, Plugin_Name: string = "";

    projectName = projectName.toLowerCase();

    var res = projectName.split(" ");

    if (res.length > 1) {
        plugin_name = projectName.replace(/ /g, "_");
        plugin__name = projectName.replace(/ /g, "-");
        res.forEach(word => {
            Plugin_Name += word.substr(0, 1).toUpperCase() + word.substring(1).toLowerCase() + "_";
        });
        Plugin_Name = Plugin_Name.substr(0, Plugin_Name.length - 1);
    } else {
        plugin_name = projectName;
        plugin__name = projectName;
        Plugin_Name = projectName.substr(0, 1).toUpperCase() + projectName.substring(1);
    }

    PLUGIN_NAME_ = plugin_name.toUpperCase() + "_";

    return {
        "plugin-name": plugin__name,
        "plugin_name": plugin_name,
        "PLUGIN_NAME_": PLUGIN_NAME_,
        "Plugin_Name": Plugin_Name
    };
}