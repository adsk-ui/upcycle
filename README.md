upcycle
=======

Setup
----------------------------
1. Clone repo from GitHub
2. Install [Node](http://nodejs.org/), [Bower](http://bower.io) and [gulp](http://gulpjs.com/)
3. Install bower dependencies (from command line in project root, type: bower install)
4. Install npm dependencies (again from command line type: npm install)
5. Open /test/index.html in a browser to see unit tests


gulp tasks
----------------------------
- templates: Compiles Handlebars templates in /src/templates to /src/js/templates.js
- less: Compiles /src/less/main.less to /src/css/main.css
- test: Wires bower dependencies, source files and unit test files to test runner template and produces /test/runner.html
- build: Saves concatenated src js to /build/upcycle.js and compiled theme css /build/themes/themename.css
- watch: runs above tasks when source files change



