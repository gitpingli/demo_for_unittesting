function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
} // 代码中会兼容本地 service mock 以及部署站点的静态数据

export default {
  // 支持值为 Object 和 Array
  '/api/currentUser': {
    name: 'Zusheng Ma',
    firstName: 'Zusheng',
    lastName: 'Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'zma@pccwglobal.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '北京市',
        key: '110000',
      },
      city: {
        label: '市辖区',
        key: '110100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  '/api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    // todo mock everyone can login to dev
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'user',
    });
    return;
  },
  '/api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
