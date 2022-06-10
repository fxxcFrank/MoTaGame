import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Tree } from 'element-react';
// import 'element-theme-default';
import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
// import style from './style.css'

class test extends Component{
    constructor(props) {
        super(props)
        this.state = {
          data: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          }],
          options: {
            children: 'children',
            label: 'label'
          }
        }
      
        // this.options = {
        //   label: 'name',
        //   children: 'zones'
        // }
        this.count = 1
      
      }
      
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      }
      
      loadNode(node, resolve) {
      
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);
      
        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }
      
        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }
      
          resolve(data);
        }, 500);
      }
      
      render() {
        const { data, options } = this.state
      
        return (
          <Tree
            data={data}
            options={options}
            isShowCheckbox={true}
            // lazy={true}
            // load={this.loadNode.bind(this)}
            onCheckChange={this.handleCheckChange.bind(this)}
            onNodeClicked={(data, nodeModel, reactElement, treeNode)=>{
              console.debug('onNodeClicked: ', data, nodeModel, reactElement)
            }}
          />
        )
      }
      
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    changeStatusPanel(data){
        dispatch(actionCreators.changeStatusPanel(data))
    },
});
export default connect(mapState, mapProps)(test);