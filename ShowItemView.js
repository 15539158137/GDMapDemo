import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    View,
    Modal,
    TouchableOpacity,
    Text, Keyboard

} from 'react-native';
//只能显示内容的itemview
const Dimensions = require('Dimensions'); //必须要写这一行，否则报错，无法找到这个变量
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export default class ShowItemView extends React.Component {
    static propTypes = {
        ...View.propTypes,
        marginTop: PropTypes.number,//0.07 * ScreenHeight
        buttonName: PropTypes.string.isRequired,
        clickEvent: PropTypes.func.isRequired,
        marginBottom: PropTypes.number,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.clickEvent} style={{
                marginTop: this.props.marginTop,
                marginBottom:this.props.marginBottom,
                marginLeft: 0.04 * ScreenWidth,
                borderRadius: 5,
                flexDirection: 'row',
                backgroundColor: '#4f517a',
                width: ScreenWidth * 0.92,
                height: ScreenHeight * 0.07,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{

                    fontSize: 18,
                    color: 'white',
                }}>{this.checkIsNull(this.props.buttonName) ? '暂无' : this.props.buttonName}</Text>
            </TouchableOpacity>
        );
    }

    componentDidUpdate(nextProps, nextState) {
        //console.log("componentDidUpdate" + JSON.stringify(nextProps) + '===' + JSON.stringify(nextState))
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log("shouldComponentUpdate" + JSON.stringify(nextProps) + '===' + JSON.stringify(nextState))
        if(this.props.buttonName==nextProps.buttonName){
            return false;
        }else {
            return true;
        }


    }

    checkIsNull(data) {
        return (typeof data == "undefined" || data == null || data == "")
    }
}