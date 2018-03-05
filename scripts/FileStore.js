import { observable, observe, autorun, computed, action } from 'mobx';
import React from 'react';
import request from 'superagent';

class FileViewStore {
    @observable directories = observable.map();
    @observable files = observable.map();
    @observable currentPath = "";
    @observable activePage = 1;
    /**
     * request for the files and folders under the specify directory.
     * @param {string} path - request directory path 
     */
    @action.bound listDirectoryFiles(path) {
        this.currentPath = path;
        if (this.directories.has(path) && this.files.has(path)) {
            return;
        }

        request.get(`http://localhost:3000/path?base=${path}`)
            .then(res => {
                // alter this when in real application
                const { directories, files } = res.body[0];
                this.directories.set(path, directories);
                this.files.set(path, files);
            })
            .catch(err => {
                if (err.status === 403) {
                    window.location = "/";
                    return;
                }
            })
    }

    /**
     * when file is either selected or unselected
     * @param {number} id - id
     * @param {string} path - path
     * @param {bool} isDir - isDir
     */
    @action.bound onFileSelected(id, path, isDir) {
        const clickItem = item => item.id === id; 
        if (isDir) {
            if (!this.directories.has(path))
                throw new Error('Directory not found.');
            var newVal = this.directories.get(path);
            newVal.find(clickItem).selected = !newVal.find(clickItem).selected;
        } else {
            if (!this.files.has(path))
                throw new Error('File not found.');
            var newVal = this.files.get(path), 
                isSelected = newVal.find(clickItem).selected;
            newVal.find(clickItem).selected = !newVal.find(clickItem).selected;
        }
    }

    @action.bound onPageChange(page, maxPage) {
        if (page > maxPage || page < 1)
            return;
        this.activePage = parseInt(page);
    }
}

export var store = window.store = new FileViewStore;

autorun(() => {
    console.log('path changed --> ', store.currentPath);
})