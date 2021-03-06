import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground, 
  Button, 
  ActivityIndicator 
} from 'react-native';

import { clearLocalNotification } from '../utils/notifications';
import { white, darkGray, overlay, blue } from '../utils/colors';
import { getEvents, logoutUser } from '../actions/index';

class Events extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
      <Button handleSubmit={params.handleSubmit} 
              title="Logout" 
              onPress = {() => params.handleSubmit && params.handleSubmit()}
              />
            ) 
          };
        };

  submitStatus = () => {
    this.props.dispatch(logoutUser(this.props.app.user));
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSubmit: this.submitStatus });
    this.props.dispatch(getEvents(this.props.app.user.Authorization ));
    clearLocalNotification()
  }

  getDate = (date) => {
    return moment(date).format('MMM Do YYYY, h:mm A');
  }

  // PLEASE NOTE: I would not use scrollview for large lists, but the ListView component
  render() {
    const { events } = this.props.app;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {events ? events.map((event) => {
          return (
            <ImageBackground key={event.eventName} style={styles.backgroundImage} source={{ uri: event.eventImageUrl }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('EventDetails', { entryId: event.eventName })}>
                <View style={styles.card}>
                  <Text style={styles.contentTitle}>{event.eventName}</Text>
                  <Text style={styles.contentSecondary}>{event.venueName}</Text>
                  <Text style={styles.contentGeneral}>{this.getDate(event.eventDateTime)}</Text>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          );
        })
          :
          <View style={styles.loader}>
             <ActivityIndicator size="small" color={blue}/>
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 5
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: overlay,
    height: 200,
  },
  contentTitle: { 
    fontSize: 22, 
    color: darkGray, 
    color: white,
    margin: 8
  },
  contentSecondary: { 
    fontSize: 16, 
    color: darkGray, 
    fontWeight: '100',
    color: white 
  },
  contentGeneral: { 
    fontSize: 14, 
    color: darkGray, 
    fontWeight: '100',
    color: white 
  },
  backgroundImage: { 
    flex: 1, 
    margin: 4 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});

mapStateToProps = (app) => {
  return {
    app
  }
}

export default connect(mapStateToProps)(Events);