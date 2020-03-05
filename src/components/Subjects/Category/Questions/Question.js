import React, { useState, useEffect, useContext, useRef } from "react";
import QuestionForm from "./QuestionForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../../contexts/ApiContext";
import CategoryContext from "../../../../contexts/CategoryContext";


export default function Question(props) {
    let { question, nextQuestion } = props,
      { subjectName, categoryName } = useParams(),
      questionDiv = useRef(),
      [imageSrc, setImageSrc] = useState(),
      [displayForm, setDisplayForm] = useState(false),
      { categoryQuestions, getCategoryQuestions } = useContext(CategoryContext),
      { API, Storage, user } = useContext(ApiContext);


    useEffect(() => {
      setDisplayForm(false);
    }, [categoryQuestions]);

      // for Question Image
      useEffect(() => {
        console.log(imageSrc);
        if (question.image) getImage();
      }, []);



  return (
    <div className="questions-component">
      <h2>Question</h2>
    </div>
  );

    function getImage() {
      // Storage.get(note.image.replace("public/", ""))
      //   .then(res => {
      //     console.log("image res");
      //     console.log(res);
      //     setImageSrc(res);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }

      function deleteQuestion(q) {
        console.log("deleteQuestion");
        API.del(
          "StuddieBuddie",
          `/subjects/${subjectName}/${categoryName}/questions/${q.pathName}`,
          {
            body: JSON.stringify({
              username: user.user.username,
              pathName: q.pathName
            })
          }
        )
          .then(response => {
            console.log("delete note response");
            console.log(response);
            getCategoryQuestions();
          })
          .catch(error => {
            console.log(error.response);
          });
      }

} // end of component

//
//   return (
//     <div className="note" ref={noteDiv}>
//       <span className="delete-note" onClick={() => deleteQuestion(note)}>
//         X
//       </span>
//       {displayForm && <QuestionForm {...{ note }} />}
//       {!displayForm && (
//         <div className="note-detail">
//           {note.audioQuestion && (
//             <button onClick={() => playAudio()}>
//               <FontAwesomeIcon icon={faPlay} />
//             </button>
//           )}
//           {note.image && <img src={imageSrc} />}
//           {note.mainQuestion && <p>{note.mainQuestion}</p>}
//           {note.subnotes && note.subnotes.map((n, i) => <p key={n + i}>{n}</p>)}
//           <span
//             className="edit-note"
//             onClick={() => setDisplayForm(!displayForm)}
//           >
//             Edit Question
//           </span>
//         </div>
//       )}
//     </div>
//   );
//

//
