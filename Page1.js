import React, {Component} from "react";
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from "react-native";

const REQUEST_URL = 'https://api.github.com/search/repositories?q=javascript&sort=stars&page=';
let pageNo = 1;//当前第几页
let totalPage=5;//总的页数
let itemNo=0;//item的个数
import ShowItemView from './ShowItemView'
const Dimensions = require('Dimensions'); //必须要写这一行，否则报错，无法找到这个变量
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export default class LoadMoreDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
            loadingError:false
        }
    }

    //网络请求——获取第pageNo页数据
    fetchData(pageNo) {
        console.log("进入到网络请求一次")
        //这个是js的访问网络的方法
        fetch(REQUEST_URL+pageNo)
            .then((response) => response.json())
            .then((responseData) => {
                let data = responseData.items;
                let dataBlob = [];
                let i = itemNo;

                data.map(function (item) {
                    dataBlob.push({
                        key: i,
                        value: item,
                    })
                    i++;
                });
                itemNo = i;
                console.log("itemNo:"+itemNo);
                let foot = 0;
                if(pageNo>=totalPage){
                    foot = 1;//listView底部显示没有更多数据了
                }
                let allData11 = [];
                for (let  q= 0; q < 10; q++) {
                    let databean1 = new DataBean();
                    if(pageNo==3){
                        //模拟网络加载错误
                        databean1.page = pageNo111;
                    }
                    databean1.page = pageNo;
                    databean1.index = q;
                    allData11.push(databean1);
                }
                this.setState({
                    //复制数据源
                    dataArray:this.state.dataArray.concat(allData11),
                    isLoading: false,
                    showFoot:foot,
                    isRefreshing:false,
                });
                data = null;
                dataBlob = null;
            })
            .catch((error) => {
                console.log(JSON.stringify(error)+"错误");
                let allData11 = [];
                for (let  q= 0; q < this.state.dataArray.length; q++) {
                    let databean1 = new DataBean();
                    databean1.page = pageNo;
                    databean1.index = q;
                    allData11.push(this.state.dataArray[q]);
                }
                this.setState({
                    //复制数据源
                    dataArray:allData11,
                    isLoading: false,
                    showFoot:0,
                    isRefreshing:false,
                },()=>{
                    pageNo--;
                });

                // this.setState({
                //     error: true,
                //     errorInfo: error
                // })
            })
            .done();
    }

    componentDidMount() {
        //请求数据
        this.fetchData( pageNo );
    }

    //加载等待页
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color='red'
                    size="large"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text>
                    Fail
                </Text>
            </View>
        );
    }

    //返回itemView
    renderItemView({item}) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <ShowItemView
                    marginTop={10}
                    marginBottom={10}
                    buttonName={'第' + item.page + '页' + '第' + item.index + '个元素'}
                    clickEvent={() => {
                    }}
                />
            </View>
        );
    }

    renderData() {
        return (

            <FlatList
                style={{marginTop:48}}
                data={this.state.dataArray}
                renderItem={this.renderItemView}
                ListFooterComponent={this._renderFooter.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={1}
                ItemSeparatorComponent={this.splite}
            />

        );
    }  //listview的分割线
    splite() {
        return <View style={{width: ScreenWidth, height: 0.01 * ScreenHeight, backgroundColor: '#cacaca'}}/>;
    }
    //返回itemView
    _renderItemView({item}) {
        return (
            <View>
                <Text style={styles.title}>name: {item.value.name}</Text>
                <Text style={styles.content}>stars: {item.value.stargazers_count}</Text>
                <Text style={styles.content}>description: {item.value.description}</Text>
            </View>
        );
    }
    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }
        //加载数据
        return this.renderData();
    }
    _separator(){
        return <View style={{height:1,backgroundColor:'#999999'}}/>;
    }
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
            return ;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if((pageNo!=1) && (pageNo>=totalPage)){
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据
        this.fetchData( pageNo );
    }
    // componentDidUpdate(nextProps, nextState) {
    //     console.log("APPcomponentDidUpdate" + JSON.stringify(nextProps) + '===' + JSON.stringify(nextState))
    // }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if(this.state.loadingError){
    //         return true;
    //     }else {
    //         return true;
    //     }
    // }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    content: {
        fontSize: 15,
        color: 'black',
    }
});

class DataBean {
    page;
    index;

}