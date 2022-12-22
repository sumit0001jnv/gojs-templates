import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function Headers(props) {
    const navigate = useNavigate();
    function onClick(url) {
        navigate(url);
    }


    return <>
        <div style={{ 'display': 'flex', 'columnGap': 8, padding: 8 }}>
            <div style={{
                padding: 2, background: '/grid-layout' === window.location.pathname ? "orange" : "#42aaee", cursor: 'pointer', "&:hover": {
                    background: '#ccc'
                }
            }} onClick={() => onClick('/grid-layout')}>Grid Layout</div>
            <div
                style={{ padding: 2, background: '/tree-layout' === window.location.pathname ? "orange" : "#42aaee", cursor: 'pointer' }}
                onClick={() => onClick('/tree-layout')}
            >Tree Layout</div>
            <div style={{ padding: 2, background: '/circular-layout' === window.location.pathname ? "orange" : "#42aaee", cursor: 'pointer' }}
                onClick={() => onClick('/circular-layout')}>Circular Layout</div>

            <div style={{ padding: 2, background: '/gojs-diagram' === window.location.pathname ? "orange" : "#42aaee", cursor: 'pointer' }}
                onClick={() => onClick('/gojs-diagram')}>Gojs Diagram</div>
        </div>

    </>

}