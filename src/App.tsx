import React from 'react';

import {atom, RecoilRoot, selector, useRecoilState, useRecoilValue,} from 'recoil';
import {Building, Race, Unit} from "./Star";


function App() {
    return (
        <RecoilRoot>
            <SimcityCalculator/>
        </RecoilRoot>
    );
}

// db
const buildings: Array<Building> = [
    new Building("커맨드센터", 6, 5, 7, 6, Race.TERRAN),
    new Building("서플라이 디포", 10, 9, 10, 5, Race.TERRAN),
    new Building("리파이너리", 8, 7, 0, 0, Race.TERRAN),
    new Building("배럭", 16, 7, 8, 15, Race.TERRAN),
    new Building("아카데미", 8, 3, 0, 7, Race.TERRAN),
];

const units: Array<Unit> = [
    new Unit("SCV", 23, 23, Race.TERRAN),
    new Unit("마린", 17, 20, Race.TERRAN),
    new Unit("파이어뱃", 23, 22, Race.TERRAN),
    new Unit("파이어뱃(영웅)", 23, 28, Race.TERRAN),
    new Unit("메딕", 17, 20, Race.TERRAN),
];

enum MarginType {WIDTH, HEIGHT}

enum CalcOp {EQUAL, LESS, GREATER, LESS_EQUAL, GREATER_EQUAL}

function _op(x: number, y: number, target_size: number, op: CalcOp): boolean {
    const sum = x + y;
    switch (op) {
        case CalcOp.EQUAL:
            return sum === target_size;
        case CalcOp.LESS:
            return sum < target_size;
        case CalcOp.GREATER:
            return sum > target_size;
        case CalcOp.LESS_EQUAL:
            return sum <= target_size;
        case CalcOp.GREATER_EQUAL:
            return sum >= target_size;
    }
}

function is_ok(a: Building, b: Building, target_size: number, type: MarginType, op: CalcOp): boolean {
    // a: 위 or 왼쪽
    // b: 아래 or 오른쪽
    switch (type) {
        case MarginType.WIDTH:
            return _op(a.left, b.right, target_size, op);
        case MarginType.HEIGHT:
            return _op(a.up, b.down, target_size, op);
    }
}

//---------------------------------------------------------------------------------------
const selectedState = atom({
    key: 'selectedState',
    default: {
        'margin_type': MarginType.WIDTH,
        'calc_op': CalcOp.EQUAL,
        'input_sz': 20,
    },
});

function SimcityCalculator() {
    return (
        <div>
            <MarginTypeSelect/>
            <CalcOpSelect/>
            <SizeInput/>

            <hr/>

            <CalcResult/>
        </div>
    );
}

function MarginTypeSelect() {
    const [state, setState] = useRecoilState(selectedState);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState({
            ...state,
            'margin_type': parseInt(event.target.value),
        });
    }

    return (
        <select onChange={onChange}>
            <option value={MarginType.WIDTH}>가로 (ㅁ|ㅁ)</option>
            <option value={MarginType.HEIGHT}>세로 (믐)</option>
        </select>
    );
}

function CalcOpSelect() {
    const [state, setState] = useRecoilState(selectedState);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState({
            ...state,
            'calc_op': parseInt(event.target.value),
        });
    }

    return (
        <select onChange={onChange}>
            <option value={CalcOp.EQUAL}>==</option>
            <option value={CalcOp.LESS}>&lt; (미만)</option>
            <option value={CalcOp.LESS_EQUAL}>&le; (이하)</option>
            <option value={CalcOp.GREATER}>&gt; (초과)</option>
            <option value={CalcOp.LESS}>&ge; (이상)</option>
        </select>
    );
}

function SizeInput() {
    const [state, setState] = useRecoilState(selectedState);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            'input_sz': parseInt(event.target.value),
        });
    };

    return (
        <input type="number" value={state.input_sz} onChange={onChange}/>
    );
}

const calcMargins = selector({
    key: 'calcMargins',
    get: ({get}) => {
        const state = get(selectedState);

        const result: Array<[Building, Building]> = [];

        for (const a of buildings) {
            for (const b of buildings) {
                if (is_ok(a, b, state.input_sz, state.margin_type, state.calc_op)) {
                    result.push([a, b]);
                }
            }
        }

        return result;
    },
});

function CalcResult() {
    const result = useRecoilValue(calcMargins);

    return <ul>
        위 or 왼쪽 ................................................. 아래 or 오른쪽
        {result.map((pair, index) =>
            <li key={index}>{pair[0].toString()} / {pair[1].toString()}</li>
        )}
    </ul>;
}

export default App;
