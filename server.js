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
    cours_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    rating: Sequelize.INTEGER,
})

Links.belongsTo(Courses, {foreignKey: 'cours_id', targetKey: 'id'})
//courses.hasMany(links)

var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of courses
app.get('/courses', function(request, response) {
    Courses.findAll().then(function(courses){
        response.status(200).send(courses)
    })
        
})

// get one cours by id
app.get('/courses/:id', function(request, response) {
    Courses.findOne({where: {id:request.params.id}}).then(function(courses) {
        if(courses) {
            response.status(200).send(courses)
        } else {
            response.status(404).send()
        }
    })
})

//create a new cours
app.post('/courses', function(request, response) {
    Courses.create(request.body).then(function(courses) {
        response.status(201).send(courses)
    })
})

app.put('/courses/:id', function(request, response) {
    Courses.findById(request.params.id).then(function(courses) {
        if(courses) {
            courses.update(request.body).then(function(courses){
                response.status(201).send(courses)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/courses/:id', function(request, response) {
    Courses.findById(request.params.id).then(function(courses) {
        if(courses) {
            courses.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/links', function(request, response) {
    Links.findAll(
        {
            include: [{
                model: Courses,
                where: { id: Sequelize.col('links.cours_id') }
            }]
        }
        
        ).then(
            function(links) {
                response.status(200).send(links)
            }
        )
})

app.get('/links/:id', function(request, response) {
    Links.findById(request.params.id).then(
            function(links) {
                response.status(200).send(links)
            }
        )
})

app.post('/links', function(request, response) {
    Links.create(request.body).then(function(links) {
        response.status(201).send(links)
    })
})

app.put('/links/:id', function(request, response) {
    Links.findById(request.params.id).then(function(links) {
        if(links) {
            links.update(request.body).then(function(links){
                response.status(201).send(links)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/links/:id', function(request, response) {
    Links.findById(request.params.id).then(function(links) {
        if(links) {
            links.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/courses/:id/links', function(request, response) {
    Links.findAll({where:{cours_id: request.params.id}}).then(
            function(links) {
                response.status(200).send(links)
            }
        )
})

app.listen(8080)