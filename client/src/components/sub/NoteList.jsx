import React from 'react';
import Note from './Note.jsx';
import {addNote, replaceNotes} from '../../actions/noteActions.js';
import NoteReducer from '../../reducers/noteReducers';
import RoomReducer from '../../reducers/roomReducers';
import UserReducer from '../../reducers/userReducers';
import {connect} from 'react-redux';
import {getCurrentView} from '../../helpers.js';

class NoteList extends React.Component {

  /*----------  NPM RUN CLIENT  ----------*/
  // constructor(props) {
  //   super(props);
  //   var pathname = props.getState().routing.locationBeforeTransitions.pathname;
  //   var currentView = getCurrentView(pathname);
  //   var date = new Date(); // ** TO-DELETE
  //   this.state = {
  //     notes: [
  //       { id: 1, content: 'The great wall of china was built in 100AD', audioTimestamp: new Date() },
  //       { id: 2, content: 'Jesus Christ was born in 0BC', audioTimestamp: date.setMinutes(1) },
  //       { id: 3, content: 'Kunal was Cool just now', audioTimestamp: date.setMinutes(2) },
  //       { id: 4, content: '3 + 3 = 6', audioTimestamp: date.setMinutes(3) },
  //       { id: 5, content: 'Meow I am so bored in class', audioTimestamp: date.setMinutes(4) },
  //       { id: 6, content: 'Pokemon was discovered in 1999', audioTimestamp: date.setMinutes(5) },
  //       { id: 7, content: 'George Bush was president in 2002', audioTimestamp: date.setMinutes(6) },
  //       { id: 8, content: 'These are some very interesting lecture notes', audioTimestamp: date.setMinutes(7) },
  //       { id: 9, content: 'When will Donald Trump be president?', audioTimestamp: date.setMinutes(10) }
  //     ],
  //     view: currentView
  //   }
  // }
  /*----------  // NPM RUN CLIENT  ----------*/

  /*----------  NPM RUN DEV  ----------*/
  constructor(props) {
    super(props);
    var pathname = props.routing.locationBeforeTransitions.pathname;
    var currentView = getCurrentView(pathname);
    this.state = {
      view: currentView,
      note: this.props.note
    };
  }

  componentWillMount() {
    const userId = this.props.user.information[0].id;

    const roomId = this.props.room.roomInfo.id;
    if (this.props.room.socket) {
      this.props.room.socket.on('add note success', (note) => {
        console.log('add a new note', note);
        this.props.dispatch(addNote(note));
      });
    }

    if (this.state.view === 'compile') {
      this.getAllNotes(userId, roomId);
    }

    if (this.state.view === 'review') {
      this.getReviewNotes(userId, roomId);
    }
  }

  /*----------  // NPM RUN DEV  ----------*/

  getAllNotes(userId, roomId) {
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}`,
      contentType: 'application/json',
      success: (res, status) => {
        // replace current Notes with response
        this.props.dispatch(replaceNotes(res));
        // reassign with notes from server
      },
      error: ( res, status ) => {
        console.log(res);
      }
    });
  }

  getReviewNotes(userId, roomId) {
    // var context = this;
    $.ajax({
      method: 'GET',
      url: `/api/notes/${userId}/${roomId}?filter=show`,
      success: (res, status) => {
        // replace current Notes with response
        this.props.dispatch(replaceNotes(res));
        // reassign with notes from server
      },
      error: (res, status) => {
        console.log(res);
      }
    });
  }

  render() {
    console.log('these are the notes', this.props.note);
    return (
      <div className="note-list">
        {this.props.note.map((note, i)=>(<Note key={i} note={note} view={this.state.view}/>)
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    ...state,
    NoteReducer,
    RoomReducer,
    UserReducer
  }
}


export default connect(mapStateToProps)(NoteList);
