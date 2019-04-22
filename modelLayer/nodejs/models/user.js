'use strict';

class User {
    constructor() {
        this.id = 'id_1';
    }
    set name(name) {
        this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    get name() {
        return this._name;
    }

}

module.exports = User;