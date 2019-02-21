export const adminLteConf = {
  skin: 'green',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
    {label: 'MAIN NAVIGATION', separator: true},
    {label: '账户管理', route: 'user', iconClasses: 'fa fa-user-circle'},
    {label: '设备管理', route: 'device', iconClasses: 'fa fa-desktop'},
    {label: '数据分析', route: 'data-analyse', iconClasses: 'fa fa-list'},
    {label: '报警历史', route: 'alarm-log', iconClasses: 'fa fa-book'},
  ]
};
