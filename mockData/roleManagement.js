'use strict';

const _ = require("lodash");
const Mock = require('mockjs');

const ROLES =  [{
    id:'100000000001',
    name:"SUPER_ADMIN",
    description:"SUPER ADMIN CAN DO ANYTHING",
    permissions:[],
    deleted:false,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null
},{
    id:'100000000002',
    name:"ADMIN",
    description:" ADMIN CAN DO ...",
    permissions:[],
    deleted:false,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null

},{
    id:'100000000003',
    name:"USER",
    description:" USER CAN DO ...",
    permissions:[],
    deleted:false,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null
}];


function findAll() {
  return ROLES;
}
function findOne(id) {
  return _.find(ROLES, role=>role.id === id);
}

function create(request){
    ROLES.push(
        {
            id:request.key,
            key:request.key
        }
    );
}



module.exports = {
  findAll,
  findOne,
  create
};
