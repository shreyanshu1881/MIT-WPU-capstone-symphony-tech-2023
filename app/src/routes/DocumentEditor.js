import { useCallback, useEffect, useState , useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { Navigate, useParams,useLocation } from "react-router-dom"
import { createElement } from 'react'
import { useNavigate } from 'react-router-dom'
import "./styles.css"
import NavBar from '.././components/NavBar';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]


//speech to text
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'
//stt end


export default function TextEditor() {
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [docs, setDocs] = useState([]);
  const history = useNavigate();
  const [title, setTitle] = useState('');
  

  const sendParams = async () => {

    const param1 = documentId;


  try {
    const response = await axios.get(`/api/getTitle?param1=${param1}`);
    // console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  };
  sendParams();
    useEffect(() => {
      fetchDocuments();

    }, [documentId]);

    useEffect(() => {
      setTitleForDocument();
    }, [docs])

    const fetchDocuments = async() => {
      const response = await axios.get(`/api/docs`);
      setDocs(response && response.data);
    };

    const setTitleForDocument = async() => {
      let currentDocument = docs && docs.filter(doc =>
        doc._id === documentId
      );
      await setTitle(currentDocument[0] && currentDocument[0].title || 'Untitled Document')
    }

//command recognition:
// const recognizeCommands = async () =>{
//   console.log('Listening for commands')
//   model.listen(result=>{
//     // console.log(labels[argMax(Object.values(result.scores))])
//     setAction(labels[argMax(Object.values(result.scores))])

//   }, {includeSpectrogram:true, probabilityThreshold:0.9})
//   // setTimeout(()=>model.stopListening(), 10e3)
// }
const [isSupported, setIsSupported] = useState(false);
const [command, setCommand] = useState('');

useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
        setIsSupported(false);
    } else {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;

        recognition.onstart = () => {
            console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1][0].transcript;
            console.log('Speech recognition result:', result);

            if (result.toLowerCase() === 'open file') {
                openFile();
            } else if (result.toLowerCase() === 'save file') {
                saveFile();
            } else if (result.toLowerCase() === 'close file') {
                closeFile();
            }
            else if (result.toLowerCase() === 'make bold') {
              setSelectionBold();
          }
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
        };

        setIsSupported(true);
    }
}, []);

const openFile = () => {
        console.log('Opening file');
        history('/Home');
        // Add your code to open the file here
        // <input type="file" onChange={handleFileChange} />
    };

    const saveFile = () => {
        console.log('Saving file');
        history('/Home');
        // Add your code to save the file here
    };

    const closeFile = () => {
        console.log('Closing file');
        history('/Home');
        // Add your code to close the file here
    };
    const setSelectionBold = () => {
      // const quill = quillRef.current.quill;
      console.log('selection made bold');
      const range = quill.getSelection();
      if (range) {
        quill.format('bold', true);
      }

    };
const handleClick = () => {
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;

  recognition.onstart = () => {
      console.log('Speech recognition started');
  };

  recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      console.log('Speech recognition result:', result);

      if (result.toLowerCase() === 'open file') {
          openFile();
      } else if (result.toLowerCase() === 'save file') {
          saveFile();
      } else if (result.toLowerCase() === 'close file') {
          closeFile();
      }
      else if (result.toLowerCase() === 'make bold') {
        setSelectionBold();
    }
  };

  recognition.onend = () => {
      console.log('Speech recognition ended');
  };

  recognition.start();
};
//command recognition end

//stt start
const [isListening, setIsListening] = useState(false)
const [note, setNote] = useState(null)
const [savedNotes, setSavedNotes] = useState([])

useEffect(() => {
  handleListen()
}, [isListening])

const handleListen = () => {
  if (isListening) {
    mic.start()
    mic.onend = () => {
      console.log('continue..')
      mic.start()
    }
  } else {
    mic.stop()
    mic.onend = () => {
      console.log('Stopped Mic on Click')
    }
  }
  mic.onstart = () => {
    console.log('Mics on')
    const element_div = document.getElementsByClassName('ql-editor')[0];
    const newElement = document.createElement('br');
    element_div.appendChild(newElement);
  }

  mic.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    console.log(transcript)

    setNote(transcript)

    mic.onerror = event => {
      console.log(event.error)
    }
    const element_arr = document.getElementsByClassName('ql-editor')[0].getElementsByTagName('p');
    // console.log(element_arr.length)
    // const element_div = document.getElementsByClassName('ql-editor')[0];

    // let mainContainer = createElement("br", {}, " ");
    // element.appendChild(mainContainer);
    const element = element_arr[element_arr.length-1];
    // const linebreak = document.createElement("br");
    // element.appendChild(linebreak);



    element.innerText = transcript;

    console.log(note)
  }
}

// const handleSaveNote = () => {
//   setSavedNotes([...savedNotes, note])
//   setNote('')
// }
//stt end


  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
      // console.log(document);
    })

    socket.emit("get-document", documentId)
    // console.log(documentId);
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return


    const handler = (delta) => {

      quill.updateContents(delta)

    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])


  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }

  }, [socket, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })

    q.disable()
    q.setText("Loading...")
    setQuill(q)

  }, [])


  // var qu = new Quill('.editor-container', {
  //   theme: 'bubble'
  // });
  // qu.on('text-change', update);
  // var container = document.querySelector('.ql-editor');
  // update();

  // function update(delta) {
  //   var contents = qu.getContents();
  //   console.log('contents', contents);
  //   var html = "contents = " + JSON.stringify(contents, null, 2);
  //   if (delta) {
  //     console.log('change', delta)
  //     html = "change = " + JSON.stringify(delta, null, 2) + "\n\n" + html;
  //   }
  //   container.innerHTML = html;
  //   hljs.highlightBlock(container);
  // }
  // const selection = document.getElementsByClassName("ql-editor").getElementsByTagName('p')[0].innerHTML;
  // selection = 'abcd';




  //title input form
  // const [title, setTitle] = useState('');
  const [editing, setEditing] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // console.log(e.target.value);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {

      await axios.put(`http://localhost:4000/api/updateTitle/${documentId}`, { title });
      setEditing(false);
    } catch (error) {
      // Handle error
    }
  };
  //title input form end


  return (


    <>
    <div>
      <NavBar/>
    </div>

    <Container>
      {editing ? (
        <input type="text" value={title} onChange={handleTitleChange} />
      ) : (
        <h1>{title}</h1>
      )}
      {editing ? (
        <button onClick={handleSaveClick}>Save</button>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
    </Container>
    <div className="stt">
      <div className="box">



        {/*<button onClick={() => setIsListening(prevState => !prevState)}>
        Start/Stop
        </button>
        <button onClick = { handleClick }
        disabled = {!isSupported } >
        Speak a command </button>*/}

              <Container>
                <Button onClick={() => setIsListening(prevState => !prevState)} className="doc-editor-button">{isListening ? <span>🎙️</span> : <span>🛑🎙️</span>} Start/Stop</Button>
                <Button onClick = { handleClick } disabled = {!isSupported } className="doc-editor-button">Speak a command</Button>
              </Container>
      </div>

    </div>

  <div className="container" ref={wrapperRef}></div>
  </>
  )

}

// import '../style/DocumentEditor.css';
// import NavBar from '.././components/NavBar';
// import Footer from '.././components/Footer';
// import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';
// import { useCallback, useEffect, useState , useRef } from "react"
// import Quill from "quill"
// import "quill/dist/quill.snow.css"
// import { io } from "socket.io-client"
// import { useParams } from "react-router-dom"
// import { createElement } from 'react'
// import { useHistory } from 'react-router-dom'



// function DocumentEditor() {
//   return (
//     <div className="documentEditorWrapper">
//       <NavBar />
//       <Container>
//         <Button className="doc-editor-button">Voice Input</Button>
//         <Button className="doc-editor-button">Voice Commands</Button>
//       </Container>
//       <DocumentEditorContainerComponent height="700" enableToolbar={true}>
//         <Inject services={[Toolbar]}></Inject>
//       </DocumentEditorContainerComponent>
//       <Footer />
//     </div>
//   );
// }

// export default DocumentEditor;
