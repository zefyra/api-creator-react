

// // 之後刪

// export default TabTableModal function() {
//     if (!(control instanceof SubTableControl)) {
//         console.error(`control is not instanceof SubTableControl`)
//         return <div></div>;
//     }

//     const controlName = control.getControlName();
//     // controlName: 'MemberDataTableFlow'

//     const [title, setTitle] = useState(model.getState('modalTitle'));
//     model.registSetter('modalTitle', `${controlName}_TabTableModal`, setTitle);

//     const [tab, setTab] = useState(model.getState('tab'));

//     const actTab = model.reactive('tab', `${controlName}_TabTableModal`, setTab);

//     let tabTableListDom = tabList.map((tabItem, index) => {
//         return (
//             (<TabTable key={`${controlName}_TabTable_${index}`} show={tab === tabItem.value}
//                 control={control.getTabTableControl(tabItem.value)}
//             />)
//         );
//     });

//     return (
//         <TabModal modalRef={control.bindAct('bindModalRef')}
//             tabList={tabList} onTabChange={actTab}
//             headerSlot={<ModalTitleStyled>{title}</ModalTitleStyled>}
//             reactTab={setTab => model.reactive('tab', `${controlName}_TabModal`, setTab)}
//             modalWidth={1000} modalHeight={660}
//         >
//             {tabTableListDom}
//         </TabModal>
//     )
// }