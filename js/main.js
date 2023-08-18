const chatform= document.getElementById('chat-form');
const chatMassage =document.querySelector('.chat-messages');
const urltags=new URLSearchParams(window.location.search);
const username=urltags.get('username');
const room=urltags.get('room');
const roomname= document.getElementById('room-name');
const userlist= document.getElementById('users');


const socket =io();

socket.emit('joinRoom',{username,room })

socket.on('roomUsers',({room,users})=>{
    outputroomname(room);
    outputusers(users);
})

socket.on('message',message=>{
    outputjoin(message);
    chatMassage.scrollTop=chatMassage.scrollHeight;
});
socket.on('usermsg',usermsg=>{
    outputmsg(usermsg);
    chatMassage.scrollTop=chatMassage.scrollHeight;
})


chatform.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;

    socket.emit('chatmessage',msg);

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});


function outputjoin(message){
    const div =document.createElement('div')
    div.classList.add('message');
    div.innerHTML=`<center><p class="meta"><span>${message.time}</span>
                     ${message.text}</p></center>`;

    document.querySelector('.chat-messages').appendChild(div);
    }
function outputmsg(massage){
    const div =document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta"><span>${massage.time}</span>
     ${massage.username}</p>
    <p class="text">
        ${massage.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputroomname(room){
    roomname.innerText=room;
}
function outputusers(users){
    userlist.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}