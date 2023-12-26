
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import styled from 'styled-components';

import BlankBlock from 'element/Home/BlankBlock'

import { board as boardThemeObject } from 'theme/reas'
import { layout as layoutThemeObject } from 'theme/reas'
import { fetchTheme } from 'util/ThemeMixin'
import Button from "component/Button";
// import ProfileControl from "river/Profile";


// 5 React Design Patterns You Should Know
// https://javascript.plainenglish.io/5-react-design-patterns-you-should-know-629030e2e2c7
// 正在測試這5種React的Design Pattern


const UList = styled.ul`
    
`

// 1. Container and Presentational Components

function TodoPresentational({ todos = [], onAddTodo = () => { } }) {

    // <>: 類似於<template>的語法，虛擬化組件root的那個DOM
    // onAddTodo: 直接執行該函式，即可設定完畢該Button要輸入的參數，變得簡潔
    return (
        <>
            <UList>
                {todos.map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
            </UList>
            <Button type="fill" onClick={onAddTodo({ id: Date.now(), text: 'New Todo' })}> Add Todo</Button>
        </>
    );
}


// ---------------------------------------------------

// 這種寫法可以用來管理多個組件當中共用的邏輯，並且將該邏輯單純化
function withLoading(WrappedComponent) {
    // return function LoadingComponent({ isLoading, ...props }) {
    //     return <WrappedComponent {...props} />;
    // }
    return function LoadingComponent({ isLoading, ...props }) {
        const [loading, setLoading] = useState(isLoading);

        useEffect(() => {
            console.log('isLoading', isLoading)
            setLoading(isLoading);
        }, [isLoading]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };
}


// 透過withLoading()把TodoList組件多包一層，掛載通用的邏輯上去
const TodoListWithLoading = withLoading(TodoPresentational);

function ChartTest({ className }) {

    // 3. Render Props

    // 未完成

    
    // 2. Higher-Order Components (HOCs) 

    const [isLoading, setIsLoading] = useState(false);

    const [todos, setTodos] = useState([{
        id: 1,
        text: 'AAAAAAAAA'
    }]);

    const onAddTodo = () => (obj) => () => {
        // 第一層: 生成實體
        // 第二層: 在Button當中掛載參數
        // 第三層: click時呼叫的函式
        console.log('onAddTodo', obj)
        setTodos([...todos, obj])
    }
    const onClickLoadTodos = () => {
        // () => setIsLoading(true)
        setIsLoading(true);
        setTimeout(function () {
            setIsLoading(false)
        }, 2000);
    }

    return (
        <div>
            <Button type="fill" onClick={onClickLoadTodos}>Load Todos</Button>
            <TodoListWithLoading isLoading={isLoading} todos={todos} onAddTodo={onAddTodo()} />
        </div>
    );

    /* TodoPresentational********************************************
    // 1. Container and Presentational Components

    const [todos, setTodos] = useState([{
        id: 1,
        text: 'AAAAAAAAA'
    }]);

    const onAddTodo = () => (obj) => () => {
        // 第一層: 生成實體
        // 第二層: 在Button當中掛載參數
        // 第三層: click時呼叫的函式
        console.log('onAddTodo', obj)
        setTodos([...todos, obj])
    }

    return (
        <div>
            <TodoPresentational todos={todos} onAddTodo={onAddTodo()}></TodoPresentational>
        </div>
    )
    ************************************************************** */

    // // 測試API用，之後刪
    // const testApiHandle = () => () => {
    //     // new ProfileControl().autoLoadUserProfile();

    //     // return ApiSender.sendApi('[get]/permissions').then((apiRes) => {
    //     //     console.log('aaa apiRes', apiRes.rows);
    //     // });
    // }

    // return (
    //     <div className={className}>
    //         <div className="block-column">
    //             <BlankBlock></BlankBlock>
    //             <div>
    //                 <Button type="fill" onClick={testApiHandle()}>BBBBBB</Button>
    //             </div>
    //             {/* <BlankBlock></BlankBlock> */}
    //         </div>
    //         <div className="block-column">
    //             <BlankBlock></BlankBlock>
    //             {/* <BlankBlock></BlankBlock>
    //             <BlankBlock></BlankBlock> */}
    //         </div>
    //     </div>
    // );
}

const HomeStyled = styled(ChartTest)`
display: flex;
flex-direction: row;
width: 100%;
flex-wrap: wrap;

justify-content: flex-start;
background-color: ${fetchTheme('pageBackground', '#eaeaea')};

    .block-column {
        display: flex;
        flex-direction: column;
        /* min-width: 50%; */
    }
`

export default function HomeExport() {
    return (<HomeStyled theme={layoutThemeObject}></HomeStyled>);
};