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
     * @param {boolean} pageChange - trigger page rendering
     */
    @action.bound listDirectoryFiles(path, pageChange = true) {
        if (pageChange)
            this.currentPath = path;
        if (this.directories.has(path) && this.files.has(path)) {
            return;
        }

        return request.get(`http://localhost:3000/path?base=${path}`)
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
    @action.bound async onFileSelected(id, path, isDir) {
        const clickItem = item => item.id === id; 
        if (isDir) {
            if (!this.directories.has(path))
                throw new Error('Directory not found.');
            var dirs = this.directories.get(path), 
                clickedDir = dirs.find(clickItem),
                clickedPath = `${clickedDir.path}`,
                clicked = clickedDir.selected = !clickedDir.selected;
            await this.listDirectoryFiles(clickedPath, false);
            this.files.get(clickedPath).map(f => f.selected = clicked);
        } else {
            if (!this.files.has(path))
                throw new Error('File not found.');
            var files = this.files.get(path), 
                clickedFile = files.find(clickItem),
                clicked = clickedFile.selected = !clickedFile.selected,
                parentDirPath = path.substring(0, path.lastIndexOf('/')),
                parentDir = this.directories.get(parentDirPath ? parentDirPath : '/');
            if (path !== '/' && parentDir) {
                let dir = parentDir.find(item => item.path === path);
                if (!clicked) {
                    if (dir) dir.selected = false;
                } else {
                    if (!this.files.get(path).filter(f => f.selected == false).length)
                        dir.selected = true;
                }
            }
        }
    }

    /**
     * fire when page change is clicked
     * @param {Number} page - current page
     * @param {Number} maxPage - maximum page 
     */
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