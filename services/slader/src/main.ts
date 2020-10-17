import puppeteer from "puppeteer";
import http from "http";
import {
  assoc,
  compose,
  curry,
  curryN,
  groupBy,
  invoker,
  keys,
  map,
  mergeRight,
  pipe,
  prop,
  sortBy,
  transpose,
  uniqBy,
  zip,
  zipWith,
  __,
} from "ramda";
import fs from "fs";
import path from "path";

let noop = () => {};

enum Tags {
  searchBox = 'input[name="search_query"]',
  bookResults = "section.Textbook__search__results .Textbook__hit",
  bookTitle = ".Textbook__hit__title",
}

enum URL {
  slader = "https://www.slader.com/",
}

interface Question {
  page: number;
  number: number;
  chapter?: number;
  section?: number;
}

const beHuman = true;
const imagePath = curryN(4, path.join)(__dirname, "../assets", "images");

async function getTexbooks(browser: puppeteer.Browser, searchTerm: string) {
  let page = await browser.newPage();
  await page.goto(URL.slader, { waitUntil: "networkidle2" });

  let searchBox = await page.$(Tags.searchBox);
  await searchBox.click();
  await page.keyboard.type(searchTerm, { delay: beHuman ? 100 : 0 });

  let bookResults = await page.$$(Tags.bookResults);
  let bookProperties = await Promise.all(
    bookResults.map((book) => {
      return Promise.all([
        book.getProperty("href").then(invoker(0, "jsonValue")),
        book
          .$(Tags.bookTitle)
          .then(invoker(1, "getProperty")("innerText"))
          .then(invoker(0, "jsonValue")),
      ]);
    })
  );

  let [hrefs, titles] = transpose(bookProperties);

  // await Promise.all(
  //   bookResults.map((r, i) =>
  //     Promise.all([r.screenshot({ path: imagePath(`books/${titles[i]}.png`) })])
  //   )
  // );

  page.close();
  return zipWith((href, title) => ({ href, title }), hrefs, titles);
}

// async function getAnswers(
//   browser: puppeteer.Browser,
//   questions: Question[],
//   bookUrl: string
// ) {
//   let sortedQuestions = sortBy(
//     (question) => parseInt(`${question.page}${question.number}`),
//     questions
//   );

//   let questionsByPage = groupBy(pipe(prop("page"), String), questions);

//   //open 1 web page per book page

//   let questionPages = await Promise.all(
//     keys(questionsByPage).map(
//       (pageNumber): Promise<{ [key: number]: puppeteer.Page }> => {
//         return browser.newPage().then(
//           invoker(2, "goto")(path.join(bookUrl, String(pageNumber)), {
//             waitUntil: "networkidle2",
//           }).then(assoc("ref", __, { pageNumber }))
//         );
//       }
//     )
//   );

//   await questionPages.map(questionPage => )

//   // let getQuestionElements = curry((pageNumber: number, page: puppeteer.Page) =>
//   //   page.$$(".exercise-in-group-item").then()
//   // );

// }

interface HandlerResources {
  browser: puppeteer.Browser;
}
function makeRequestHandler(resources: HandlerResources) {
  const requestHandler: http.RequestListener = function requestHandler(
    request,
    response
  ) {
    response.end("");
  };
  return requestHandler;
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const port = 3000;
  const requestHandler = makeRequestHandler({ browser });
  const server = http.createServer(requestHandler);

  server.listen(port, () => console.log(`listening on port ${port}`));

  function teardown() {
    browser.close();
    server.close();
  }

  process.on("SIGINT", teardown);
  process.on("exit", teardown);
}

// main()

export async function test() {
  const browser = await puppeteer.launch({ headless: true });
  let books = await getTexbooks(browser, "stewarts calculus");
  console.log(books);
  debugger;
}

test();
