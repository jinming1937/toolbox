export type EPage = 'home' | 'json' | 'format' | 'decode'

export type IMenuItem = {
  name: string
  link: string
  page: EPage
  desc: string
  dateTime: string
}

export const MenuList: IMenuItem[] = [
  {name: '首页', link: '/home', page: 'home', desc: '', dateTime: ''},
  {name: 'JSON格式化', link: '/json', page: 'json', desc: 'JSON格式化', dateTime: '2017-01-30 19:30:20'},
  {name: '变量名转换', link: '/format', page: 'format', desc: '变量名称进行「驼峰to帕斯卡」或者「帕斯卡to驼峰」', dateTime: '2017-08-19 23:30:20'},
  {name: 'URL解析', link: '/decode', page: 'decode', desc: '对URL地址字符串decode，并且解析参数', dateTime: '2017-06-30 19:30:20'}
]
