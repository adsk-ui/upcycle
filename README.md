#Upcycle
=======
See documentation at [adsk-ui.github.io/upcycle](http://adsk-ui.github.io/upcycle/)

##Setup
----------------------------
1. Clone repo
2. Install [Node](http://nodejs.org/), [Bower](http://bower.io) and [gulp](http://gulpjs.com/)
3. Install bower dependencies (`bower install`)
4. Install npm dependencies (`npm install`)
5. Start dev server `gulp`
5. Open [http://localhost:8080/test/](http:localhost:8080/test/) in a browser to see unit tests


##Build and Development
Gulp tasks:
- `templates`: Compiles Handlebars templates in /src/templates to /src/js/templates.js
- `less`: Compiles /src/less/main.less to /src/css/main.css
- `test`: Wires bower dependencies, source files and unit test files to test runner template and produces /test/runner.html
- `build`: Saves concatenated src js to /build/upcycle.js and compiled theme css /build/themes/themename.css
- `watch`: runs above tasks when source files change
- `default`: starts up connect server and then watch task


