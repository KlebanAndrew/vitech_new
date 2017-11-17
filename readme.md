# Test app
UI for send messages system (For more info please read **info.md**)

## Table of contents
* [Get the source code](#get-the-source-code)
* [Installing / Getting started](#installing-getting-started)
* [Configuration](#configuration)
* [Developing](#developing)
    * [Built with](#built-with)
    * [Prerequisites](#prerequisites)
    * [Building](#building)
* [Deployment](#deployment)
* [Database (optional)](#database-optional)


## Get the Source Code
Clone the repository using the following command:
```
git https://github.com/KlebanAndrew/vitech_new.git your-project-folder
```

## Installing / Getting Started
```
cd ./your-project-folder
npm install
cd ./your-project-folder/public
bower install
cd ./your-project-folder
grunt
grunt fonts
```
For virtual server
```
npm run server
```

## Configuration
* Json routes in **routes.json**
* Json db in **db.json**
* **Grunt-file-dashboard.json** - list of js and css source files to build

## Developing
Build project.
Run ```npm server```

### Built With
- [angularjs 1.5.6](https://angular.io/)

### Prerequisites
- Node.js 8.9
- NPM >= 5.4
- grunt >= 1.0.4

### Building
Build the application (compile the scripts, styles, assets):
```
grunt
grunt fonts
```
## Database (optional)
In root folder you find database db.json for fake data