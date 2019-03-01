/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import ShowItemView from "./ShowItemView"
import GetStatebarHeightMoudle from './GetStatebarHeight'
type Props = {};
const Dimensions = require('Dimensions'); //必须要写这一行，否则报错，无法找到这个变量
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
let nowPageNum = 0;
let totalPageNum = 4;
let pageSize = 10;
let errorcount = 0;
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadMoreState: 0,
            marginTop: 0,
            isRefreshing: false,
            loadingError: false
        }
        //loadMoreState  0是没有加载更多 1是正在加载更多 2是已经是最后一页了
        //loadingError当加载更多失败，如果只是修改loadmorestate的话会出现一直触发onEndReached方法，加入这个判断符，如果是加载失败，那么不再触发加载；
        // 除非用户点击了确定按钮
        //这个状态才会改变，才能再次触发onEndReached
        //这里有一个关键点：必须配置Flatlist的extraData属性，这个属性表示这个属性变化也会触发列表的刷新：如上面的情况，如果列表不刷新，
        // 由于数据源data还是老数据，那么list就不会刷新，也就不会再次触发onEndReached方法，就会出现上啦无效。

    }

    shouldComponentUpdate(nextProps, nextState) {
        //   console.log("APPshouldComponentUpdate" + JSON.stringify(nextProps) + '===' + JSON.stringify(nextState))
        return true;
    }

    componentDidUpdate(nextProps, nextState) {
        //console.log("APPcomponentDidUpdate" + JSON.stringify(nextProps) + '===' + JSON.stringify(nextState))
    }


    componentDidMount() {
        //获取状态栏高度
        if (Platform.OS === 'android') {

        } else {
            GetStatebarHeightMoudle.getStatebarHeight((error, events) => {
                this.setState({
                    marginTop: parseInt(events)

                });
            });


        }
        let allData = this.state.data;
        for (let i = 0; i < 10; i++) {
            let databean = new DataBean();
            databean.page = nowPageNum;
            databean.index = i;
            allData.push(databean);
        }
        this.setState({
            data: allData,

        }, () => {

        });
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    //listview的分割线
    splite() {
        return <View style={{width: ScreenWidth, height: 0.01 * ScreenHeight, backgroundColor: '#cacaca'}}/>;
    }

    render() {
        return (
            <View style={{marginTop: this.state.marginTop, backgroundColor: 'white'}}>
                <FlatList
                    ref={component => this.FlatList = component}
                    onRefresh={() => {
                        this.setState({
                            isRefreshing: true,
                        });
                        this.timer = setTimeout(() => {
                            let allData = [];
                            nowPageNum = 0;
                            for (let i = 0; i < 10; i++) {
                                let databean = new DataBean();
                                databean.page = nowPageNum;
                                databean.index = i;
                                allData.push(databean);
                            }
                            this.setState({
                                data: allData,

                            }, () => {
                                this.setState({
                                    isRefreshing: false,
                                }, () => {
                                    this.setState({
                                        loadMoreState: 0,
                                    });
                                });

                            });
                        }, 2000)

                    }}
                    extraData={this.state.loadingError}
                    refreshing={this.state.isRefreshing}
                    ListFooterComponent={
                        () => {
                            return this.state.loadMoreState == 0 ? null : (this.state.loadMoreState == 1 ?
                                    <View style={{
                                        width: ScreenWidth, height: 0.07 * ScreenHeight, justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        <ActivityIndicator style={{}}></ActivityIndicator>
                                        <Text>拼命加载中....</Text>
                                    </View>
                                    :
                                    <View style={{
                                        width: ScreenWidth, height: 0.07 * ScreenHeight, justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text>已经是最后一页了</Text>
                                    </View>
                            )

                        }
                    }
                    onEndReached={() => {
                        if (totalPageNum <= nowPageNum) {
                            Alert.alert('已经是最后一页了');
                            return;
                        }
                        if (this.state.loadingError) {
                            return;
                        }
                        if ((this.state.loadMoreState == 0) && this.state.data.length >= pageSize) {
                            this.setState({
                                loadMoreState: 1,
                            }, () => {
                            });
                            new Promise((resolve, reject) => {
                                this.timer = setTimeout(() => {
                                    if (nowPageNum == 2 && errorcount == 0) {
                                        resolve(false);
                                    } else {
                                        //成功
                                        resolve(true);
                                    }
                                }, 2000)
                            }).then((data) => {
                                if (data) {
                                    nowPageNum++;
                                    let allData = this.state.data;
                                    for (let i = 1; i < 10; i++) {
                                        let databean = new DataBean();
                                        databean.page = nowPageNum;
                                        databean.index = i;
                                        allData.push(databean);
                                    }
                                    let state = 0;
                                    if (nowPageNum == totalPageNum) {
                                        state = 2;
                                    } else {
                                        state = 0;
                                    }
                                    this.setState({
                                        data: allData, loadMoreState: state
                                    });
                                } else {
                                   // errorcount++;

                                    let allData = [];
                                    for (let i = 1; i < this.state.data.length; i++) {
                                        let databean = new DataBean();
                                        databean.page = this.state.data[i].page;
                                        databean.index = this.state.data[i].index;
                                        allData.push(databean);
                                    }
                                    // this.setState({loadMoreState: 0, data: allData}, () => {
                                    //     Alert.alert('error', '网络错误', [{
                                    //         text: 'ok', onPress: () => {
                                    //            // this.setState({loadingError: false});
                                    //         }
                                    //     }])
                                    // });
                                    this.setState({loadMoreState: 0, loadingError: true}, () => {
                                        Alert.alert('error', '网络错误', [{
                                            text: 'ok', onPress: () => {
                                                this.setState({loadingError: false});
                                            }
                                        }])
                                    });


                                }

                            }).catch((e) => {

                            });


                        }

                    }}
                    onEndReachedThreshold={
                        0.1
                    }
                    data={this.state.data}
                    renderItem={({item}) => (
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <ShowItemView
                                marginTop={10}
                                marginBottom={10}
                                buttonName={'第' + item.page + '页' + '第' + item.index + '个元素'}
                                clickEvent={() => {
                                }}
                            />
                        </View>

                    )

                    }
                    ListEmptyComponent={() => {
                        return <View style={{
                            width: ScreenWidth,
                            height: ScreenHeight * 0.87,
                            justifyContent: 'center',
                            alignItems: "center"
                        }}>
                            <Text style={{color: 'red'}}>暂无数据</Text>
                        </View>
                    }}

                    ItemSeparatorComponent={this.splite}
                />
            </View>
        );
    }
}
class DataBean {
    page;
    index;

}