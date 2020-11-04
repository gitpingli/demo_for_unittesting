'use strict';

const Mock = require('mockjs');
const _ = require("lodash");
const uuid = require('uuid-random');

const JWT_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhMjdlMDMxYS0yN2M2LTQzNzgtODQ2NC0zNWJlOGQ4OTk1MDgiLCJhdWQiOm51bGwsImlzcyI6IkNvbnNvbGUgQ29yZSBVc2VyIFNlcnZpY2UiLCJleHAiOjE2MTYxMDAxMzAsImlhdCI6MTU4NDU2NDEzMCwianRpIjoiOTc1MDM0OGItMWNhNy00ZmYxLWJhYjctYmI4ZTYzMWI0ZGQ1In0.NNyvwszbqMTTgXJeAi5QGBo7phK6NjpRIs9tVHDUGaU";

const AGENTS =  Mock.mock([{
    id:'a27e031a-27c6-4378-8464-35be8d899508',
    firstname: '@first',
    lastname: '@last',
    email: '@first@example.com',
    roles: ['SUPER_ADMIN'],
    company:"a27e031a-27c6-4378-8464-35be8d899502",
    deleted:false,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null
},{
    id:'a27e031a-27c6-4378-8464-35be8d899500',
    firstname: '@first',
    lastname: '@last',
    email: '@first@example.com',
    roles: ['ADMIN'],
    company:"a27e031a-27c6-4378-8464-35be8d899502",
    deleted:false,
    createdBy: "a27e031a-27c6-4378-8464-35be8d899508",
    updatedBy: "a27e031a-27c6-4378-8464-35be8d899508",
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null

},{
    id:'a27e031a-27c6-4378-8464-35be8d899501',
    firstname: '@first',
    lastname: '@last',
    email: '@first@example.com',
    roles: ['USER'],
    company:"a27e031a-27c6-4378-8464-35be8d899502",
    deleted:false,
    createdBy: "a27e031a-27c6-4378-8464-35be8d899508",
    updatedBy: "a27e031a-27c6-4378-8464-35be8d899508",
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null
}]);

const MEMBERS =  Mock.mock([{
    id:'b27e031a-27c6-4378-8464-35be8d899508',
    firstname: '@first',
    lastname: '@last',
    email: '@first@example.com',
    roles: ['PARTNER_SUPER_ADMIN'],
    company:"a27e031a-27c6-4378-8464-35be8d899508",
    deleted:false,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null
},{
    id:'b27e031a-27c6-4378-8464-35be8d899500',
    firstname: '@first',
    lastname: '@last',
    email: '@first@example.com',
    roles: ['PARTNER_ADMIN'],
    company:"a27e031a-27c6-4378-8464-35be8d899508",
    deleted:false,
    createdBy: "a27e031a-27c6-4378-8464-35be8d899508",
    updatedBy: "a27e031a-27c6-4378-8464-35be8d899508",
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null

},{
    id:'b27e031a-27c6-4378-8464-35be8d899501',
    firstname: '@first',
    lastname: '@last',
    email: '@first@example.com',
    roles: ['PARNTER_USER'],
    company:"a27e031a-27c6-4378-8464-35be8d899508",
    deleted:false,
    createdBy: "a27e031a-27c6-4378-8464-35be8d899508",
    updatedBy: "a27e031a-27c6-4378-8464-35be8d899508",
    deletedBy: null,
    createdAt: "2020-03-18T15:03:12.479Z",
    updatedAt: "2020-03-18T15:03:12.553Z",
    deletedAt: null
}]);

const COMPANIES =  Mock.mock([{
        id:'a27e031a-27c6-4378-8464-35be8d899508',
        name: '@name',
        email: 'sample.com',
        types: [
            "PARTNER",
        ],
        industryType: "A2PSMS PROVIDER",
        status: "CREATED",
        website: "www.dave.com",
        walletAddress: [
            {
                from:"QLC",
                address:"qlc_1thioc61dxxzksmjxp75uyprfgr7cokmaaog6tj7djsqwysnzie3wwni7iu7",
            }
        ],

        deleted:false,
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
        createdAt: "2020-03-18T15:03:12.479Z",
        updatedAt: "2020-03-18T15:03:12.553Z",
        deletedAt: null
    },{
        id:'a27e031a-27c6-4378-8464-35be8d899500',
        name: '@name',
        email: 'sample.com',
        types: [
            "PARTNER",
        ],
        industryType: "A2PSMS PROVIDER",
        status: "CREATED",
        website: "www.dave.com",
        walletAddress: [
            {
                from:"QLC",
                address:"qlc_1thioc61dxxzksmjxp75uyprfgr7cokmaaog6tj7djsqwysnzie3wwni7iu7",
            }
        ],
        deleted:false,
        createdBy: "a27e031a-27c6-4378-8464-35be8d899508",
        updatedBy: "a27e031a-27c6-4378-8464-35be8d899508",
        deletedBy: null,
        createdAt: "2020-03-18T15:03:12.479Z",
        updatedAt: "2020-03-18T15:03:12.553Z",
        deletedAt: null

    },{
        id:'a27e031a-27c6-4378-8464-35be8d899501',
        name: '@name',
        email: 'sample.com',
        types: [
            "PARTNER",
        ],
        industryType: "A2PSMS PROVIDER",
        status: "CREATED",
        website: "www.dave.com",
        walletAddress: [
            {
                from:"QLC",
                address:"qlc_1thioc61dxxzksmjxp75uyprfgr7cokmaaog6tj7djsqwysnzie3wwni7iu7",
            }
        ],
        deleted:false,
        createdBy: "a27e031a-27c6-4378-8464-35be8d899508",
        updatedBy: "a27e031a-27c6-4378-8464-35be8d899508",
        deletedBy: null,
        createdAt: "2020-03-18T15:03:12.479Z",
        updatedAt: "2020-03-18T15:03:12.553Z",
        deletedAt: null
    },{
        id:'a27e031a-27c6-4378-8464-35be8d899502',
        name: '@name',
        email: 'sample.com',
        types: [
            "OWNER",
        ],
        industryType: "A2PSMS PROVIDER",
        status: "CREATED",
        website: "www.dave.com",
        walletAddress: [
            {
                from:"QLC",
                address:"qlc_1thioc61dxxzksmjxp75uyprfgr7cokmaaog6tj7djsqwysnzie3wwni7iu7",
            }
        ],

        deleted:false,
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
        createdAt: "2020-03-18T15:03:12.479Z",
        updatedAt: "2020-03-18T15:03:12.553Z",
        deletedAt: null
    }
]);

function users(url,req, res){
    const endpoint = `${req.method} ${url}`;

    if("POST /users/login" === endpoint){

        const {username, password} = req.data;

        if(username === 'test@test.com' && password === 'fc0b64A5'){
            res.data={
               key: JWT_TOKEN,
            }
        }else{
            res.status = 401,
            res.data={
               error: 'Unauthorization'
            }
        }
    }
    else if("GET /users" === endpoint){
        res.data = AGENTS;
    }
    else if("POST /users" === endpoint){
        const user = req.data;
        user.id = uuid();
        AGENTS.push(user);
        res.data = user;
    }
    else if(endpoint.startsWith("GET /users/") || endpoint.startsWith("PATCH /users/")|| endpoint.startsWith("DELETE /users/")){
        const id = url.substring(7);
        console.log("ID:"+id);
        if(id === 'profile'){
            res.data = AGENTS[0];
        }else{
            const agent = _.find(AGENTS, agent=>agent.id === id);
            if(agent){
                res.data = agent;
            }else{
                res.status = 404;
                res.data.error = "NOT FOUND";
            }
        }
    }
    return res;
}

function companies(url,req,res){
    const endpoint = `${req.method} ${url}`;

    if("GET /companies" === endpoint){
        res.data = COMPANIES;
    }
    else if("POST /companies" === endpoint){
        const company = req.data;
        company.id = uuid();0
        COMPANIES.push(company);
        res.data = company;
    }
    else if(endpoint.startsWith("GET /companies/") || endpoint.startsWith("PATCH /companies/") || endpoint.startsWith("DELETE /companies/")){
        const id = url.substring(11);
        console.log("ID:"+id);

        const company = _.find(COMPANIES, company=>company.id === id);
        if(company){
            res.data = company;
        }else{
                res.status = 404;
                res.data.error = "NOT FOUND";
            }

    }
    return res;
}

function curl(url, req) {

    const endpoint = `${req.method} ${url}`;

    console.log("endpoint:" + endpoint);
    console.log("Authorization:" + req.headers.Authorization);

    const res = {
        status:200,
        data:{}
    }

    if(url !== '/users/login'&&( !req.headers.Authorization || !req.headers.Authorization.startsWith("Bearer"))){
        res.status = 401;
        res.data={
            error:'Unauthorization'
        }
        return res;
    }
    if(url.startsWith("/users")){
        return users(url,req,res);
    }else if (url.startsWith("/companies")){
        return companies(url,req,res);
    }
    return res;
}



module.exports = {
  curl
};
