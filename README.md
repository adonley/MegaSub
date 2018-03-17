MegaDonger
---
Add/Remove megasubs to bulldog's friends list automatically.

_Disclaimer:_ I don't normally write node server code. I would put this server behind a firewall and not allow access to it's serving port (3000) while it is running. This is intended to be used as an internal server.

### Technology
* Node
* Handlebars
* DB -> TBD with BDog's current tech stack

### Installation

```
npm install
```

### Running
```
node server --username=steamUsername --password=steamPassword (--authcode=<email_auth_code>)
```

### License

MIT.

Copyright 2018 Andrew Donley

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.