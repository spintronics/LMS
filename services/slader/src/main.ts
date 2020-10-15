import puppeteer from 'puppeteer'
import http from 'http'

enum Tags {
    searchBox = 'input[name="search_query"]',
    searchResults = 'section.Textbook__search__results .Textbook__hit'
}

//page is mutated (pass fresh if it matters)
async function getTexbook(browser: puppeteer.Browser, searchTerm: string) {
    let page = await browser.newPage()
    await page.goto('https://www.slader.com/', { waitUntil: "networkidle2" })
    let searchBox = await page.$(Tags.searchBox)
    await searchBox.click()
    await page.keyboard.type(searchTerm, { delay: 100 })
    let results = await page.$$(Tags.searchResults)
        .then(elements => {
            return Promise.all(
                elements.map(element => {
                    return element.screenshot().then(screenshot => {
                        return {
                            element: screenshot,
                            href: element.getProperty('href')
                        }
                    }).catch(e => {
                        debugger
                    })
                })
            )
        })
    page.close()
    return results
}

interface HandlerResources {
    browser: puppeteer.Browser
}
function makeRequestHandler(resources: HandlerResources) {
    const requestHandler: http.RequestListener = function requestHandler(
        request, response
    ) {
        response.end('')
    }
    return requestHandler;
}


async function main() {
    const browser = await puppeteer.launch({ headless: false })
    const port = 3000
    const requestHandler = makeRequestHandler({ browser })
    const server = http.createServer(requestHandler)

    server.listen(port, () => console.log(`listening on port ${port}`))

    function teardown() {
        browser.close()
        server.close()
    }

    process.on('SIGINT', _ => teardown)
    process.on('exit', _ => teardown)
}

// main()


export async function test() {
    const browser = await puppeteer.launch({ headless: false })
    let books = await getTexbook(browser, 'stewarts calculus')
    console.log(books)
    debugger
}

test()

