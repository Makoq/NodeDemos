const events=require('events')
const net=require('net')
//node事件触发器
const channel=new events.EventEmitter();

channel.clients={}
channel.subscriptions={};

channel.on('join',function(id,client){
    channel.clients[id]=client
    channel.subscriptions[id]=(senderId,message)=>{
        if(id!=senderId){
           

            channel.clients[id].write(message)
        }
    }
    channel.on('broadcast',channel.subscriptions[id]);//监听数据
})
//telnet ip port
const server=net.createServer(client=>{
    const id=`${client.remoteAddress}:${client.remotePort}`;
    channel.emit('join',id,client);
    client.on('data',data=>{
        data=data.toString();
        channel.emit('broadcast',id,data);//广播数据
    })
})
server.listen(8888)