var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")
var mysql = require("mysql");


var connection =mysql.createConnection({
    host     : 'localhost',
    user     : 'oanab',
});

//connect to mysql database
var sequelize = new Sequelize('learning_resources', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var Courses = sequelize.define('courses', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
})

var Links = sequelize.define('links', {
    name: Sequelize.STRING,
    courseId: Sequelize.INTEGER,
    description: Sequelize.STRING,
    rating: Sequelize.INTEGER,
})

Courses.hasMany(Links);
Links.belongsTo(Courses, {foreignKey: 'courseId'});

var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of courses
app.get('/courses', function(request, response) {
    Courses.findAll().then(function(courses){
        response.status(200).send(courses)
    })
        
})

// get one course by id
app.get('/courses/:id', function(request, response) {
    Courses.findOne({where: {id:request.params.id}}).then(function(course) {
        if(course) {
            response.status(200).send(course)
        } else {
            response.status(404).send()
        }
    })
})

//create a new course
app.post('/courses', function(request, response) {
    Courses.create(request.body).then(function(cours) {
        response.status(201).send(cours)
    })
})

//update the course
app.put('/courses/:id', function(request, response) {
    Courses.findById(request.params.id).then(function(course) {
        if(course) {
            course.update(request.body).then(function(course){
                response.status(201).send(course)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//delete course
app.delete('/courses/:id', function(request, response) {
    Courses.findById(request.params.id).then(function(cours) {
        if(cours) {
            cours.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//get links
app.get('/links', function(request, response) {
    Links.findAll().then(
            function(links) {
                response.status(200).send(links)
            }
        )
})

//get link
app.get('/links/:id', function(request, response) {
    Links.findById(request.params.id).then(
            function(links) {
                response.status(200).send(links)
            }
        )
})

//create a link
app.post('/links', function(request, response) {
    Links.create(request.body).then(function(link) {
        response.status(201).send(link)
    })
})

//update link
app.put('/links/:id', function(request, response) {
    Links.findById(request.params.id).then(function(link) {
        if(link) {
            link.update(request.body).then(function(link){
                response.status(201).send(link)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//delete link
app.delete('/links/:id', function(request, response) {
    Links.findById(request.params.id).then(function(link) {
        if(link) {
            link.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/courses/:id/links', function(request, response) {
    Links.findAll({where:{courseId: request.params.id}}).then(
            function(links) {
                response.status(200).send(links)
            }
        )
})

app.listen(8080)
