import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

import './TreeView.css';

const UL = styled.ul`
    &::before {
        content: '';
        position: absolute; top: 0; left: 50%;
        border-left: 1px solid #ccc;
        width: 0; height: 20px;
    }
`;

const LastUL = styled.ul`
    padding-top: 20px; position: relative;
        
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
`;

const LI = styled.li`
    float: left; text-align: center;
    list-style-type: none;
    position: relative;
    padding: 20px 5px 0 5px;

    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
   
    &::before, &::after {
        content: '';
        position: absolute; top: 0; right: 50%;
        border-top: 1px solid #ccc;
        width: 50%; height: 20px;
    }
    &::after {
        right: auto; left: 50%;
	    border-left: 1px solid #ccc;
    }
    &:only-child::after, &:only-child::before {
        display: none;
    }
    &:only-child{ padding-top: 0;}
    &:first-child::before, &:last-child::after{
        border: 0 none;
    }
    &:last-child::before{
        border-right: 1px solid #ccc;
        border-radius: 0 5px 0 0;
        -webkit-border-radius: 0 5px 0 0;
        -moz-border-radius: 0 5px 0 0;
    }
    &:first-child::after{
        border-radius: 5px 0 0 0;
        -webkit-border-radius: 5px 0 0 0;
        -moz-border-radius: 5px 0 0 0;
    }
`;

const Anchor = styled.a`
    background-color: ${props => props.color};
    font-size: 17px;
    color: #666;
    border: 1px solid #ccc;
    padding: 5px 10px;
    font-family: arial, verdana, tahoma;
    display: inline-block;

    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;

    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
`;

function renderChildren(structure, path, links, reverseLink, properties) {
    let propText = "";
    if (structure === 'file') {
        return;
    } else {
        const childrenDir = Object.keys(structure);
        return (
            childrenDir.map((child) => {
                let color = "#FFF";
                let childrenPath = path + '/' + child;
                if (structure[child] === 'file') {
                    color = "#C0C0C0";
                }
                console.log("link", JSON.stringify(links));
                console.log("reverseLink", JSON.stringify(reverseLink))
                if (Object.keys(links).includes(childrenPath) || (Object.keys(reverseLink).includes(childrenPath))) {
                    color = "#FCC";
                } else if (structure[child] !== 'file') {
                    color = "#FFF";
                } else {
                    color = "#C0C0C0";
                }
                if (properties['hide'].includes(childrenPath)) {
                    propText = "(hide)";
                }
                return (
                    // Render children
                    <LI>
                        <Anchor color={color}>
                            {`${child}${propText}`} 
                        </Anchor>
                        {childrenDir !== 'file' ?  renderTree(structure[child], childrenPath, links, reverseLink, properties) : {}}
                    </LI>
                )
            })
        )
    }
}

const renderTree = (structure, path, links, reverseLink, properties) => {
    const childrenDir = Object.keys(structure);
    if (childrenDir.length === 0 || structure === 'file') {
        // This is a file or the last element
        return (
            <LastUL>
                {renderChildren(structure, path, links, reverseLink, properties)}
            </LastUL>
        )
    } else {
        return (
            <UL>
                {renderChildren(structure, path, links, reverseLink, properties)}
            </UL>
        )
    }
}

class TreeView extends Component {
    render() {
        const { structure, properties, links, reverseLink } = this.props;
        const childrenDir = Object.keys(structure);
        return (
            <div class="parent">
                <LastUL>
                    <LI>
                        <Anchor>/</Anchor>
                        {renderTree(structure, '', links, reverseLink, properties)}
                    </LI>
                </LastUL>
            </div>
        );
    }
}

TreeView.propTypes = {
    structure: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    links: PropTypes.object.isRequired,
    reverseLink: PropTypes.object.isRequired
};

TreeView.defaultProps = {
};

export default TreeView;