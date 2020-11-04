'use strict'

const BaseController = require('./base')

class EndpointController extends BaseController {
  async docs () {
    const { ctx } = this
    ctx.body = {
      data: {
        company: [
          {
            name: 'consoleconnect',
            content: 'consoleconnect',
            imgUrl: '/logos/logo-console-connect.png',
            link: 'https://app.test.consoleconnect.com/home',
            updatedAt: '2020.01.20 12:00',
            version: '1.0.0',
            enabled: true
          },
          {
            name: 'oocl',
            content: 'oocl',
            imgUrl: '/logos/logo-oocl.png',
            link: '',
            enabled: false
          },
          {
            name: 'C',
            content: 'C',
            imgUrl: '/logos/logo-pccw.svg',
            link: 'https://shield.test.consoleconnect.com/',
            updatedAt: '2020.01.20 11:00',
            version: '1.0.1',
            enabled: true
          },
          {
            name: 'SITA',
            content: 'SITA',
            imgUrl: '/logos/logo-sita.png',
            link: '',
            enabled: false
          }
        ],
        feature: [
          {
            name: 'Zeebe',
            enabled: true,
            imgUrl: '/logos/logo-zeebe.png',
            title: 'Lifecycle Management'
          },
          {
            name: 'Feature Management',
            title: 'Feature Management',
            enabled: false
          },
          {
            name: 'User Management',
            childList: []
          },
          {
            name: 'Telco Partner SDK',
            title: 'Telco Partner SDK',
            enabled: true,
            updatedAt: '2020.01.20 12:00',
            version: '1.0.0',
            imgUrl: '/logos/logo-colt.png',
            link: 'https://www.colt.net/'
          },
          {
            name: 'Cloud Partner SDK',
            title: 'Cloud Partner SDK',
            enabled: true,
            childList: [
              {
                name: 'Alibaba Cloud',
                title: 'Alibaba Cloud',
                imgUrl: '/logos/logo-alibaba-cloud-words.png',
                link: 'https://www.alibabacloud.com/',
                updatedAt: '2020.01.20 12:00',
                version: '4.0.0',
                enabled: true
              },
              {
                name: 'IBM Cloud',
                title: 'IBM Cloud',
                updatedAt: '2020.01.20 12:00',
                version: '1.0.0',
                imgUrl: '/logos/logo-ibm-cloud-words.png',
                link: 'https://cloud.ibm.com/apidocs',
                enabled: true
              }
            ]
          }
        ],
        backendService: [
          {
            name: 'CRM',
            enabled: true,
            childList: [
              {
                name: 'Hubspot',
                content: 'Hubspot',
                imgUrl: '/logos/logo-hubspot.png',
                link: 'https://ps-crm.test.consoleconnect.com/docs',
                updatedAt: '2020.01.20 12:00',
                version: '1.0.0',
                enabled: true
              }
            ]
          },
          {
            name: 'Billing',
            enabled: false,
            childList: [
              {
                name: 'BearingPoint',
                content: 'BearingPoint',
                imgUrl: '/logos/logo-bearingpoint.png',
                link: 'https://www.bearingpoint.com/en/',
                enabled: true
              },
              {
                name: 'BillingPlatform',
                content: 'BillingPlatform',
                imgUrl: '/logos/logo-billingplatform.png',
                link: 'https://www.google.com.hk',
                enabled: false
              },
              {
                name: 'AsiaInfo',
                content: 'AsiaInfo',
                imgUrl: '/logos/logo-asiainfo.png',
                link: 'https://www.google.com.hk',
                enabled: false
              }
            ]
          },
          {
            name: 'User Management',
            childList: []
          },
          {
            name: 'Logging',
            childList: [
              {
                name: 'elastic',
                content: 'elastic',
                imgUrl: '/logos/logo-elastic.png',
                link: 'https://www.elastic.co/',
                enabled: true
              }
            ]
          },
          {
            name: 'Settlement',
            childList: [
              {
                name: 'clear',
                content: 'clear',
                imgUrl: '/logos/logo-clear.png',
                link: 'https://www.google.com.hk',
                enabled: false
              },
              {
                name: 'QLCchain',
                content: 'QLCchain',
                imgUrl: '/logos/logo-qlc.png',
                link: 'https://www.google.com.hk',
                enabled: false
              }
            ]
          },
          {
            name: 'Tiketing',
            childList: [
              {
                name: 'bmc',
                content: 'bmc',
                imgUrl: '/logos/logo-bmc.png',
                link: 'https://www.google.com.hk',
                enabled: false
              }
            ]
          },
          {
            name: 'Payment',
            childList: [
              {
                name: 'stripe',
                content: 'stripe',
                imgUrl: '/logos/logo-stripe.png',
                link: 'https://www.google.com.hk',
                enabled: false
              }
            ]
          },
          {
            name: 'Entitlement',
            childList: []
          },
          {
            name: 'Role Based Access Control',
            childList: []
          }
        ]
      }
    }
    ctx.status = 200
  }
}

module.exports = EndpointController
