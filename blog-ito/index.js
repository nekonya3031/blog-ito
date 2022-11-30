const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs')

let data = [];

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.redirect("/posts");
});

app.get('/posts', (req,res)=>{
    // res.sendFile('posts.html', {root: __dirname })
    let posts = '';
    data.forEach(e=>{posts+=getPost(e)})
    res.send(starter+posts+ender);
})

app.get('/editor', (req,res)=>{
    res.sendFile('editor.html', {root: __dirname })
})

app.post('/editor',(req, res)=>
{
    console.log(req.body);
    data.push({name: req.body.name,topic: req.body.topic,text: req.body.text})
    writeFile();
    res.redirect("/posts");
});

app.listen(3333, () => {
    console.log('Application listening on port 3333!');
});

function readFile(){
    fs.readFile('datas.json', 'utf8', function readFileCallback(err, dat){
        if (err){
            console.log(err);
        } else {
            data = JSON.parse(dat); //now it an object
        }});
}

function writeFile(){
    let json = JSON.stringify(data); //convert it back to json
    fs.writeFile('datas.json', json, 'utf8', ()=>{console.log("saved")});
}

let starter = '<!DOCTYPE html>' +
    '<html lang="ru">' +
    '<head>' +
    '    <meta charset="UTF-8">' +
    '    <title>Посты</title>' +
    '</head>' +
    '<body>' +
    '<div style="display:inline-flex">' +
    '    <h1>Посты</h1>' +
    '    <button onclick="editor()">Написать пост</button>' +
    '</div>';
let ender = '</body>' +
    '' +
    '<style>' +
    '    .post {' +
    '        border: 5px solid black;' +
    '        font-size: large;' +
    '    }' +
    '' +
    '    .author {' +
    '        border: 2px solid black;' +
    '        font-size: x-large;' +
    '    }' +
    '' +
    '    .header {' +
    '        border: 3px solid black;' +
    '        font-size: xx-large;' +
    '    }' +
    '</style>' +
    '' +
    '<script>' +
    '    function editor() {' +
    '        window.location.href = "/editor";' +
    '    }' +
    '</script>' +
    '</html>';

function getPost(data){
    let s = '<div class="post">' +
        '    <div style="display:flow">' +
        '        <div class="author">' +
        data.name +
        '        </div>' +
        '        <div class="header">' +
        data.topic +
        '        </div>' +
        '    </div>' +
        '    <div class="content">' +
        data.text +
        '    </div>' +
        '</div>'
    return s;
}

readFile();
console.log(data)
