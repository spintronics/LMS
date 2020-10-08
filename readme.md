using software to improve learning experiences

modify the main function of spaced_repition with a list of problems numbers (dont use 0). running the file will guide you through learning whatever material you're working on. The idea is to make learning more efficient so you don't have to wonder which content to study next.

Feel free to use, distribute, modify or ignore this code. I'll take no responsibility if your computer blows up.

todo

- set up docker services
- handle api requests on server
- implement a stream interface for components to decouple them from the data source
- figure out how to implement an interlanguage spec (perhaps from a graphql scheme)

Import components at the page level (no root app entry) and use normal html. actions should be performed through global streams. there's no reason to worry about including dependencies in components since nothing is bundled.
