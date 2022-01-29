import { useEffect, useState } from 'react';


import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import { Box } from '@mui/material';
import styled from '@emotion/styled';

import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const Component = styled.div`
    background: #F5F5F5;
`

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
];
  

const Editor = () => {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id } = useParams();  //take ide from params

    useEffect(() => {
        const quillServer = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions }});
        quillServer.disable();
        quillServer.setText('Loading the document...')
        setQuill(quillServer);
    }, []);

    useEffect(() => {
        const socketServer = io('http://localhost:9000');
        setSocket(socketServer);  //create socket

        return () => {
            socketServer.disconnect();
        }
    }, [])

    useEffect(() => {
        if (socket === null || quill === null) return;  //check our socket server is null

        const handleChange = (delta, oldData, source) => {  //delta dektect the changes
            if (source !== 'user') return;  //source its is user or an api

            socket.emit('send-changes', delta); //send changes to backend
        }

        quill && quill.on('text-change', handleChange); //check changes text cnage and send that changes to socket.amit to backend

        return () => {
            quill && quill.off('text-change', handleChange);
        }
    }, [quill, socket])

    useEffect(() => {
        if (socket === null || quill === null) return;  

        const handleChange = (delta) => {
            quill.updateContents(delta);  //dalta is recived bordcast all the user where the same ide is used
        }

        socket && socket.on('receive-changes', handleChange);  //catch that changes which are send through back end

        return () => {
            socket && socket.off('receive-changes', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (quill === null || socket === null) return;

        socket && socket.once('load-document', document => { //socket && is present or not
            quill.setContents(document);  //show document and now enable the document
            quill.enable();
        })

        socket && socket.emit('get-document', id); //fatch document
    },  [quill, socket, id]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);

    return (
        <Component>
            <Box className='container' id='container'></Box>
        </Component>
    )
}

export default Editor;