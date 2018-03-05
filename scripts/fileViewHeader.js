import React from 'react';
import PropTypes from 'prop-types';
import { FileViewHeaderPath } from './fileViewHeaderPath';
export class FileViewHeader extends React.Component {
    static propTypes = {
        // current path
        path: PropTypes.string
    }

    static defaultProps = {
        path: '/'
    }

    render() {
        const { path } = this.props;
        return (
            <div className='f-head-wrapper'>
                <div className="btn-toolbar f-head-btns" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group mr-1" role="group" aria-label="First group">
                        <button className='btn btn-light btn-sm'>
                            <i className='fa fa-level-up'/>
                        </button>
                    </div>
                    <div className="btn-group mr-1" role="group" aria-label="Second group">
                        <button className='btn btn-light btn-sm'>
                            <i className='fa fa-repeat'/>
                        </button>
                    </div>
                    <div className="btn-group mr-1 f-hide-if-sm" role="group" aria-label="Second group">
                        <button className='btn btn-light btn-sm'>
                            <i className='fa fa-download'/>
                        </button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Third group">
                        <button className='btn btn-light btn-sm'>
                            <i className='fa fa-trash'/>
                        </button>
                    </div>
                </div>
                <div className="input-group f-head-search">
                    <input type="text" className="form-control form-control-sm" placeholder="搜尋..."/>
                    <div className="input-group-append">
                        <button className="btn btn-primary btn-sm">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <FileViewHeaderPath path={this.props.path}/>
            </div>
        );
    }
} 