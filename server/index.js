import { Server } from 'socket.io';

import Connection from './database/db.js';

import { getDocument, updateDocument } from './controller/document-controller.js'

const PORT = 9000;

Connection();

const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId); //if we dont have document
        socket.join(documentId);
        socket.emit('load-document', document.data); //save that data to load document

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })

        socket.on('save-document', async data => { //saved document o\is function and we can trigger its event to front end
            await updateDocument(documentId, data);
        })
    })
});