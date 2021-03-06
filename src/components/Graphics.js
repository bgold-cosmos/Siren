import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

// CSS Imports
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';

import { shaders } from './shaders/simple'

// const ReactDOM = require("react-dom");
const { Surface } = require("gl-react-dom");
const GL = require("gl-react");

@inject('rollStore')
@observer
export default class Graphics extends React.Component {
    
  updateDimensions() {
      const element = document.getElementById('graphicsLayout');
      if(element && element !== null){
          const w = element.clientWidth;
          const h = element.clientHeight;

          // -25 (header) -3 (borders) -24 (controls) -1 border
          return {w: w, h: h-29};
      }
      return { w: 1100, h: 190 };
  }

  getParameterSafe(parameterName, defaultValue) {
    return (this.props.rollStore.value !== undefined ?
      (this.props.rollStore.value[parameterName] !== undefined ?
        this.props.rollStore.value[parameterName]
        :
        defaultValue)
      : (defaultValue));
  }

  render() {
    console.log("RENDER GRAPHICS");
      
    let rollStore = this.props.rollStore;

    let dimensions = this.updateDimensions();
    let width =  dimensions.w;
    let height = dimensions.h;

    // uniform declaration
    let resolution = [width, height];
    let iTime = rollStore.value !== undefined ? rollStore.value.time : (new Date().getTime());
    
    // sample parameters
    let nameAscii = _.map(_.split(_.toLower(rollStore.value !== undefined ? rollStore.value.s : ""), '', 5), (c) => { return c.charCodeAt(0) });
    let note = this.getParameterSafe('n', 0);
    let cps = this.getParameterSafe('cps', 1);
    let delta = this.getParameterSafe('delta', 1);
    let cycle = this.getParameterSafe('cycle', 1);
    let begin = this.getParameterSafe('begin', 0);
    let end = this.getParameterSafe('end', 1);
    let room = this.getParameterSafe('room', 1);
    let gain = this.getParameterSafe('gain', 1);
    let channel = this.getParameterSafe('sirenChan', 0);

    return (
      <Surface width={width} height={height} ref="graphicsGL">
        <GL.Node
          shader={shaders.helloGL}
          uniforms={{
            resolution, iTime,
            nameAscii, note,
            cps, delta, cycle,
            begin, end,
            room, 
            gain, 
            channel
          }}
          width={width}
          height={height}
        />
      </Surface>     
    );
  }
}
      

