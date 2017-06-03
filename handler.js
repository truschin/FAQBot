'use strict';

const contentful = require('contentful')
const chalk = require('chalk')
const Table = require('cli-table2')

const SPACE_ID = 'h4knt0sejrzk'
const ACCESS_TOKEN = '966e25062db4b34fab821fff767a711d516cda3cd146f6535febecf934fcd8ea'

const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: SPACE_ID,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: ACCESS_TOKEN
})

console.log(chalk.green.bold('\nWelcome to the Contentful JS Boilerplate\n'))
console.log('This is a simplified example to demonstrate the usage of the Contentful CDA\n')

// Entry point of the boilerplate, called at the end.
function runBoilerplate() {
    displayContentTypes()
        .then(displayEntries)
        .then(() => {
        console.log('Want to go further? Feel free to check out this guide:')
    console.log(chalk.cyan('https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/\n'))
})
.
    catch((error) => {
        console.log(chalk.red('\nError occurred:'))
    if (error.stack) {
        console.error(error.stack)
        return
    }
    console.error(error)
})
}

function displayContentTypes() {
    console.log(chalk.green('Fetching and displaying Content Types ...'))

    return fetchContentTypes()
            .then((contentTypes) => {
            // Display a table with Content Type information
            const table = new Table({
                head: ['Id', 'Title', 'Fields']
            })
            contentTypes.forEach((contentType) => {
            const fieldNames = contentType.fields
                    .map((field) => field.name
)
.
    sort()
    table.push([contentType.sys.id, contentType.name, fieldNames.join(', ')])
})
    console.log(table.toString())

    return contentTypes
})
}

function displayEntries(contentTypes) {
    console.log(chalk.green('Fetching and displaying Entries ...'))

    return Promise.all(contentTypes.map((contentType) => {
            return fetchEntriesForContentType(contentType)
                .then((entries) => {
                console.log(`\These are the first 100 Entries for Content Type ${chalk.cyan(contentType.name)}:\n`)

            // Display a table with Entry information
            const table = new Table({
                head: ['Id', 'Title']
            })
            entries.forEach((entry) => {
            table.push([entry.sys.id, entry.fields[contentType.displayField] || '[empty]'])
})
    console.log(table.toString())
})
}))
}

// Load all Content Types in your space from Contentful
function fetchContentTypes() {
    return client.getContentTypes()
            .then((response) => response.items
)
.
    catch((error) => {
        console.log(chalk.red('\nError occurred while fetching Content Types:'))
    console.error(error)
})
}

// Load all entries for a given Content Type from Contentful
function fetchEntriesForContentType(contentType) {
    return client.getEntries({
            content_type: contentType.sys.id
        })
            .then((response) => response.items
)
.
    catch((error) => {
        console.log(chalk.red(`\nError occurred while fetching Entries for ${chalk.cyan(contentType.name)}:`))
    console.error(error)
})
}


function getFAQEntry(faqEntryName){
    return client.getEntries({
        content_type: 'faQs',
        'fields.faqPart[match]': faqEntryName
    }).then((response) => response.items[0].fields.faqPartText)
    .catch((error) => {
        console.log(chalk.red('\nError occurred while fetching entry'))
        console.error(error)
    })
}

function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function printMessage(message){
    console.log(JSON.stringify(message))
}

function dispatch(intentRequest, callback) {
    // console.log(JSON.stringify(intentRequest, null, 2));
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    console.log('intent name: ' + intentName);

    // const sessionAttributes = intentRequest.sessionAttributes || {};

    getFAQEntry(intentName).then((result) => console.log('here is the result: ' + result));

    getFAQEntry(intentName).then((result) => callback(null, close(null, 'Fulfilled', { contentType: 'PlainText', content: result })))
    .catch((error) => {
        console.log(chalk.red('\nError occurred while fetching entry'))
        console.error(error)
    })
}

module.exports.hello = (event, context, callback) =>
{

    // dispatch(event, printMessage);

    dispatch(event, callback);

    // test testbranch new

    // getFAQEntry('AvailableCountries').then((result) => console.log(result))

    /*
    client.getEntries({
        content_type: 'faQs',
        'fields.faqPart[match]': 'AvailableCountries'
    })
    .then((response) => console.log(response.items[0].fields.faqPartText))
    .catch(console.error)
    */

    // .then(callback(null, response));

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}
;
