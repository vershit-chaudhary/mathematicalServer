const http = require("http");
const fs = require('fs').promises;
const host = 'localhost';
const port = 7000;
const requestListener = function (req, res) {

    switch(req.url){
        case "/":
            fs.readFile(__dirname + "/index.html")
            .then(contents => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(contents);
            })
            .catch(err => {
                res.writeHead(500);
                res.end(err);
            });
            break;
        case "/history":
            res.writeHead(200);
            res.end(JSON.stringify(queue.items));
            break;
        default:
            var URL=req.url;
            var splitURL=URL.toString().split("/");
            let len=splitURL.length;
            const operators=["plus","minus","into","upon"];
            for(let i=1;i<len;i++){
                if(splitURL[i]===operators[0]){
                    splitURL[i]='+';
                }
                else if(splitURL[i]===operators[1]){
                    splitURL[i]='-';
                }
                else if(splitURL[i]===operators[2]){
                    splitURL[i]='*';
                }
                else if(splitURL[i]===operators[3]){
                    splitURL[i]='/';
                }
            }
            let result=eval(splitURL.join(''));
            console.log(result);
            res.writeHead(200);
            res.end(JSON.stringify({question:splitURL.join(''),answer:result}));
            queue.enqueue(splitURL.join('')+"="+result);
            if(queue.size()>20){
                queue.dequeue();
            }
    }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

class Queue {
    constructor() {
        this.items = {};
        this.headIndex = 0;
        this.tailIndex = 0;
    }

    //adds a new element
    enqueue(element) {
        this.items[this.tailIndex] = element;
        this.tailIndex++;
    }

    dequeue() {
        let removedElement = this.items[this.headIndex];
        delete this.items[this.headIndex];
        this.headIndex++;
        return removedElement;
    }
    size() {
        return this.tailIndex - this.headIndex;
    }
}
let queue = new Queue();