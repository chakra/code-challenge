'use strict';

module.exports = function (sequelize, DataTypes) {

    const User = sequelize.define('user', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return User;
}

