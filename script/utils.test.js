import {parseLink} from './utils.js'

console.log([
  parseLink(
    '<img width="473" alt="Screenshot 2024-04-13 at 12 03 09 PM" src="https://github.com/astoria-tech/meetup/assets/44368856/fa3821b4-adfe-4e91-936c-0fb524f2ca30">',
  ),
  parseLink(
    '<a href="https://github.com/astoria-tech/meetup/assets/44368856/fa3821b4-adfe-4e91-936c-0fb524f2ca30"></a>',
  ),
  parseLink('[meow](https://github.com/astoria-tech/meetup/assets/44368856/fa3821b4-adfe-4e91-936c-0fb524f2ca30)'),
  parseLink('![meow](https://github.com/astoria-tech/meetup/assets/44368856/fa3821b4-adfe-4e91-936c-0fb524f2ca30)'),
  parseLink('https://github.com/astoria-tech/meetup/assets/44368856/fa3821b4-adfe-4e91-936c-0fb524f2ca30'),
  parseLink(
    '[Leveraging Elixir as a two people development shop.pdf](https://github.com/astoria-tech/meetup/files/15184593/Leveraging.Elixir.as.a.two.people.development.shop.pdf)',
  ),
])
