export type EPage = 'home' | 'json' | 'format'

export type IMenuItem = {
  name: string;
  link: string;
  page: EPage;
}

export const MenuList: IMenuItem[] = [
  {name: '首页', link: '/home', page: 'home'},
  {name: '变量名转换', link: '/format', page: 'format'},
]
