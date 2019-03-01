import App from'./App'
import React, {Component} from 'react';
import {
    createStackNavigator,
    createAppContainer
} from 'react-navigation';
const Dimensions = require('Dimensions'); //必须要写这一行，否则报错，无法找到这个变量
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const Router=createStackNavigator({
    App:{screen:App,navigationOptions:({navigation})=>({title:'',header:null})},
},RouterConfig);
const RouterConfig={
    initialRouteName:'App',
    paths:'../',
    headerMode: 'float',
    cardStyle: {
        backgroundColor: 'white'
        ,
    },
    navigationOptions: {
        title: '',
        headerTitleStyle: {fontSize: 18, color: '#666666'},
        headerStyle: {height: 48, backgroundColor: '#fff'},
    },
};
//使用：this.props.navigation.navigate('Profile');
export default createAppContainer (Router);