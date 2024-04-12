import React from 'react';
import { Typography, List, Divider, Collapse  } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import $ from 'jquery'

export class RecordContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true,
        }
    }

    RefreshData() {
        $.ajax({
            type: "get",
            url: "testrecord/list",
            contentType: "application/json",
            async: false,
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ loading: false });
                    if (data.result == 0) {
                        this.setState({
                            dataSource: data.data,
                        });
                    } else {
                        console.log("get testrecord/list failed");
                    }
                }
            }
        })
    }

    componentDidMount() {
        this.RefreshData();
    }

    render() {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Typography.Title level={3}>测试结果</Typography.Title>
                <Divider />
                <List
                    pagination={{ position: 'bottom', align : 'center' }}
                    dataSource={this.state.dataSource}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Collapse 
                                style={{width: '100%'}} 
                                items={[{
                                    key: '1',
                                    label: item.time + " " + item.type + "           " + " 正确率 " + item.right + "/" + item.total,
                                    children: <List
                                        dataSource={item.test}
                                        renderItem={(item2, index2) => (
                                            <List.Item>
                                                {(item2.result ? <CheckCircleOutlined style={{ color: '#00ff00' }}/> : <CloseCircleOutlined style={{ color: '#ff0000' }}/>)}  {" " + item2.question}
                                            </List.Item>
                                        )}
                                    />
                            }]}/>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}