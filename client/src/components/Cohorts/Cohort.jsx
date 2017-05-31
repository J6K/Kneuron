import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Main.css';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { allLectures } from '../../actions/Lectures';

class Cohort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      lectures: [],
      isShowingModal: false,
    };
    this.deleteClass = this.deleteClass.bind(this);
    this.fetchLectures = this.fetchLectures.bind(this);
    this.editClass = this.editClass.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async deleteClass() {
    try {
      const removed = await axios.delete(`/api/cohorts/${localStorage.getItem('id_token')}/${this.props.cohort.id}`);
      if (removed) {
        this.props.fetchTeacherInfo()
          .then(() => {
            this.props.history.push('/dashboard/class');
          })
          .catch((err) => {
            console.log('error with deleting class , ERR: ', err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  editClass(e) {
    e.preventDefault();
    const body = {
      auth_token: localStorage.getItem('id_token'),
      subject: this.state.subject,
      time: this.state.time,
    };
    try {
      axios.put('/api/cohorts/', body);
      console.log(updated);
      this.props.history.push('/dashboard/class');
    } catch (error) {
      console.log('error with axios call line 31 editClass');
    }
  }

  fetchLectures() {
    this.props.allLectures(this.props.cohort);
  }
  handleClick() {
    this.setState({ isShowingModal: true });
  }
  handleClose() {
    this.setState({ isShowingModal: false });
  }

  render() {
    return (
      <div className="cohort-entry animated bounceInUp" >
        <div>
          {
            this.state.isShowingModal &&
            <ModalContainer onClose={this.handleClose}>
              <ModalDialog onClose={this.handleClose}>
                <h2 className="text-center">Edit your quiz :)</h2>
              </ModalDialog>
            </ModalContainer>
          }
        </div>
        <div className="ch-entry-header">{this.props.cohort.subject}</div>
        <h3>{this.props.cohort.semester}</h3>
        <h3>{this.props.cohort.time}</h3>
        <button className="lecture-button" onClick={this.fetchLectures}><Link to="/dashboard/lectures">Lectures</Link></button>
        <button onClick={this.deleteClass} className="delete-class"><img alt="delete" src="https://cdn3.iconfinder.com/data/icons/line/36/cancel-256.png" width="25px" height="25px" /></button>
        <button
          onClick={() => {
            this.handleClick();
          }}
          className="edit-button"
        >
          <img alt="delete" src="http://simpleicon.com/wp-content/uploads/pencil.png" width="25px" height="25px" />
        </button>
      </div>
    );
  }
}

export default connect(null, { allLectures })(Cohort);
