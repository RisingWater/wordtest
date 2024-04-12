import React from 'react';
import { Layout, Menu } from 'antd';
import $ from 'jquery';
import { TestContent } from './TestContent.js'
import { RecordContent } from './RecordContent.js';

const items = [
    { key: 0, label: '单词小测' },
    { key: 1, label: '测试结果' },
];

class WordTestApp extends React.Component {
    constructor(props) {
        super(props);
        this.HeaderRef = React.createRef();
        this.state = {
            ContextHeight: 0,
            menuSelectedkey: "0"
        }
    }

    componentDidMount() {
        var HeaderHeight = this.HeaderRef.current.offsetHeight;
        var WindowHeight = $(window).height();
        var ContextHeight = WindowHeight - HeaderHeight;

        this.setState({
            ContextHeight: ContextHeight,
        })
    }

    onMenuSelectChange = (object) => {
        var state = { menuSelectedkey: object.key };
        this.setState(state);
    }

    getContent() {
        if (this.state.menuSelectedkey == 0) {
            return (
                <TestContent/>
                );
        } else if (this.state.menuSelectedkey == 1) {
            return (
                <RecordContent/>
                );
        }
    }


    render() {
        return (
            <Layout>
                <div ref={this.HeaderRef}>
                    <Layout.Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', }} >
                        <Menu theme="dark" 
                            mode="horizontal" 
                            defaultSelectedKeys={['2']} 
                            items={items} 
                            style={{ flex: 1, minWidth: 0, }}
                            onClick={this.onMenuSelectChange}
                        />
                    </Layout.Header>
                </div>
                <Layout.Content style={{ background: '#fff', paddingLeft: 24, paddingRight: 24, margin: 0, minHeight: this.state.ContextHeight, }}>
                    {this.getContent()}
                </Layout.Content>
            </Layout>
        )
    }
}

export default WordTestApp;
