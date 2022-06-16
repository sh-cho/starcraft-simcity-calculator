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
    // terran
    new Building("커맨드센터", 6, 5, 7, 6, Race.TERRAN),
    new Building("서플라이 디포", 10, 9, 10, 5, Race.TERRAN),
    new Building("리파이너리", 8, 7, 0, 0, Race.TERRAN),
    new Building("배럭", 16, 7, 8, 15, Race.TERRAN),
    new Building("아카데미", 8, 3, 0, 7, Race.TERRAN),
    new Building("팩토리", 8, 7, 8, 7, Race.TERRAN),
    new Building("스타포트", 16, 15, 8, 9, Race.TERRAN),
    new Building("사이언스 퍼실리티", 16, 15, 10, 9, Race.TERRAN),
    new Building("엔지니어링 베이", 16, 15, 16, 19, Race.TERRAN),
    new Building("아머리", 0, 0, 0, 9, Race.TERRAN),
    new Building("미사일 터렛", 16, 15, 0, 15, Race.TERRAN),
    new Building("벙커", 16, 15, 8, 15, Race.TERRAN),
    new Building("컴샛/뉴클리어", -5, 0, 16, 6, Race.TERRAN),
    new Building("컨트롤 타워", -15, 3, 8, 9, Race.TERRAN),
    new Building("코버트옵스/피직스랩", -15, 3, 8, 9, Race.TERRAN),
    new Building("머신샵", -7, 0, 8, 7, Race.TERRAN),
    // new Building("노라드 ||", 0, 0, 0, 0, Race.TERRAN),
    // new Building("이온캐논", 0, 0, 0, 0, Race.TERRAN),
    // new Building("Psi Disrupter", 0, 10, 10, 0, Race.TERRAN),
    // new Building("Power Generator", 8, 0, 20, 4, Race.TERRAN),

    // protoss
    new Building("넥서스", 8, 7, 9, 8, Race.PROTOSS),
    new Building("로보틱스 퍼실리티", 12, 7, 16, 11, Race.PROTOSS),
    new Building("파일런", 16, 15, 20, 11, Race.PROTOSS),
    new Building("어시밀레이터", 16, 15, 0, 7, Race.PROTOSS),
    new Building("옵저베이터리", 4, 3, 16, 3, Race.PROTOSS),
    new Building("게이트웨이", 16, 15, 16, 7, Race.PROTOSS),
    new Building("포톤 캐논", 12, 11, 16, 15, Race.PROTOSS),
    new Building("시타델 오브 아둔", 24, 7, 8, 7, Race.PROTOSS),
    new Building("사이버네틱스 코어", 8, 7, 8, 7, Race.PROTOSS),
    new Building("템플러 아카이브", 16, 15, 8, 7, Race.PROTOSS),
    new Building("포지", 12, 11, 8, 11, Race.PROTOSS),
    new Building("스타게이트", 16, 15, 8, 15, Race.PROTOSS),
    new Building("플릿비콘", 8, 0, 0, 7, Race.PROTOSS),
    new Building("아비터 트리뷰널", 4, 3, 4, 3, Race.PROTOSS),
    new Building("로보틱스 서포트 베이", 16, 15, 0, 11, Race.PROTOSS),
    new Building("쉴드 배터리", 16, 15, 16, 15, Race.PROTOSS),

    // zerg
    new Building("인페스티드 커맨드센터", 6, 5, 7, 6, Race.ZERG),
    new Building("해처리/레어/하이브", 15, 14, 16, 15, Race.ZERG),
    new Building("나이더스 커널", 0, 0, 0, 0, Race.ZERG),
    new Building("히드라리스크 덴", 8, 7, 0, 7, Race.ZERG),
    new Building("디파일러 마운드", 16, 15, 0, 27, Race.ZERG),
    new Building("스파이어/그레이터 스파이어", 4, 3, 0, 7, Race.ZERG),
    new Building("퀸즈 네스트", 10, 15, 4, 3, Race.ZERG),
    new Building("에볼루션 챔버", 4, 15, 0, 11, Race.ZERG),
    new Building("울트라리스크 카번", 8, 15, 0, 0, Race.ZERG),
    new Building("스포닝 풀", 12, 7, 4, 13, Race.ZERG),
    new Building("크립/성큰/스포어", 8, 8, 8, 8, Race.ZERG),
    new Building("익스트랙터", 0, 0, 0, 0, Race.ZERG),
    // new Building(, Race.ZERG),
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
        위 or 왼쪽 ............................................................................................................. 아래 or 오른쪽
        {result.map((pair, index) =>
            <li key={index}>{pair[0].toString()} / {pair[1].toString()}</li>
        )}
    </ul>;
}

export default App;
