var ws = require("nodejs-websocket")
var mongodb = require("mongodb");
var mongodbServer = new mongodb.Server("localhost",27017,{auto_reconnect:true});
var db = new mongodb.Db("im", mongodbServer,{safe:true});
db.open(function(err,db){
	if(!err){   
		
    	}else{
		console.log(err);
   	}   
});




var connectionMaps = new Array()

var server = ws.createServer(function (conn)  {
        conn.on("text", function (str) {
	var json =JSON.parse(str)
	Object.keys(json).forEach(function(key) {
                if(key=="login"){
			var connectionMap={"connection":conn,"username":json[key]}
			connectionMaps.push(connectionMap)
			broadcast("login:"+json[key])
			db.collection("message",{safe:true},function(err,collection){
				collection.find({targetName:json[key]}).toArray(function(err,docs) {
					if(!err){  
						console.log(docs); 
						docs.forEach(function(doc) {
							handleMessage(doc,connectionMaps,collection)
						});
		
    					}else{
						console.log(err);
   					} 

				})
			})
		}
		if(key=="username"){
			var targetName =json["targetName"]
                        var msg =json["msg"]

			var targetOnline=false
                        connectionMaps.forEach(function(object) {
                              	if(object["username"]==targetName){
					targetOnline=true
					object["connection"].sendText(msg)
			 	}
			})

			if(targetOnline==false){
				db.collection("message",{safe:true},function(err,collection){
					collection.insert(json,{safe:true},function(err,result){
           					console.log(result);
        				}); 
　　　　				});
				console.log("save to sql")
			}
		}
	})
        console.log("Received "+str)            })    conn.on("close", function (code, reason) {
	connectionMaps.forEach(function(object) {
		if(object["connection"]==conn){
			broadcast("logout:"+object["username"])
			var index = connectionMaps.indexOf(object);
            		if (index > -1) {
                		connectionMaps.splice(index, 1);
				console.log(connectionMaps)
            		}
		}
	})
        console.log("Connection closed")
    })}).listen(3000)function broadcast(str) {	server.connections.forEach(function (connection) {		connection.sendText(str)	})}


function handleMessage(message,connectionMaps, collection){
	var targetName = message["targetName"]
	var msg = message["msg"]
	var targetOnline=false
        connectionMaps.forEach(function(object) {
        	if(object["username"]==targetName){
			targetOnline=true
			object["connection"].sendText(msg)			
            		collection.remove({_id:message["_id"]},{safe:true},function(err,result){
                		console.log(result);
           		});
			　
		}
	})

	if(targetOnline==false){
		collection.insert(message,{safe:true},function(err,result){
   			console.log(result);
        	}); 
　　　　		
		console.log("save to sql")
	}

}






