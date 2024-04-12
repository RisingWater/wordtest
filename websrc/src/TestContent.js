import React from 'react';
import { Typography, Progress, Divider, Card, Radio, Button, message, Result } from 'antd';
import {
    DoubleRightOutlined
} from '@ant-design/icons';
import $ from 'jquery'

export class TestContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            percent: 0,
            current: 0,
            selectAnswer: ""
        }
    }

    RefreshData() {
        var json = { "count": 10 };
        $.ajax({
            type: "post",
            url: "wordtest/getall",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(json),
            success: (data, status) => {
                this.setState({
                    data: data.data,
                });
            }
        })
    }

    SendReport(report) {
        var json = { "data": report };
        $.ajax({
            type: "post",
            url: "testrecord/add",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(json),
            success: (data, status) => {
                console.log("send report ok");
            }
        })
    }

    componentDidMount() {
        this.RefreshData();
    }

    chooseAnswer(e) {
        this.setState({ selectAnswer: e.target.value }, () => {
            console.log("select: ", this.state.selectAnswer);
        });
    }

    getQuestion() {
        if (this.state.data.length == 0) {
            return (<div />);
        }

        if (this.state.current < this.state.data.length) {
            var item = this.state.data[this.state.current];

            console.log(this.state.data);

            return (<div>
                <Card title={item.question} bordered={true} extra={<Button type="primary" onClick={this.toNext.bind(this)}>下一题<DoubleRightOutlined /></Button>}>
                    <Radio.Group size="large" buttonStyle="solid" onChange={this.chooseAnswer.bind(this)}>
                        <Radio.Button style={{ width: '150px', textAlign: 'center' }} value={item.choices[0].answer}>{item.choices[0].answer}</Radio.Button>
                        <Radio.Button style={{ width: '150px', textAlign: 'center' }} value={item.choices[1].answer}>{item.choices[1].answer}</Radio.Button>
                        <Radio.Button style={{ width: '150px', textAlign: 'center' }} value={item.choices[2].answer}>{item.choices[2].answer}</Radio.Button>
                        <Radio.Button style={{ width: '150px', textAlign: 'center' }} value={item.choices[3].answer}>{item.choices[3].answer}</Radio.Button>
                    </Radio.Group>
                </Card>
            </div>)
        }
        else {
            var totalCount = this.state.data.length;
            var rightCount = 0;
            this.state.data.forEach((item) => {
                if (item.result) {
                    rightCount++;
                }
            })

            var percent = rightCount * 100 / totalCount;

            return (<div>
                <Result
                    status="success"
                    title="单词小测完成!"
                    subTitle={"一共测试" + totalCount + "个单词, 正确" + rightCount + "个。正确率百分之" + percent + "。"}
                />
            </div>)
        }
    }

    toNext() {
        if (this.state.data.length == 0) {
            return;
        }
        var item = this.state.data[this.state.current];

        item.selectAnswer = this.state.selectAnswer;
        if (this.state.selectAnswer == item.answer) {
            message.success({ content: '回答正确' });
            item.result = true;
        } else {
            message.error({ content: '回答错误' });
        }

        var newcurrent = this.state.current + 1;
        var newpercent = newcurrent * 100 / this.state.data.length;

        this.setState({ 
            current: newcurrent,
            percent: newpercent,
            selectAnswer: ""
        });

        if (newcurrent == this.state.data.length)
        {
            const now = new Date();
            const currentTime = now.toLocaleString();

            var total = this.state.data.length;
            var correct = 0;
            this.state.data.forEach((item) => {
                if (item.result) {
                    correct++;
                }
            })

            var testRecord = {
                "type" : "普通小测",
                "time" : currentTime,
                "right": correct,
                "total": total,
                "test" : this.state.data,
            }

            this.SendReport(testRecord);
        }
    }

    render() {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Typography.Title level={3}>单词小测</Typography.Title>
                <Divider />
                <Typography.Title level={5}>答题进度</Typography.Title>
                <Progress percent={this.state.percent} />
                <Divider />

                {this.getQuestion(this.state.data)}
            </div>
        );
    }
}