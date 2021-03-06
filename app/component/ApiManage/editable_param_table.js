/**
 * Created by therfaint- on 14/08/2017.
 */
import React from 'react';
import Message from 'antd/lib/message';
import Icon from 'antd/lib/icon';
import Table from 'antd/lib/table';
import Cascader from 'antd/lib/cascader';
import Button from 'antd/lib/button';
import AutoComplete from 'antd/lib/auto-complete';
import Notification from 'antd/lib/notification';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import EditableCell from './editable_cell';

const Opt = AutoComplete.Option;

Message.config({
    duration: 2,
});

Notification.config({
    duration: 9,
});

const inputOptions = [{
    value: 'string',
    label: 'String'
}, {
    value: 'number',
    label: 'Number'
}, {
    value: 'boolean',
    label: 'Boolean'
}, {
    value: 'object',
    label: 'Object'
}, {
    value: 'array',
    label: 'Array'
}];

const strMockOpts = [
    <Opt key="@string()">@string(len)</Opt>,
    <Opt key="@date('yyyy-MM-dd')">@date('yyyy-MM-dd')</Opt>,
    <Opt key="@datetime('yyyy-MM-dd HH:mm:ss')">@datetime("yyyy-MM-dd HH:mm:ss")</Opt>,
    <Opt key="@now('yyyy-MM-dd HH:mm:ss')">@now('yyyy-MM-dd HH:mm:ss')</Opt>,
    <Opt key="@image( size?, background?, foreground?, format?, text? )">@image( size, background, foreground, format,
        text )</Opt>,
    <Opt key="@color()">@color()</Opt>,
    <Opt key="@rgba()">@rgba()</Opt>,
    <Opt key="@paragraph(len)">@paragraph(len)</Opt>,
    <Opt key="@sentence(len)">@sentence(len)</Opt>,
    <Opt key="@cparagraph(len)">@cparagraph(len)</Opt>,
    <Opt key="@csentence(len)">@csentence(len)</Opt>,
    <Opt key="@name()">@name()</Opt>,
    <Opt key="@cname()">@cname()</Opt>,
    <Opt key="@url()">@url()</Opt>,
    <Opt key="@protocol()">@protocol()</Opt>,
    <Opt key="@email()">@email()</Opt>,
    <Opt key="@ip()">@ip()</Opt>,
    <Opt key="@region()">@region()</Opt>,
    <Opt key="@province()">@province()</Opt>,
    <Opt key="@city()">@city()</Opt>,
    <Opt key="@county()">@county()</Opt>,
    <Opt key="@guid()">@guid()</Opt>
];

const boolMockOpts = [
    <Opt key="@boolean()">@boolean</Opt>,
    <Opt key="true">true</Opt>,
    <Opt key="false">false</Opt>
];
const numMockOpts = [
    <Opt key="@integer()">@integer</Opt>,
    <Opt key="@float()">@float</Opt>,
    <Opt key="@integer( min, max )">@integer( min, max )</Opt>,
    <Opt key="@float( min, max )">@float( min, max )</Opt>,
];

const retOptions = [{
    value: 'string',
    label: 'String'
}, {
    value: 'number',
    label: 'Number'
}, {
    value: 'boolean',
    label: 'Boolean'
}, {
    value: 'object',
    label: 'Object'
}, {
    value: 'array',
    label: 'Array'
}];

class ParamDefine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
                key: '0',
                paramName: '',
                paramType: ['string'],
                // usrDefine: this.props.type === 'json' ? '@string()' : '',
                usrDefine: '',
                illustration: '',
                path: '0'
            }],
            count: 998,
            option: [],
            usrDefine: ''
        };
        this.status = false;
    }

    dataSourceClean = (dataSource) => {
        dataSource.map(item => {
            if (item.hasOwnProperty('children')) {
                if (item['children'].length === 0) {
                    delete item['children'];
                    item['paramType'] = ['string'];
                } else {
                    this.dataSourceClean(item['children']);
                }
            }
        });
        return dataSource;
    };

    onCellChange = (record, key) => {
        return (value) => {
            // 自定义数组长度
            let indexes, dataSource = [...this.state.dataSource];
            let curIndex, data = dataSource;
            indexes = record.path.split("/");
            // 根据路径进行第i层层次遍历
            for (let i = 0; i < indexes.length; i++) {
                data.map((item, index) => {
                    if (item['key'] === indexes[i]) {
                        curIndex = index;
                    }
                });
                // 最后一层遍历
                if (i + 1 === indexes.length) {
                    data[curIndex][key] = value;
                    this.setState({
                        dataSource
                    })
                } else {
                    // 获取下一层结构
                    data = data[curIndex]['children'];
                }
            }
            if(key !== 'illustration'){
                this.props.onOk(this.state.dataSource);
            }
        };
    };

    onDelete = (record) => {
        let indexes, dataSource = [...this.state.dataSource];
        let curIndex, data = dataSource;
        indexes = record.path.split("/");
        //单层遍历删除
        if (indexes.length === 1) {
            if (dataSource.length === 1)
                return;
            dataSource.map((item, index) => {
                if (item['key'] === indexes[0]) {
                    dataSource.splice(index, 1);
                    // this.setToPrePos(dataSource.slice(index, dataSource.length),index);
                }
            });
            this.props.onOk(dataSource);
            this.setState({dataSource})
        } else {
            // 根据路径进行第i层层次遍历
            for (let i = 0; i < indexes.length; i++) {
                data.map((item, index) => {
                    if (item['key'] === indexes[i]) {
                        curIndex = index;
                    }
                });
                if (i + 2 === indexes.length) {
                    data = data[curIndex]['children'];
                    data.map((item, index) => {
                        if (item['key'] === indexes[i + 1]) {
                            data.splice(index, 1);
                            // this.setToPrePos(data.slice(index, data.length),index);
                        }
                    });
                    this.props.onOk(this.dataSourceClean(dataSource));
                    this.setState({dataSource: this.dataSourceClean(dataSource)});
                    return;
                } else {
                    data = data[curIndex]['children'];
                }
            }
        }
    };

    handleChange = (value, record) => {
        let indexes, children,
            dataSource = [...this.state.dataSource];
        let curIndex, data = dataSource;
        indexes = record.path.split("/");
        for (let i = 0; i < indexes.length; i++) {
            data.map((item, index) => {
                if (item['key'] === indexes[i]) {
                    curIndex = index;
                }
            });
            if (i + 1 === indexes.length) {
                data[curIndex]['paramType'] = value;
                if (value[0] === 'object' || value[0] === 'array') {
                    let paramName;
                    if (value[0] === 'array') {
                        paramName = 'THIS_iS_ARRAY_TYPE';
                        data[curIndex]['usrDefine'] = this.props.type === 'json' ? 3 : ''; // 设置数组下标默认值
                    } else {
                        paramName = '';
                        data[curIndex]['usrDefine'] = ''; // 设置对象默认值为空
                    }
                    if (!data[curIndex].hasOwnProperty('children') || !data[curIndex].hasOwnProperty('children').length) {
                        data[curIndex]['children'] = [];
                        data[curIndex]['children'].push({
                            key: String(this.state.count),
                            paramName,
                            paramType: ['string'],
                            // usrDefine: this.props.type === 'json' ? '@string()' : '',
                            usrDefine: '',
                            illustration: '',
                            path: record.path + '/' + this.state.count
                        });
                    }
                } else {
                    // if (this.props.type === 'json') {
                    //     switch (data[curIndex]['paramType'][0]) {
                    //         case 'string':
                    //             data[curIndex]['usrDefine'] = '@string()';
                    //             break;
                    //         case 'number':
                    //             data[curIndex]['usrDefine'] = '@integer()';
                    //             break;
                    //         case 'boolean':
                    //             data[curIndex]['usrDefine'] = '@boolean()';
                    //             break;
                    //     }
                    // }
                    delete data[curIndex]['children'];
                }
                this.setState({
                    dataSource,
                    count: this.state.count + 1
                });
            } else {
                data = data[curIndex]['children'];
            }
        }
        this.props.onOk(this.state.dataSource);
    };

    handleAdd = (record) => {
        let path, addStatus = true, indexes, children = [...this.state.dataSource],
            dataSource = [...this.state.dataSource];
        indexes = record.path.split("/");
        indexes.pop();
        path = indexes.join("/");
        if (indexes.length) {
            for (let i = 0; i < indexes.length; i++) {
                children.map(item => {
                    if (item['key'] === indexes[i]) {
                        if (i + 1 === indexes.length && item['paramType'][0] === 'array' && item['children'].length === 1)
                            addStatus = false;
                        else children = item.children;
                    }
                })
            }
            if (!addStatus) {
                return;
            }
            const newParam = {
                key: String(this.state.count),
                paramName: '',
                paramType: ['string'],
                // usrDefine: this.props.type === 'json' ? '@string()' : '',
                usrDefine: '',
                illustration: '',
                path: path + '/' + this.state.count
            };
            children.push(newParam);
            this.setState({
                dataSource,
                count: this.state.count + 1
            });
        } else {
            const newParam = {
                key: String(this.state.count),
                paramName: '',
                paramType: ['string'],
                // usrDefine: this.props.type === 'json' ? '@string()' : '',
                usrDefine: '',
                illustration: '',
                path: String(this.state.count)
            };
            this.setState({
                dataSource: [...dataSource, newParam],
                count: this.state.count + 1
            });
        }
    };

    displayRender = (label) => {
        return label[label.length - 1];
    };

    getDeepestCount = (dataSource) => {
        let count = 0;
        dataSource.map(item => {
            if (item.hasOwnProperty('children')) {
                count = this.getDeepestCount(item['children']);
            } else {
                let pathArr = item['path'].split('/');
                let index;
                if (pathArr.length && (index = pathArr.pop())) {
                    if (index > count) {
                        count = index;
                    }
                }
            }
        });
        return count;
    };

    propsJudge = (nextProps) => {
        let props = nextProps ? nextProps : this.props;
        let state = {};
        if (props.title.indexOf('参数')) {
            state['usrDefine'] = '自定义数组长度/返回值';
            state['option'] = retOptions;
        } else {
            state['usrDefine'] = '输入参数';
            state['option'] = inputOptions;
        }
        if (props.dataSource && props.dataSource.length) {
            state['dataSource'] = props.dataSource;
            state['count'] = this.getDeepestCount(props.dataSource) + 1;

        } else {
            state['dataSource'] = [{
                key: '0',
                paramName: '',
                paramType: ['string'],
                // usrDefine: this.props.type === 'json' ? '@string()' : '',
                usrDefine: '',
                illustration: '',
                path: '0'
            }]
        }
        this.setState(state);
    };

    componentWillReceiveProps(nextProps) {
        this.propsJudge(nextProps);
    }

    componentWillMount() {
        this.propsJudge();
    }

    onSelect = (record, val) => {
        this.onCellChange(record, 'usrDefine')(val);
    };

    render() {

        let columns = [{
            title: '字段',
            key: 'paramName',
            dataIndex: 'paramName',
            render: (text, record, index) => (
                <EditableCell
                    style={{width: 120}}
                    key="paramName"
                    value={record.paramName}
                    onChange={this.onCellChange(record, 'paramName')}
                />
            )
        }, {
            title: '类型',
            key: 'paramType',
            dataIndex: 'paramType',
            render: (text, record, index) => (
                // 类型选择下拉
                <Cascader
                    placeholder="请选择"
                    style={{width: 120}}
                    value={record.paramType.length ? record.paramType : ['string']}
                    options={this.state.option}
                    displayRender={this.displayRender}
                    onChange={(value) => this.handleChange(value, record)}
                />
            )
        }, {
            title: this.state.usrDefine ? this.state.usrDefine : '',
            key: 'usrDefine',
            dataIndex: 'usrDefine',
            render: (text, record, index) => {
                let opt;
                switch (record.paramType[0]) {
                    case 'string':
                        opt = strMockOpts;
                        break;
                    case 'number':
                        opt = numMockOpts;
                        break;
                    case 'boolean':
                        opt = boolMockOpts;
                        break;
                }
                if (this.state.usrDefine === '输入参数') {
                    return (
                        <EditableCell
                            style={{width: 120}}
                            key="usrDefine"
                            value={record.usrDefine}
                            onChange={this.onCellChange(record, 'usrDefine')}
                        />
                    )
                } else {
                    if (record.paramType[0] === 'array') {
                        return (
                            <EditableCell
                                style={{width: 200}}
                                key="usrDefine"
                                value={record.usrDefine}
                                onChange={this.onCellChange(record, 'usrDefine')}
                            />
                        )
                    } else if (record.paramType[0] === 'object') {
                        return (
                            <EditableCell
                                disabled
                                style={{width: 200}}
                                key="usrDefine"
                                value={record.usrDefine}
                                onChange={this.onCellChange(record, 'usrDefine')}
                            />
                        )
                    } else {
                        return (
                            <AutoComplete
                                onSearch={this.onSelect.bind(this, record)}
                                onSelect={this.onSelect.bind(this, record)}
                                value={String(record.usrDefine)}
                                style={{width: 200}}
                                allowClear={true}
                                filterOption={(inputValue, option) => String(option.props.children).indexOf(inputValue) !== -1}
                            >
                                {opt}
                            </AutoComplete>
                        )
                    }
                }
            }
        }, {
            title: '说明',
            key: 'illustration',
            dataIndex: 'illustration',
            render: (text, record, index) => (
                <EditableCell
                    style={{width: 150}}
                    key="illustration"
                    value={record.illustration}
                    onChange={this.onCellChange(record, 'illustration')}
                />
            )
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operations',
            render: (text, record, index) => (
                <div>
                    <Icon type="minus-circle-o" style={{fontSize: 18, marginLeft: 3, cursor: 'pointer'}}
                          onClick={() => this.onDelete(record)}/>
                    <Icon type="plus-circle-o" style={{fontSize: 18, marginLeft: 5, cursor: 'pointer'}}
                          onClick={() => this.handleAdd(record)}/>
                </div>
            )
        }];

        const {title, toString, toTable, format} = this.props;
        const {dataSource} = this.state;

        const paramModel = (
            <Table
                size="small"
                dataSource={ dataSource }
                columns={ columns }
                pagination={ false }
                defaultExpandAllRows={true}
            />
        );

        return (

            <section>
                {
                    paramModel
                }
                <div style={{marginTop: 9}}>
                    {
                        title.indexOf('参数') === -1 ?
                            <span>
                                <Button key="toJson" onClick={format}>格式化</Button>
                                <Button className="op-btn" key="toString" onClick={toString}>字符串化</Button>
                                <Button className="op-btn" key="toTable" onClick={toTable}>导入表格</Button>
                            </span>
                            :
                            null
                    }
                </div>
            </section>

        )
    }
}

export default ParamDefine;