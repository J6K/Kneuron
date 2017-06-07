import React, { Component } from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import axios from 'axios';
import _ from 'lodash';

class StudentLecturePerformance extends Component {
  constructor() {
    super();
    this.state = {
      lectureData: [],
    };
  }

  componentDidMount() {
    const { lectureData } = this.props;
    lectureData ?
    axios.get(`/api/performances/performanceForTopics/${lectureData.id}/${lectureData.student_id}`)
      .then(({ data }) => {
        const topicArray = data.topics.map((topic) => {
          const topicObject = {
            name: '',
            results: [],
          };
          topicObject.name = topic.name;
          _.each(topic.quizzes, (quiz) => {
            topicObject.results.push(quiz.results[0].percentage);
          });
          return topicObject;
        });
        _.each(topicArray, (topic) => {
          const average = topic.results.reduce((sum, result) => {
            return sum + result;
          }, 0) / topic.results.length;
          this.setState({ lectureData: [...this.state.lectureData, { name: topic.name, average }] });
        });
      })
      .catch(error => console.log('Error in CDM of StudentLecturePerformance.jsx ', error))
      : null;
  }

  render() {
    return (
      <RadarChart cx={300} cy={250} outerRadius={150} width={700} height={600} data={this.state.lectureData}>
        <Radar name="Student" dataKey="average" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
      </RadarChart>
    );
  }
}

export default StudentLecturePerformance;