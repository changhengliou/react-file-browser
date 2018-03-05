import React from 'react';
import ReactDOM from 'react-dom';
import { TimerView, appState } from './index';
import { FileView } from './fileView';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import '../css/index.css';

ReactDOM.render(
    <div>
        <FileView/>
    </div>, 
    document.getElementById('site-app'));
