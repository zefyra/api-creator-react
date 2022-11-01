/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
    static defaultProps = {
        x: 20,
        y: 20,
    };
    state = {
        color: 'green'
    };
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };
    render() {
        // 拖曳範例
        // return (
        //     <Rect
        //         x={20}
        //         y={20}
        //         width={50}
        //         height={50}
        //         fill={this.state.color}
        //         shadowBlur={5}
        //         onClick={this.handleClick}
        //         draggable // 可拖曳
        //     />
        // )

        return (
            <Group x={this.props.x} y={this.props.y}>
                <Rect
                    width={130}
                    height={50}
                    fill={this.state.color}
                    shadowBlur={5}
                    onClick={this.handleClick}
                />
                <Text x={5} y={5} text="Click" fontSize={22}
                    onClick={this.handleClick} />
            </Group>
        )
    }
}




/* 在方塊中加入文字
function spawnRectangle(angle) {
    var rectangle = new Konva.Group({
        x: 25,
        y: 25,
        width: 130,
        height: 25,
        rotation: angle,
        draggable: true,
    });

    rectangle.add(new Konva.Rect({
        width: 130,
        height: 25,
        fill: 'lightblue'
    }));

    rectangle.add(new Konva.Text({
        text: '123',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#000',
        width: 130,
        padding: 5,
        align: 'center'
    }));
    rectangleLayer.add(rectangle);
    stage.add(rectangleLayer);
}*/

const TopoTest = () => {

    const width = window.innerWidth;
    const height = window.innerHeight;

    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const handleScale = type => () => {

        let scaleOffset = 0;
        if (type === 'up') {
            scaleOffset = 0.1;
        } else if (type === 'down') {
            scaleOffset = -0.1;
        }

        setScaleX(scaleX + scaleOffset);
        setScaleY(scaleY + scaleOffset);
    }

    return (
        <Stage width={width} height={height}>
            <Layer>
                <Group scaleX={scaleX} scaleY={scaleY} draggable>
                    <Rect
                        width={width}
                        height={height}
                        fill="#e1e1e1"
                    />
                    <Group x={50} y={120}>
                        <Rect width={80} height={30} fill="#1f5e88" onClick={handleScale('up')}></Rect>
                        <Rect x={0} y={50} width={80} height={30} fill="#54a7df" onClick={handleScale('down')}></Rect>
                    </Group>
                    <ColoredRect />
                    <ColoredRect x={200} />
                    <ColoredRect x={400} />
                </Group>
                {/* <Text x={20} y={20} text="Try click on rect" /> */}
            </Layer>
        </Stage>
    );
}


export default function TopologyGraph({ fetchControl }) {
    return (<TopoTest></TopoTest>)
    // return <div>TopologyGraph</div>
}